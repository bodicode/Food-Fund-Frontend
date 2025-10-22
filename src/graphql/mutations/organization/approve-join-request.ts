import { gql } from "@apollo/client";

export const APPROVE_JOIN_REQUEST = gql`
  mutation ($requestId: String!) {
    approveJoinRequest(requestId: $requestId) {
      joinRequest {
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
      requestId
      success
    }
  }
`;
