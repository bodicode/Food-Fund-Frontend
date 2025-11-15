// Success messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực.",
  EMAIL_CONFIRMED: "Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ.",
  CONFIRMATION_CODE_SENT: "Kiểm tra email của bạn để lấy mã xác nhận.",
  PASSWORD_RESET_CODE_SENT: "Mã đặt lại mật khẩu đã được gửi đến email của bạn.",
  PASSWORD_RESET_SUCCESS: "Thay đổi mật khẩu thành công, bạn có thể đăng nhập ngay bây giờ.",
  USER_SIGNED_OUT: "Đăng xuất thành công.",
  ORGANIZATION_REQUEST_SUBMITTED: "Gửi yêu cầu thành công. Vui lòng chờ quản trị viên duyệt",
  JOIN_REQUEST_SUBMITTED: "Yêu cầu tham gia tổ chức đã được gửi thành công. Vui lòng chờ quản trị viên duyệt",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INCORRECT_CREDENTIALS: "Sai email hoặc mật khẩu. Vui lòng thử lại.",
  USER_NOT_CONFIRMED: "Tài khoản chưa được xác thực email.",
  PASSWORD_ATTEMPTS_EXCEEDED: "Bạn đã nhập sai mật khẩu quá nhiều lần. Tài khoản tạm bị khoá.",
  AUTH_CIRCUIT_OPEN: "Bạn nhập sai quá nhiều, vui lòng thử lại sau.",
  USER_ALREADY_EXISTS: "Người dùng đã tồn tại (email này đã được sử dụng).",
  INVALID_PHONE_NUMBER: "Số điện thoại không hợp lệ.",
  INVALID_PASSWORD: "Mật khẩu không hợp lệ. Vui lòng đặt mật khẩu mạnh hơn.",
  INVALID_VERIFICATION_CODE: "Mã xác nhận không đúng. Vui lòng thử lại.",
  EXPIRED_CODE: "Mã xác nhận đã hết hạn. Vui lòng yêu cầu gửi lại.",
  CONFIRMATION_CODE_FORMAT: "Mã xác nhận phải có 6 chữ số.",
  INVALID_CODE_REQUEST_AGAIN: "Mã xác nhận không đúng. Vui lòng thử lại.",
  SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  ACTIVE_CAMPAIGN_EXISTS: "Bạn hiện đang có một chiến dịch đang hoạt động. Vui lòng hoàn thành chiến dịch này trước khi tạo chiến dịch mới.",
} as const;

// Message patterns for matching
export const MESSAGE_PATTERNS = {
  USER_REGISTERED: "User registered successfully",
  EMAIL_CONFIRMED: "Email confirmed successfully",
  CONFIRMATION_CODE_SENT: "Confirmation code sent to your email",
  PASSWORD_RESET_CODE_SENT: "Password reset code sent to your email",
  PASSWORD_RESET_SUCCESS: "Password reset successful. You can now sign in with your new password.",
  USER_SIGNED_OUT: "User signed out successfully",
  ORGANIZATION_REQUEST: "Organization request has been submitted successfully. Waiting for admin approval.",
  JOIN_REQUEST: "Join request to as Delivery Staff (food distribution) has been submitted successfully. Waiting for approval.",
  ACTIVE_CAMPAIGN_EXISTS: "FundraiserHasActiveCampaignException",
} as const;