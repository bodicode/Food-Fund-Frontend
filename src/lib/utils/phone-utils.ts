/**
 * Validate and format Vietnamese phone number
 * Only accepts +84 format
 * - +84xxxxxxxxx (11 digits starting with +84)
 * - 84xxxxxxxxx (11 digits starting with 84) - will be converted to +84
 * - 0xxxxxxxxx (10 digits starting with 0) - will be converted to +84
 */

export const VIETNAM_PHONE_REGEX = /^\+84[0-9]{9}$/;

export const formatVietnamesePhone = (phone: string): string => {
  if (!phone) return "";

  // Remove all spaces and dashes
  let cleaned = phone.replace(/[\s\-]/g, "");

  // Only allow digits and +
  cleaned = cleaned.replace(/[^\d+]/g, "");

  // If starts with 0, replace with +84
  if (cleaned.startsWith("0")) {
    cleaned = "+84" + cleaned.slice(1);
  }
  // If starts with 84 (without +), add +
  else if (cleaned.startsWith("84") && !cleaned.startsWith("+84")) {
    cleaned = "+" + cleaned;
  }
  // If doesn't start with + or 0 or 84, auto-add +84
  else if (cleaned && !cleaned.startsWith("+") && !cleaned.startsWith("84") && !cleaned.startsWith("0")) {
    cleaned = "+84" + cleaned;
  }

  return cleaned;
};

export const isValidVietnamesePhone = (phone: string): boolean => {
  if (!phone) return false;

  const formatted = formatVietnamesePhone(phone);
  return VIETNAM_PHONE_REGEX.test(formatted);
};

export const getPhoneErrorMessage = (phone: string): string | null => {
  if (!phone) return "Vui lòng nhập số điện thoại.";

  if (!isValidVietnamesePhone(phone)) {
    return "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (+84 theo sau 9 chữ số).";
  }

  return null;
};
