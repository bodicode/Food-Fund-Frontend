import { z } from "zod";

// Common validation patterns
const phoneSchema = z
  .string()
  .regex(/^(\+84|0)[3-9]\d{8}$/, "Số điện thoại không hợp lệ")
  .optional()
  .or(z.literal(""));

const urlSchema = z
  .string()
  .url("URL không hợp lệ")
  .optional()
  .or(z.literal(""));

// Update Profile Schema
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .optional(),
  bio: z
    .string()
    .max(500, "Tiểu sử không được quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  phone_number: phoneSchema,
  address: z
    .string()
    .max(200, "Địa chỉ không được quá 200 ký tự")
    .optional()
    .or(z.literal("")),
  avatar_url: urlSchema,
});

// Update User Account Schema (Admin)
export const updateUserAccountSchema = z.object({
  full_name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .optional(),
  email: z
    .string()
    .email("Email không hợp lệ")
    .optional(),
  bio: z
    .string()
    .max(500, "Tiểu sử không được quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  phone_number: phoneSchema,
  avatar_url: urlSchema,
  is_active: z.boolean().optional(),
});

// Export types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateUserAccountInput = z.infer<typeof updateUserAccountSchema>;