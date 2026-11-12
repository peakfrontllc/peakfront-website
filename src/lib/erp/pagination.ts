export const PAGE_SIZE = 24;

export function pageCount(total: number, size = PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / size));
}

export function currentPage(value: string | undefined, total: number, size = PAGE_SIZE) {
  const parsed = Number(value);
  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  return Math.min(page, pageCount(total, size));
}

export function pageSlice<T>(items: T[], page: number, size = PAGE_SIZE) {
  const start = (page - 1) * size;
  return items.slice(start, start + size);
}

export function pageItems(page: number, count: number): Array<number | "ellipsis"> {
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1);
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(count - 1, page + 1);
  if (start > 2) items.push("ellipsis");
  for (let index = start; index <= end; index += 1) items.push(index);
  if (end < count - 1) items.push("ellipsis");
  items.push(count);
  return items;
}
