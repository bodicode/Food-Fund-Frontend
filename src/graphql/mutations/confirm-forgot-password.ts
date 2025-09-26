import { gql } from "@apollo/client";

export const CONFIRM_FORGOT_PASSWORD_MUTATION = gql`
  mutation confirmForgotPassword(
    $confirmForgotPasswordInput2: ConfirmForgotPasswordInput!
  ) {
    confirmForgotPassword(input: $confirmForgotPasswordInput2) {
      message
      passwordReset
    }
  }
`;
