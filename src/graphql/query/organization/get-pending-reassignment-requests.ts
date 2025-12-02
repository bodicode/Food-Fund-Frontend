import { gql } from "@apollo/client";

export const GET_PENDING_REASSIGNMENT_REQUESTS = gql`
  query PendingRequests {
    getPendingReassignmentRequests {
      id
      campaign {
        id
        title
      }
      organization {
        id
        name
      }
      status
      assignedAt
      expiresAt
    }
  }
`;
