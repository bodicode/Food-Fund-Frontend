// Validation messages
export const VALIDATION_MESSAGES = {
  INVALID_CAMPAIGN: "Chiến dịch không hợp lệ.",
  INVALID_DATE_RANGE: "Ngày kết thúc phải sau (hoặc bằng) ngày bắt đầu.",
  INVALID_PERCENTAGE_TOTAL: "Tổng phần trăm phân bổ phải bằng 100%.",
  INVALID_INPUT: "Thông tin nhập vào không hợp lệ.",
  GENERAL_ERROR: "Có lỗi xảy ra. Vui lòng thử lại sau.",
} as const;

// Validation rules
export const VALIDATION_RULES = {
  PERCENTAGE_TOLERANCE: 0.01,
  CONFIRMATION_CODE_LENGTH: 6,
} as const;