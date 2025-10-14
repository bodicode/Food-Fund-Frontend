import { gql } from "@apollo/client";

export const UPDATE_MY_PROFILE = gql`
  mutation updateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
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


