import { gql } from "@apollo/client";

export const CONFIRM_SIGNUP_MUTATION = gql`
  mutation ConfirmSignUp($confirmSignUpInput2: ConfirmSignUpInput!) {
    confirmSignUp(input: $confirmSignUpInput2) {
      confirmed
      message
    }
  }
`;
