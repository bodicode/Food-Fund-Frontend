import { gql } from "@apollo/client";

export const RESEND_CONFIRM_CODE_MUTATION = gql`
  mutation resendConfirmationCode($resendConfirmationCodeInput2: ResendCodeInput!) {
    resendConfirmationCode(input: $resendConfirmationCodeInput2) {
      emailSent
      message
    }
  }
`;
