import { gql } from "@apollo/client";

export const UPDATE_USER_ACCOUNT = gql`
  mutation updateUserAccount($userId: ID!, $input: UpdateUserAccountInput!) {
    updateUserAccount(userId: $userId, input: $input) {
      address
      avatar_url
      bio
      created_at
      email
      full_name
      id
      is_active
      phone_number
      role
      updated_at
      user_name
    }
  }
`;
