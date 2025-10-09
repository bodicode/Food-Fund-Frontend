import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanInput<T extends Record<string, unknown>>(
  input: T,
  allowEmpty: (keyof T)[] = []
): Partial<T> {
  const result: Partial<T> = {};

  (Object.entries(input) as [keyof T, unknown][]).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      (value !== "" || allowEmpty.includes(key))
    ) {
      result[key] = value as T[keyof T];
    }
  });

  return result;
}

/**
 * Format ngày theo định dạng dd-MM-yyyy
 * @param dateInput Ngày dạng string hoặc Date
 * @returns Chuỗi định dạng "09-10-2025"
 */
export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "—";

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "—";

    return format(date, "dd-MM-yyyy", { locale: vi });
  } catch (error) {
    console.error("Lỗi formatDate:", error);
    return "—";
  }
}

/**
 * Format ngày kèm giờ (dd-MM-yyyy | HH:mm)
 */
export function formatDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "—";

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "—";

    return format(date, "dd-MM-yyyy | HH:mm", { locale: vi });
  } catch {
    return "—";
  }
}

/**
 * Bỏ ký tự không phải số, trả về chuỗi số thuần
 */
export function parseCurrency(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Định dạng số thành tiền Việt Nam đồng (VD: "1500000" → "1.500.000 ₫")
 */
export function formatCurrency(value: string | number): string {
  const numericValue =
    typeof value === "string" ? parseCurrency(value) : value.toString();
  if (!numericValue) return "0";

  const formatted = new Intl.NumberFormat("vi-VN").format(Number(numericValue));
  return `${formatted} ₫`;
}

/**
 * Parse input người dùng & tự format khi nhập liệu (cho Input)
 * Dùng khi bạn muốn nhập tiền mà vẫn hiển thị dấu chấm động
 */
export function handleCurrencyInput(e: React.ChangeEvent<HTMLInputElement>) {
  const onlyNums = parseCurrency(e.target.value);
  e.target.value = new Intl.NumberFormat("vi-VN").format(Number(onlyNums));
}
