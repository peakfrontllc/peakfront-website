function cell(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function csvFile(filename: string, headers: string[], rows: (string | number | null | undefined)[][]) {
  const body = [headers, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
  return new Response(`\uFEFF${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export function moneyCell(value: number | null) {
  return value === null ? "" : value;
}

export function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}
