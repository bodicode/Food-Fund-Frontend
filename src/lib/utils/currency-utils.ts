export function parseCurrency(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCurrency(value: string | number): string {
  const numericValue =
    typeof value === "string" ? parseCurrency(value) : value.toString();
  if (!numericValue) return "0 ₫";
  return `${new Intl.NumberFormat("vi-VN").format(Number(numericValue))}₫`;
}

export function handleCurrencyInput(e: React.ChangeEvent<HTMLInputElement>) {
  const onlyNums = parseCurrency(e.target.value);
  e.target.value = new Intl.NumberFormat("vi-VN").format(Number(onlyNums));
}
