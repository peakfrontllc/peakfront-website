export function lengthField(purposeName: string, typeName: string): "boom" | "bed" | "" {
  const purpose = purposeName.toLowerCase();
  const type = typeName.toLowerCase();
  if (purpose.includes("lifting") || /\bcrane\b|boom truck/.test(type)) return "boom";
  if (purpose.includes("access") && /boom|spider/.test(type) && !/scissor|mast/.test(type)) return "boom";
  if (purpose.includes("transport") && /trailer|truck|recovery/.test(type)) return "bed";
  return "";
}

export function metersValue(value: string) {
  const match = value.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*m$/);
  return match ? `${match[1]} m` : "";
}

export function boomValue(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

export function capacityLabel(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  if (!text || /\bcapacity\b/i.test(text)) return text;
  if (/\b(person|people)\b/i.test(text)) return `${text} capacity`;
  return text;
}

export function measureNote(boomLength: string, bedLength: string, sizeName: string) {
  const size = sizeName.trim().toLowerCase();
  if (boomLength && boomLength.toLowerCase() !== size) {
    return /boom/i.test(boomLength) ? boomLength : `Boom ${boomLength}`;
  }
  if (bedLength && bedLength.toLowerCase() !== size) return bedLength;
  return "";
}

export function equipmentFacts(sizeName: string, capacity: string, boomLength: string, bedLength: string) {
  const size = sizeName.trim().toLowerCase();
  const facts: string[] = [];
  const boom = boomLength.trim();
  if (boom) {
    const text = /boom/i.test(boom) ? boom : `${boom} boom`;
    if (!size.includes(text.toLowerCase())) facts.push(text);
  }
  const bed = bedLength.trim();
  if (bed && bed.toLowerCase() !== boom.toLowerCase()) {
    const text = /length|bed/i.test(bed) ? bed : `${bed} length`;
    if (!size.includes(text.toLowerCase())) facts.push(text);
  }
  const cap = capacity.trim();
  if (cap && cap.toLowerCase() !== size && !facts.some((fact) => fact.toLowerCase().includes(cap.toLowerCase()))) {
    facts.unshift(capacityLabel(cap));
  }
  return facts.join(" · ");
}
