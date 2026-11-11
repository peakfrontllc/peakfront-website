export const RATE_VIEWS = ["cards", "list", "table"] as const;
export type RateView = (typeof RATE_VIEWS)[number];

export function rateView(value: string | undefined): RateView {
  return value === "list" || value === "table" ? value : "cards";
}
