export type SignUpInput = {
  email: string;
  name: string;
  password: string;
};

export type SignUpResponse = {
  signUp: {
    emailSent: boolean;
    message: string;
    userSub: string;
  };
};

export interface ConfirmSignUpInput {
  confirmationCode: string;
  email: string;
}

export interface ConfirmSignUpResponse {
  confirmSignUp: {
    confirmed: boolean;
    message: string;
  };
}

export interface ResendCodeInput {
  email: string;
}

export interface ResendCodeResponse {
  resendConfirmationCode: {
    emailSent: boolean;
    message: string;
  };
}
