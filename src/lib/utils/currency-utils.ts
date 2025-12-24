export function parseCurrency(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCurrency(value: string | number): string {
  const numericValue =
    typeof value === "string" ? parseCurrency(value) : value.toString();
  if (!numericValue) return "0 VNĐ";
  const formatted = new Intl.NumberFormat("vi-VN").format(Number(numericValue));
  return `${formatted} VNĐ`;
}

export function handleCurrencyInput(e: React.ChangeEvent<HTMLInputElement>) {
  const onlyNums = parseCurrency(e.target.value);
  e.target.value = new Intl.NumberFormat("vi-VN").format(Number(onlyNums));
}
