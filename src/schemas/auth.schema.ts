import { z } from "zod";

// Common validation patterns
const emailSchema = z.string().email("Email không hợp lệ");
const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số");

const phoneSchema = z
  .string()
  .regex(/^(\+84|0)[3-9]\d{8}$/, "Số điện thoại không hợp lệ")
  .optional();

// Sign In Schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

// Sign Up Schema
export const signUpSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50, "Tên không được quá 50 ký tự"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// Confirm Sign Up Schema
export const confirmSignUpSchema = z.object({
  email: emailSchema,
  confirmationCode: z.string().length(6, "Mã xác nhận phải có 6 chữ số").regex(/^\d+$/, "Mã xác nhận chỉ chứa số"),
});

// Resend Code Schema
export const resendCodeSchema = z.object({
  email: emailSchema,
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Confirm Forgot Password Schema
export const confirmForgotPasswordSchema = z.object({
  email: emailSchema,
  confirmationCode: z.string().length(6, "Mã xác nhận phải có 6 chữ số").regex(/^\d+$/, "Mã xác nhận chỉ chứa số"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// Google Auth Schema
export const googleAuthSchema = z.object({
  idToken: z.string().min(1, "Token Google không hợp lệ"),
});

// Export types
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ConfirmSignUpInput = z.infer<typeof confirmSignUpSchema>;
export type ResendCodeInput = z.infer<typeof resendCodeSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ConfirmForgotPasswordInput = z.infer<typeof confirmForgotPasswordSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;