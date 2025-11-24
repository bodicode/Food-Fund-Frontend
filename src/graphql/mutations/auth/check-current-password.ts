import { gql } from "@apollo/client";

export const CHECK_CURRENT_PASSWORD = gql`
  mutation CheckCurrentPassword($input: CheckCurrentPasswordInput!) {
    checkCurrentPassword(input: $input) {
      message
    }
  }
`;
