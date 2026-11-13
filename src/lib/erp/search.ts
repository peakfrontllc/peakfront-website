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

function phoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00971")) digits = digits.slice(5);
  else if (digits.startsWith("971")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

function phoneTokenHits(parts: string[], token: string) {
  const needle = phoneDigits(token);
  if (needle.length < 4) return false;
  return parts.some((part) => {
    const stored = phoneDigits(part);
    return stored.length >= 4 && (stored.includes(needle) || needle.includes(stored));
  });
}

export function matchesClientSearch(query: string, parts: string[]) {
  const tokens = searchTokens(query);
  if (tokens.length === 0) return true;
  const haystack = searchHaystack(parts);
  const numericQuery = tokens.every((token) => /^\d+$/.test(token));
  if (numericQuery) return phoneTokenHits(parts, tokens.join("")) || tokens.every((token) => tokenHits(haystack, token));
  return tokens.every((token) => tokenHits(haystack, token) || phoneTokenHits(parts, token));
}
