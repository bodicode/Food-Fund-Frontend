import { z } from "zod";

// Campaign status enum
const campaignStatusSchema = z.enum([
  "PENDING",
  "APPROVED", 
  "ACTIVE",
  "REJECTED",
  "COMPLETED",
  "CANCELLED"
]);

// Date validation helper
const dateStringSchema = z.string().refine((date) => {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}, "Ngày không hợp lệ");

// Percentage validation (0-100)
const percentageSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Phần trăm phải là số hợp lệ")
  .refine((val) => {
    const num = parseFloat(val);
    return num >= 0 && num <= 100;
  }, "Phần trăm phải từ 0 đến 100");

// Amount validation (positive number)
const amountSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Số tiền phải là số dương hợp lệ")
  .refine((val) => parseFloat(val) > 0, "Số tiền phải lớn hơn 0");

// Create Campaign Schema
export const createCampaignSchema = z.object({
  title: z
    .string()
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
    .max(200, "Tiêu đề không được quá 200 ký tự"),
  description: z
    .string()
    .min(50, "Mô tả phải có ít nhất 50 ký tự")
    .max(2000, "Mô tả không được quá 2000 ký tự"),
  coverImageFileKey: z
    .string()
    .min(1, "Vui lòng chọn ảnh bìa"),
  location: z
    .string()
    .min(5, "Địa điểm phải có ít nhất 5 ký tự")
    .max(200, "Địa điểm không được quá 200 ký tự"),
  targetAmount: amountSchema,
  
  // Budget percentages
  ingredientBudgetPercentage: percentageSchema,
  cookingBudgetPercentage: percentageSchema,
  deliveryBudgetPercentage: percentageSchema,
  
  // Dates
  fundraisingStartDate: dateStringSchema,
  fundraisingEndDate: dateStringSchema,
  ingredientPurchaseDate: dateStringSchema,
  cookingDate: dateStringSchema,
  deliveryDate: dateStringSchema,
  
  categoryId: z.string().uuid("ID danh mục không hợp lệ"),
}).refine((data) => {
  // Check if percentages sum to 100
  const total = parseFloat(data.ingredientBudgetPercentage) + 
                parseFloat(data.cookingBudgetPercentage) + 
                parseFloat(data.deliveryBudgetPercentage);
  return Math.abs(total - 100) < 0.01;
}, {
  message: "Tổng phần trăm phân bổ phải bằng 100%",
  path: ["ingredientBudgetPercentage"],
}).refine((data) => {
  // Check if fundraising end date is after start date
  const startDate = new Date(data.fundraisingStartDate);
  const endDate = new Date(data.fundraisingEndDate);
  return endDate >= startDate;
}, {
  message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
  path: ["fundraisingEndDate"],
}).refine((data) => {
  // Check if dates are in logical order
  const fundraisingEnd = new Date(data.fundraisingEndDate);
  const ingredientPurchase = new Date(data.ingredientPurchaseDate);
  const cooking = new Date(data.cookingDate);
  const delivery = new Date(data.deliveryDate);
  
  return fundraisingEnd <= ingredientPurchase && 
         ingredientPurchase <= cooking && 
         cooking <= delivery;
}, {
  message: "Thứ tự ngày phải hợp lý: Kết thúc gây quỹ → Mua nguyên liệu → Nấu ăn → Giao hàng",
  path: ["deliveryDate"],
});

// Update Campaign Schema
export const updateCampaignSchema = z.object({
  title: z
    .string()
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
    .max(200, "Tiêu đề không được quá 200 ký tự")
    .optional(),
  description: z
    .string()
    .min(50, "Mô tả phải có ít nhất 50 ký tự")
    .max(2000, "Mô tả không được quá 2000 ký tự")
    .optional(),
  targetAmount: amountSchema.optional(),
  categoryId: z.string().uuid("ID danh mục không hợp lệ").optional(),
  coverImageFileKey: z.string().optional(),
  location: z
    .string()
    .min(5, "Địa điểm phải có ít nhất 5 ký tự")
    .max(200, "Địa điểm không được quá 200 ký tự")
    .optional(),
    
  // Dates
  fundraisingStartDate: dateStringSchema.optional(),
  fundraisingEndDate: dateStringSchema.optional(),
  ingredientPurchaseDate: dateStringSchema.optional(),
  cookingDate: dateStringSchema.optional(),
  deliveryDate: dateStringSchema.optional(),
  
  // Budget percentages
  ingredientBudgetPercentage: percentageSchema.optional(),
  cookingBudgetPercentage: percentageSchema.optional(),
  deliveryBudgetPercentage: percentageSchema.optional(),
});

// Campaign Filter Schema
export const campaignFilterSchema = z.object({
  status: z.array(campaignStatusSchema).optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["NEWEST_FIRST", "OLDEST_FIRST"]).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

// Change Campaign Status Schema
export const changeCampaignStatusSchema = z.object({
  campaignId: z.string().uuid("ID chiến dịch không hợp lệ"),
  status: campaignStatusSchema,
  reason: z.string().max(500, "Lý do không được quá 500 ký tự").optional(),
});

// Export types
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CampaignFilterInput = z.infer<typeof campaignFilterSchema>;
export type ChangeCampaignStatusInput = z.infer<typeof changeCampaignStatusSchema>;
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;