import client from "@/lib/apollo-client";
import { LOGIN_MUTATION } from "@/graphql/mutations/auth/login";
import { SIGNUP_MUTATION } from "@/graphql/mutations/auth/signup";
import { CONFIRM_SIGNUP_MUTATION } from "@/graphql/mutations/auth/confirm-signup";
import { RESEND_CONFIRM_CODE_MUTATION } from "@/graphql/mutations/auth/resend-confirm-code";

import {
  SignUpInput,
  SignUpResponse,
  ConfirmSignUpInput,
  ConfirmSignUpResponse,
  ResendCodeResponse,
  ResendCodeInput,
} from "@/types/api/sign-up";
import {
  ConfirmForgotPasswordInput,
  ConfirmForgotPasswordResponse,
  ForgotPasswordInput,
  ForgotPasswordResponse,
} from "@/types/api/forgot-password";
import { FORGOT_PASSWORD_MUTATION } from "@/graphql/mutations/auth/forgor-password";
import { CONFIRM_FORGOT_PASSWORD_MUTATION } from "@/graphql/mutations/auth/confirm-forgot-password";
import { decodeIdToken } from "@/lib/jwt-utils";
import { SignInInput, SignInResponse } from "@/types/api/sign-in";
import { SIGNOUT_MUTATION } from "@/graphql/mutations/auth/signout";

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
  signout(
    accessToken: string
  ): Promise<{ message: string; success: boolean; timestamp: string }>;
}

export const graphQLAuthService: AuthService = {
  async login(input: SignInInput) {
    try {
      const { data, error } = await client.mutate<
        { signIn: SignInResponse["signIn"] },
        { input: SignInInput }
      >({
        mutation: LOGIN_MUTATION,
        variables: { input },
      });

      if (!data?.signIn) {
        return Promise.reject(error);
      }

      const { idToken } = data.signIn;
      const decodedUser = decodeIdToken(idToken);

      return {
        ...data.signIn,
        decodedUser,
      };
    } catch (error) {
      console.error("AuthService.login error:", error);
      throw error;
    }
  },

  async signup(input: SignUpInput) {
    try {
      const { data, error } = await client.mutate<
        { signUp: SignUpResponse["signUp"] },
        { signUpInput2: SignUpInput }
      >({
        mutation: SIGNUP_MUTATION,
        variables: { signUpInput2: input },
      });

      if (!data?.signUp) {
        return Promise.reject(error);
      }

      return data.signUp;
    } catch (error) {
      console.error("AuthService.signup error:", error);
      throw error;
    }
  },

  async confirmSignup(input: ConfirmSignUpInput) {
    try {
      const { data, error } = await client.mutate<
        ConfirmSignUpResponse,
        { confirmSignUpInput2: ConfirmSignUpInput }
      >({
        mutation: CONFIRM_SIGNUP_MUTATION,
        variables: { confirmSignUpInput2: input },
      });

      if (!data?.confirmSignUp) {
        return Promise.reject(error);
      }

      return data.confirmSignUp;
    } catch (error) {
      console.error("AuthService.confirmSignup error:", error);
      throw error;
    }
  },

  async resendConfirmCode(input: ResendCodeInput) {
    try {
      const { data, error } = await client.mutate<
        ResendCodeResponse,
        { resendConfirmationCodeInput2: ResendCodeInput }
      >({
        mutation: RESEND_CONFIRM_CODE_MUTATION,
        variables: { resendConfirmationCodeInput2: input },
      });

      if (!data?.resendConfirmationCode) {
        return Promise.reject(error);
      }

      return data.resendConfirmationCode;
    } catch (error) {
      console.error("AuthService.resendConfirmCode error:", error);
      throw error;
    }
  },

  async forgotPassword(input: ForgotPasswordInput) {
    try {
      const { data, error } = await client.mutate<
        ForgotPasswordResponse,
        { forgotPasswordInput3: ForgotPasswordInput }
      >({
        mutation: FORGOT_PASSWORD_MUTATION,
        variables: { forgotPasswordInput3: input },
      });

      if (!data?.forgotPassword) {
        return Promise.reject(error);
      }

      return data.forgotPassword;
    } catch (error) {
      console.error("AuthService.forgotPassword error:", error);
      throw error;
    }
  },

  async confirmForgotPassword(input: ConfirmForgotPasswordInput) {
    try {
      const { data, error } = await client.mutate<
        ConfirmForgotPasswordResponse,
        { confirmForgotPasswordInput2: ConfirmForgotPasswordInput }
      >({
        mutation: CONFIRM_FORGOT_PASSWORD_MUTATION,
        variables: { confirmForgotPasswordInput2: input },
      });

      if (!data?.confirmForgotPassword) {
        return Promise.reject(error);
      }

      return data.confirmForgotPassword;
    } catch (error) {
      console.error("AuthService.confirmForgotPassword error:", error);
      throw error;
    }
  },

  async signout(accessToken: string) {
    try {
      const { data, error } = await client.mutate<{
        signOut: { message: string; success: boolean; timestamp: string };
      }>({
        mutation: SIGNOUT_MUTATION,
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });

      if (!data?.signOut?.success) {
        return Promise.reject(error);
      }

      return data.signOut;
    } catch (err) {
      console.error("AuthService.signout error:", err);
      throw err;
    }
  },
};
