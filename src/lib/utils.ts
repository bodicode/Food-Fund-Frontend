import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
