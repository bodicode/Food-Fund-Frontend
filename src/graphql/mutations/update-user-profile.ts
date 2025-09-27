import { gql } from "@apollo/client";

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUser($updateUserProfileInput: UpdateUserInput!) {
    updateUser(updateUserProfileInput: $updateUserProfileInput) {
      bio
      avatar_url
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
