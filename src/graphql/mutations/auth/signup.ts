import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation signUp($signUpInput2: SignUpInput!) {
    signUp(input: $signUpInput2) {
      emailSent
      message
      userSub
    }
  }
`;
