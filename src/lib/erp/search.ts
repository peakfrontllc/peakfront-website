const PERSONNEL_LIFT = /boom lift|scissor lift|spider lift|mast lift|cherry picker|man ?lift/;

function compact(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function searchTokens(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map(compact)
    .filter(Boolean);
}

export function searchHaystack(parts: string[]) {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  const aliases = PERSONNEL_LIFT.test(text) ? " manlift man lift cherry picker" : "";
  return compact(`${text}${aliases}`);
}

function tokenHits(haystack: string, token: string) {
  let from = 0;
  while (from < haystack.length) {
    const at = haystack.indexOf(token, from);
    if (at < 0) return false;
    const before = haystack[at - 1] ?? "";
    if (!/\d/.test(token[0] ?? "") || !/\d/.test(before)) return true;
    from = at + 1;
  }
  return false;
}

export function matchesSearch(query: string, parts: string[]) {
  const tokens = searchTokens(query);
  if (tokens.length === 0) return true;
  const haystack = searchHaystack(parts);
  return tokens.every((token) => tokenHits(haystack, token));
}
