import { z } from "zod";
import { USER_ROLES } from "@/constants";

// Organization role schema
const organizationRoleSchema = z.enum([USER_ROLES.DELIVERY_STAFF, USER_ROLES.KITCHEN_STAFF]);

// Organization status schema
const organizationStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE"]);

// Create Organization Request Schema
export const createOrganizationRequestSchema = z.object({
  name: z
    .string()
    .min(3, "Tên tổ chức phải có ít nhất 3 ký tự")
    .max(100, "Tên tổ chức không được quá 100 ký tự"),
  description: z
    .string()
    .min(20, "Mô tả phải có ít nhất 20 ký tự")
    .max(1000, "Mô tả không được quá 1000 ký tự"),
  address: z
    .string()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(200, "Địa chỉ không được quá 200 ký tự"),
  phone_number: z
    .string()
    .regex(/^(\+84|0)[3-9]\d{8}$/, "Số điện thoại không hợp lệ"),
  email: z
    .string()
    .email("Email không hợp lệ"),
  website: z
    .string()
    .url("Website không hợp lệ")
    .optional()
    .or(z.literal("")),
  logo_url: z
    .string()
    .url("URL logo không hợp lệ")
    .optional()
    .or(z.literal("")),
});

// Join Organization Request Schema
export const joinOrganizationRequestSchema = z.object({
  organizationId: z.string().uuid("ID tổ chức không hợp lệ"),
  role: organizationRoleSchema,
  message: z
    .string()
    .max(500, "Tin nhắn không được quá 500 ký tự")
    .optional()
    .or(z.literal("")),
});

// Update Organization Schema
export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, "Tên tổ chức phải có ít nhất 3 ký tự")
    .max(100, "Tên tổ chức không được quá 100 ký tự")
    .optional(),
  description: z
    .string()
    .min(20, "Mô tả phải có ít nhất 20 ký tự")
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  address: z
    .string()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(200, "Địa chỉ không được quá 200 ký tự")
    .optional(),
  phone_number: z
    .string()
    .regex(/^(\+84|0)[3-9]\d{8}$/, "Số điện thoại không hợp lệ")
    .optional(),
  email: z
    .string()
    .email("Email không hợp lệ")
    .optional(),
  website: z
    .string()
    .url("Website không hợp lệ")
    .optional()
    .or(z.literal("")),
  logo_url: z
    .string()
    .url("URL logo không hợp lệ")
    .optional()
    .or(z.literal("")),
});

// Change Organization Status Schema
export const changeOrganizationStatusSchema = z.object({
  organizationId: z.string().uuid("ID tổ chức không hợp lệ"),
  status: organizationStatusSchema,
  reason: z
    .string()
    .max(500, "Lý do không được quá 500 ký tự")
    .optional()
    .or(z.literal("")),
});

// Organization Filter Schema
export const organizationFilterSchema = z.object({
  status: z.array(organizationStatusSchema).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["NEWEST_FIRST", "OLDEST_FIRST", "NAME_ASC", "NAME_DESC"]).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

// Export types
export type CreateOrganizationRequestInput = z.infer<typeof createOrganizationRequestSchema>;
export type JoinOrganizationRequestInput = z.infer<typeof joinOrganizationRequestSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type ChangeOrganizationStatusInput = z.infer<typeof changeOrganizationStatusSchema>;
export type OrganizationFilterInput = z.infer<typeof organizationFilterSchema>;
export type OrganizationRole = z.infer<typeof organizationRoleSchema>;
export type OrganizationStatus = z.infer<typeof organizationStatusSchema>;