export function isValidPercentInput(s: string) {
  if (s === "") return true;
  const v = s.replace(",", ".");
  if (!/^(\d{1,3})(\.(\d{0,2})?)?$/.test(v)) return false;
  const num = Number(v);
  return !isNaN(num) && num <= 100;
}

export function normalizePercentOnBlur(s: string) {
  const v = s.replace(",", ".");
  let num = Number(v);
  if (isNaN(num)) num = 0;
  num = Math.min(Math.max(num, 0), 100);
  return num.toFixed(2);
}

export const formatPercent = (v: string | number) => {
  const num = typeof v === "number" ? v : Number(v || 0);
  return isNaN(num) ? "" : num.toFixed(2);
};

export const parsePercent = (s: string) => {
  const cleaned = s.replace(/[^\d.,-]/g, "").replace(",", ".");
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
};

export const toPercentString = (n?: string | number) => {
  if (n === undefined || n === null) return "";
  const v = typeof n === "string" ? Number(n) : n;
  return Number.isFinite(v) ? v.toFixed(2) : "";
};

export const fromPercentInput = (s: string) => {
  const normalized = s.replace(",", ".").trim();
  const v = Number(normalized);
  return Number.isFinite(v) ? v : 0;
};
