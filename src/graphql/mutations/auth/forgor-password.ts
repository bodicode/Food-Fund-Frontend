import { gql } from "@apollo/client";

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($forgotPasswordInput3: ForgotPasswordInput!) {
    forgotPassword(input: $forgotPasswordInput3) {
      emailSent
      message
    }
  }
`;
