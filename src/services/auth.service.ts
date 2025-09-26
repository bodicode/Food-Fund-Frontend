// src/services/auth.service.ts
import client from "@/lib/apollo-client";
import { LOGIN_MUTATION } from "@/graphql/mutations/login";
import { SIGNUP_MUTATION } from "@/graphql/mutations/signup";
import { CONFIRM_SIGNUP_MUTATION } from "@/graphql/mutations/confirm-signup";
import { RESEND_CONFIRM_CODE_MUTATION } from "@/graphql/mutations/resend-confirm-code";

import { SignInInput, SignInResponse } from "@/types";
import {
  SignUpInput,
  SignUpResponse,
  ConfirmSignUpInput,
  ConfirmSignUpResponse,
  ResendCodeResponse,
  ResendCodeInput,
} from "@/types/sign-up";
import {
  ConfirmForgotPasswordInput,
  ConfirmForgotPasswordResponse,
  ForgotPasswordInput,
  ForgotPasswordResponse,
} from "@/types/forgot-password";
import { FORGOT_PASSWORD_MUTATION } from "@/graphql/mutations/forgor-password";
import { CONFIRM_FORGOT_PASSWORD_MUTATION } from "@/graphql/mutations/confirm-forgot-password";

export interface AuthService {
  login(input: SignInInput): Promise<SignInResponse["signIn"]>;
  signup(input: SignUpInput): Promise<SignUpResponse["signUp"]>;
  confirmSignup(
    input: ConfirmSignUpInput
  ): Promise<ConfirmSignUpResponse["confirmSignUp"]>;
  resendConfirmCode(
    input: ResendCodeInput
  ): Promise<ResendCodeResponse["resendConfirmationCode"]>;
  forgotPassword(
    input: ForgotPasswordInput
  ): Promise<ForgotPasswordResponse["forgotPassword"]>;
  confirmForgotPassword(
    input: ConfirmForgotPasswordInput
  ): Promise<ConfirmForgotPasswordResponse["confirmForgotPassword"]>;
}

export const graphQLAuthService: AuthService = {
  async login(input) {
    const { data } = await client.mutate<
      { signIn: SignInResponse["signIn"] },
      { input: SignInInput }
    >({
      mutation: LOGIN_MUTATION,
      variables: { input },
    });

    if (!data?.signIn) throw new Error("Login failed");
    return data.signIn;
  },

  async signup(input) {
    const { data } = await client.mutate<
      { signUp: SignUpResponse["signUp"] },
      { signUpInput2: SignUpInput }
    >({
      mutation: SIGNUP_MUTATION,
      variables: { signUpInput2: input },
    });

    if (!data?.signUp) throw new Error("Signup failed");
    return data.signUp;
  },

  async confirmSignup(input) {
    const { data } = await client.mutate<
      ConfirmSignUpResponse,
      { confirmSignUpInput2: ConfirmSignUpInput }
    >({
      mutation: CONFIRM_SIGNUP_MUTATION,
      variables: { confirmSignUpInput2: input },
    });

    if (!data?.confirmSignUp) throw new Error("Confirm signup failed");
    return data.confirmSignUp;
  },

  async resendConfirmCode(input) {
    const { data } = await client.mutate<
      ResendCodeResponse,
      { resendConfirmationCodeInput2: ResendCodeInput }
    >({
      mutation: RESEND_CONFIRM_CODE_MUTATION,
      variables: { resendConfirmationCodeInput2: input },
    });

    if (!data?.resendConfirmationCode) {
      throw new Error("Resend confirmation code failed");
    }
    return data.resendConfirmationCode;
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const { data } = await client.mutate<
      ForgotPasswordResponse,
      { forgotPasswordInput3: ForgotPasswordInput }
    >({
      mutation: FORGOT_PASSWORD_MUTATION,
      variables: { forgotPasswordInput3: input },
    });

    if (!data?.forgotPassword) throw new Error("Forgot password failed");
    return data.forgotPassword;
  },

  async confirmForgotPassword(input: ConfirmForgotPasswordInput) {
    const { data } = await client.mutate<
      ConfirmForgotPasswordResponse,
      { confirmForgotPasswordInput2: ConfirmForgotPasswordInput }
    >({
      mutation: CONFIRM_FORGOT_PASSWORD_MUTATION,
      variables: { confirmForgotPasswordInput2: input },
    });

    if (!data?.confirmForgotPassword)
      throw new Error("Confirm forgot password failed");
    return data.confirmForgotPassword;
  },
};
