import "server-only";

import { assertProjectRepoPath } from "@/lib/project-paths";

const GITHUB_API = "https://api.github.com";

export type GitHubFileChange = {
  path: string;
  content: Buffer;
};

function githubToken() {
  return (
    process.env.PROJECTS_GITHUB_TOKEN?.trim() ||
    process.env.GITHUB_TOKEN?.trim() ||
    ""
  );
}

export function usesGitHubStore() {
  return Boolean(process.env.VERCEL) && Boolean(githubToken());
}

export function githubRepo() {
  return process.env.PROJECTS_GITHUB_REPO?.trim() || "peakfrontllc/peakfront-website";
}

export function githubBranch() {
  return process.env.PROJECTS_GITHUB_BRANCH?.trim() || "main";
}

function githubHeaders(extra?: HeadersInit): HeadersInit {
  return {
    Authorization: `Bearer ${githubToken()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "peakfront-website",
    ...extra,
  };
}

async function githubJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: githubHeaders(init?.headers),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "GitHub rejected the project token. Check PROJECTS_GITHUB_TOKEN has Contents read/write on this repo.",
      );
    }
    throw new Error(
      detail.slice(0, 280) || `GitHub request failed (${response.status}).`,
    );
  }

  return response.json() as Promise<T>;
}

export async function readGitHubTextFile(repoPath: string) {
  const [owner, repo] = githubRepo().split("/");
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${repoPath}?ref=${encodeURIComponent(githubBranch())}`;
  const response = await fetch(url, {
    headers: githubHeaders({ Accept: "application/vnd.github.raw" }),
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Could not read ${repoPath} from GitHub.`);
  }
  return response.text();
}

export async function readGitHubBinaryFile(repoPath: string) {
  const [owner, repo] = githubRepo().split("/");
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${repoPath}?ref=${encodeURIComponent(githubBranch())}`;
  const response = await fetch(url, {
    headers: githubHeaders({ Accept: "application/vnd.github.raw" }),
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Could not read ${repoPath} from GitHub.`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function commitGitHubFiles(
  message: string,
  files: GitHubFileChange[],
  deletes: string[] = [],
) {
  if (files.length === 0 && deletes.length === 0) return;
  files.forEach((file) => assertProjectRepoPath(file.path));
  deletes.forEach(assertProjectRepoPath);

  const [owner, repo] = githubRepo().split("/");
  const branch = githubBranch();
  const base = `${GITHUB_API}/repos/${owner}/${repo}`;

  const ref = await githubJson<{ object: { sha: string } }>(
    `${base}/git/ref/heads/${branch}`,
  );
  const parentSha = ref.object.sha;
  const parent = await githubJson<{ tree: { sha: string } }>(
    `${base}/git/commits/${parentSha}`,
  );

  const tree = [];

  for (const file of files) {
    const blob = await githubJson<{ sha: string }>(`${base}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: file.content.toString("base64"),
        encoding: "base64",
      }),
    });
    tree.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  for (const path of deletes) {
    tree.push({
      path,
      mode: "100644",
      type: "blob",
      sha: null,
    });
  }

  const nextTree = await githubJson<{ sha: string }>(`${base}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: parent.tree.sha,
      tree,
    }),
  });

  const commit = await githubJson<{ sha: string }>(`${base}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: nextTree.sha,
      parents: [parentSha],
    }),
  });

  await githubJson(`${base}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
}
