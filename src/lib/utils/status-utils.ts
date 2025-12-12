/**
 * Utility functions for translating status codes to Vietnamese
 */

// Campaign Status Translations
export const CAMPAIGN_STATUS_TRANSLATIONS: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  VERIFIED: "Đã xác minh",
  ACTIVE: "Đang gây quỹ",
  PROCESSING: "Đang trong tiến trình",
  REJECTED: "Từ chối",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  ENDED: "Đã kết thúc",
  DRAFT: "Bản nháp",
  EXPIRED: "Hết hạn",
  SUSPENDED: "Tạm ngưng",
};

// Payment Status Translations
export const PAYMENT_STATUS_TRANSLATIONS: Record<string, string> = {
  COMPLETED: "Hoàn thành",
  OVERPAID: "Chuyển dư",
  PARTIAL: "Chuyển thiếu",
};

// Transaction Status Translations
export const TRANSACTION_STATUS_TRANSLATIONS: Record<string, string> = {
  SUCCESS: "Thành công",
  PENDING: "Chờ xử lý",
  FAILED: "Thất bại",
  CANCELLED: "Đã hủy",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  REFUNDED: "Đã hoàn tiền",
};

// Request Status Translations (for ingredient requests, expense proofs, etc.)
export const REQUEST_STATUS_TRANSLATIONS: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  IN_PROGRESS: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

// Organization Status Translations
export const ORGANIZATION_STATUS_TRANSLATIONS: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  VERIFIED: "Đã xác minh",
  ACTIVE: "Hoạt động",
  REJECTED: "Từ chối",
  SUSPENDED: "Tạm ngưng",
  INACTIVE: "Không hoạt động",
};

// User Status Translations
export const USER_STATUS_TRANSLATIONS: Record<string, string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Không hoạt động",
  SUSPENDED: "Tạm ngưng",
  BANNED: "Bị cấm",
  PENDING: "Chờ xác nhận",
  VERIFIED: "Đã xác minh",
};

// Delivery Task Status Translations
export const DELIVERY_TASK_STATUS_TRANSLATIONS: Record<string, string> = {
  PENDING: "Đang chờ",
  ACCEPTED: "Đã nhận",
  OUT_FOR_DELIVERY: "Đang giao",
  COMPLETED: "Hoàn thành",
  FAILED: "Thất bại",
  REJECTED: "Đã từ chối",
};

/**
 * Translate campaign status to Vietnamese
 */
export const translateCampaignStatus = (status?: string): string => {
  if (!status) return "Không xác định";
  return CAMPAIGN_STATUS_TRANSLATIONS[status.toUpperCase()] || status;
};

/**
 * Translate payment status to Vietnamese
 */
export const translatePaymentStatus = (status?: string): string => {
  if (!status) return "Không xác định";
  return PAYMENT_STATUS_TRANSLATIONS[status.toUpperCase()] || status;
};

/**
 * Translate transaction status to Vietnamese
 */
export const translateTransactionStatus = (status?: string): string => {
  if (!status) return "Không xác định";
  return TRANSACTION_STATUS_TRANSLATIONS[status.toUpperCase()] || status;
};

/**
 * Translate request status to Vietnamese
 */
export const translateRequestStatus = (status?: string): string => {
  if (!status) return "Không xác định";
  return REQUEST_STATUS_TRANSLATIONS[status.toUpperCase()] || status;
};

/**
 * Translate organization status to Vietnamese
 */
export const translateOrganizationStatus = (status?: string): string => {
  if (!status) return "Không xác định";
  return ORGANIZATION_STATUS_TRANSLATIONS[status.toUpperCase()] || status;
};

/**
 * Translate user status to Vietnamese
 */
export const translateUserStatus = (status?: string): string => {
  if (!status) return "Không xác định";
  return USER_STATUS_TRANSLATIONS[status.toUpperCase()] || status;
};

/**
 * Translate delivery task status to Vietnamese
 */
export const translateDeliveryTaskStatus = (status?: string): string => {
  if (!status) return "Không xác định";
  return DELIVERY_TASK_STATUS_TRANSLATIONS[status.toUpperCase()] || status;
};

/**
 * Generic status translator - tries to find the status in all translation maps
 */
export const translateStatus = (status?: string): string => {
  if (!status) return "Không xác định";

  const upperStatus = status.toUpperCase();

  return (
    CAMPAIGN_STATUS_TRANSLATIONS[upperStatus] ||
    PAYMENT_STATUS_TRANSLATIONS[upperStatus] ||
    TRANSACTION_STATUS_TRANSLATIONS[upperStatus] ||
    REQUEST_STATUS_TRANSLATIONS[upperStatus] ||
    ORGANIZATION_STATUS_TRANSLATIONS[upperStatus] ||
    USER_STATUS_TRANSLATIONS[upperStatus] ||
    MEAL_BATCH_STATUS_TRANSLATIONS[upperStatus] ||
    DELIVERY_TASK_STATUS_TRANSLATIONS[upperStatus] ||
    status
  );
};

/**
 * Get status color class based on status
 */
export const getStatusColorClass = (status?: string): string => {
  if (!status) return "bg-gray-100 text-gray-700";

  const upperStatus = status.toUpperCase();

  const colorMap: Record<string, string> = {
    // Success states
    SUCCESS: "bg-green-100 text-green-700",
    COMPLETED: "bg-green-100 text-green-700",
    APPROVED: "bg-blue-100 text-blue-700",
    VERIFIED: "bg-blue-100 text-blue-700",
    ACTIVE: "bg-green-100 text-green-700",

    // Pending states
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",

    // Error states
    FAILED: "bg-red-100 text-red-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-red-100 text-red-700",
    SUSPENDED: "bg-red-100 text-red-700",
    BANNED: "bg-red-100 text-red-700",

    // Neutral states
    DRAFT: "bg-gray-100 text-gray-700",
    INACTIVE: "bg-gray-100 text-gray-700",
    EXPIRED: "bg-gray-100 text-gray-700",
    REFUNDED: "bg-purple-100 text-purple-700",

    // Meal batch states
    PREPARING: "bg-yellow-100 text-yellow-700",
    READY: "bg-green-100 text-green-700",
    DELIVERED: "bg-blue-100 text-blue-700",

    // Delivery task states
    ACCEPTED: "bg-blue-100 text-blue-700",
    OUT_FOR_DELIVERY: "bg-yellow-100 text-yellow-700",
  };

  return colorMap[upperStatus] || "bg-gray-100 text-gray-700";
};

// Meal Batch Status Translations
export const MEAL_BATCH_STATUS_TRANSLATIONS: Record<string, string> = {
  PREPARING: "Đang chuẩn bị",
  READY: "Đã sẵn sàng",
  DELIVERED: "Đã giao",
};
