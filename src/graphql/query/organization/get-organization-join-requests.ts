import { gql } from "@apollo/client";

export const GET_ORGANIZATION_JOIN_REQUESTS = gql`
  query {
    getOrganizationJoinRequests {
      joinRequests {
        id
        joined_at
        member {
          email
          full_name
          phone_number
          user_name
        }
        member_id
        member_role
        status
      }
      message
      success
      total
    }
  }
`;
