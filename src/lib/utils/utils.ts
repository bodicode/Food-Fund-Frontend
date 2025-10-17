import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gộp className an toàn giữa Tailwind + condition
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Loại bỏ các key có giá trị undefined, null hoặc chuỗi rỗng
 * (trừ khi key nằm trong `allowEmpty`)
 */
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
 * Ép chuỗi hoặc số về dạng number an toàn
 * @param n Giá trị đầu vào
 * @param fallback Giá trị mặc định nếu parse thất bại
 */
export function toNumber(n?: string | number, fallback = 0): number {
  if (n === undefined || n === null) return fallback;
  const v = typeof n === "string" ? Number(n) : n;
  return Number.isFinite(v) ? v : fallback;
}

/**
 * Tính phần trăm tiến độ (ví dụ: 80%)
 */
export function calcProgress(
  received?: string | number,
  target?: string | number
): number {
  const raised = toNumber(received, 0);
  const goal = Math.max(toNumber(target, 0), 1);
  return Math.min(Math.round((raised / goal) * 100), 100);
}

/**
 * Tính số ngày còn lại đến ngày kết thúc (hiển thị cho người dùng)
 * @example calcDaysLeft("2025-12-20") -> "63 ngày"
 */
export function calcDaysLeft(endDate?: string, startDate?: string): string {
  if (!endDate) return "Không xác định";

  const now = new Date();
  const end = new Date(endDate);
  const start = startDate ? new Date(startDate) : null;

  if (start && now < start) {
    const days = Math.ceil(
      (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `Chưa bắt đầu (còn ${days} ngày)`;
  }

  if (now > end) return "Đã kết thúc";

  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return `${diff} ngày`;
}

/**
 * Trả về ảnh cover hợp lệ hoặc fallback mặc định
 */
export function coverSrc(src?: string, fallback = "/images/default-cover.jpg") {
  return src && src.trim() ? src : fallback;
}
