import { gql } from "@apollo/client";

export const MY_JOIN_REQUEST = gql`
  query MyJoinRequest {
    myJoinRequest {
      id
      message
      organization {
        address
        created_at
        description
        id
        name
        phone_number
        representative {
          avatar_url
          bio
          email
          full_name
          id
          is_active
          role
          user_name
        }
        status
        website
      }
      requested_role
      status
      success
    }
  }
`;
