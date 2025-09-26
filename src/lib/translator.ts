export const translateMessage = (msg: string) => {
  // Register
  if (msg.includes("User registered successfully")) {
    return "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực.";
  }
  if (msg.includes("Email confirmed successfully")) {
    return "Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ.";
  }
  if (msg.includes("Confirmation code sent to your email")) {
    return "Kiểm tra email của bạn để lấy mã xác nhận.";
  }
  if (msg.includes("Password reset code sent to your email")) {
    return "Mã đặt lại mật khẩu đã được gửi đến email của bạn.";
  }
  // Forgot password
  if (msg.includes("Password reset code sent to your email")) {
    return "Mã đặt lại mật khẩu đã được gửi đến email của bạn.";
  }
  if (
    msg.includes(
      "Password reset successful. You can now sign in with your new password."
    )
  ) {
    return "Thay đổi mật khẩu thành công, bạn có thể đăng nhập ngay bây giờ.";
  }
  // Signout
  if (msg.includes("User signed out successfully")) {
    return "Đăng xuất thành công.";
  }

  return msg;
};

export const translateError = (err: unknown): string => {
  try {
    const errorObj = JSON.parse(JSON.stringify(err));
    const gqlError = errorObj?.errors?.[0];

    const cognitoError =
      (gqlError?.extensions?.details?.[0]?.message?.trim()
        ? gqlError.extensions.details[0].message
        : null) ??
      gqlError?.extensions?.context?.cognitoError ??
      "";

    // Login
    if (cognitoError.includes("Incorrect username or password")) {
      return "Sai email hoặc mật khẩu. Vui lòng thử lại.";
    }
    if (cognitoError.includes("User is not confirmed"))
      return "Tài khoản chưa được xác thực email.";
    // Signup
    if (cognitoError.includes("User already exists"))
      return "Người dùng đã tồn tại (email này đã được sử dụng).";
    if (cognitoError.includes("phone number"))
      return "Số điện thoại không hợp lệ.";
    if (cognitoError.includes("InvalidPasswordException"))
      return "Mật khẩu không hợp lệ. Vui lòng đặt mật khẩu mạnh hơn.";
    // Confirm register
    if (cognitoError.includes("Invalid verification code provided"))
      return "Mã xác nhận không đúng. Vui lòng thử lại.";
    if (cognitoError.includes("ExpiredCodeException"))
      return "Mã xác nhận đã hết hạn. Vui lòng yêu cầu gửi lại.";
    if (cognitoError.includes("Confirmation code must be 6 digits"))
      return "Mã xác nhận phải có 6 chữ số.";
    // Confirm forgot password
    if (
      cognitoError.includes(
        "Invalid code provided, please request a code again"
      )
    )
      return "Mã xác nhận không đúng. Vui lòng thử lại.";
    if (gqlError?.extensions?.code === "VALIDATION_ERROR") {
      const details = gqlError?.extensions?.details;
      if (Array.isArray(details) && details.length > 0) {
        return details[0]?.message || "Thông tin nhập vào không hợp lệ.";
      }
      return "Thông tin nhập vào không hợp lệ.";
    }

    return gqlError?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
  } catch {
    return "Có lỗi xảy ra. Vui lòng thử lại sau.";
  }
};

export const translateRole = (role?: string): string => {
  if (!role) return "Người dùng";

  switch (role.toUpperCase()) {
    case "DONOR":
      return "Người ủng hộ";
    case "ADMIN":
      return "Quản trị viên";
    case "KITCHEN":
      return "Nhân viên bếp";
    case "DELIVERY":
      return "Nhân viên giao hàng";
    case "FUNDRAISER":
      return "Nhà vận động";
    default:
      return role;
  }
};
