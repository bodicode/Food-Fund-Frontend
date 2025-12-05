import { gql } from "@apollo/client";

export const GET_ORGANIZATION_JOIN_REQUESTS = gql`
  query GetOrganizationJoinRequests($limit: Int, $offset: Int, $status: String) {
    getOrganizationJoinRequests(limit: $limit, offset: $offset, status: $status) {
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
