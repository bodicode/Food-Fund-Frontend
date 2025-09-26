export interface ForgotPasswordResponse {
  forgotPassword: {
    emailSent: boolean;
    message: string;
  };
}

export interface ConfirmForgotPasswordResponse {
  confirmForgotPassword: {
    message: string;
    passwordReset: boolean;
  };
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ConfirmForgotPasswordInput {
  email: string;
  confirmationCode: string;
  newPassword: string;
}
