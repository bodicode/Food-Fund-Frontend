import { gql } from "@apollo/client";

export const GET_MY_PROFILE = gql`
  query getMyProfile {
    getMyProfile {
      message
      userProfile {
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
  }
`;


