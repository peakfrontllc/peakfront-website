export function toStoredImageSrc(src: string) {
  const trimmed = src.trim();
  const proxy = trimmed.match(/\/api\/project-media\/(.+)$/);
  if (proxy) return `/projects/images/${proxy[1]}`;
  return trimmed;
}

export function repoPathFromImageSrc(src: string, projectId?: string) {
  const stored = toStoredImageSrc(src);
  const match = stored.match(/^\/projects\/images\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const [, folder, filename] = match;
  if (
    folder.includes("..") ||
    filename.includes("..") ||
    !/^[a-z0-9-]+$/i.test(folder) ||
    !/^[a-z0-9._-]+$/i.test(filename)
  ) {
    return null;
  }
  if (projectId && folder !== projectId) return null;

  return `public/projects/images/${folder}/${filename}`;
}

export function assertProjectRepoPath(repoPath: string) {
  const normalized = repoPath.replace(/\\/g, "/");
  if (normalized.includes("..")) {
    throw new Error("Invalid project file path.");
  }
  if (normalized === "public/projects/projects.json") return;
  if (/^public\/projects\/images\/[a-z0-9-]+\/[a-z0-9._-]+$/i.test(normalized)) {
    return;
  }
  throw new Error("Invalid project file path.");
}
