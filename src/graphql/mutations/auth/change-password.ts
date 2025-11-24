import { gql } from "@apollo/client";

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      message
      timestamp
    }
  }
`;
