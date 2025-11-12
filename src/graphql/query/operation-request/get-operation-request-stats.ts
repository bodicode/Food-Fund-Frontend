import { gql } from "@apollo/client";

export const GET_OPERATION_REQUEST_STATS = gql`
  query GetOperationRequestStats {
    operationRequestStats {
      totalRequests
      pendingCount
      approvedCount
      rejectedCount
    }
  }
`;
