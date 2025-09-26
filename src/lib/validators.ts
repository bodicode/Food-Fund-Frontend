import { SignUpInput } from "@/types/api/sign-up";

export function validateRegisterForm(
  form: SignUpInput,
  confirmPassword: string
): string | null {
  if (!form.name || !form.email || !form.password) {
    return "Vui lòng nhập đầy đủ thông tin";
  }
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    return "Email không hợp lệ";
  }
  if (form.password.length < 6) {
    return "Mật khẩu phải ít nhất 6 ký tự";
  }
  if (form.password !== confirmPassword) {
    return "Mật khẩu xác nhận không khớp";
  }
  return null;
}
