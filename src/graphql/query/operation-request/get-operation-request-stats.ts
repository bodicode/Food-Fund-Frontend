import { gql } from "@apollo/client";

export const GET_OPERATION_REQUEST_STATS = gql`
  query GetOperationRequestStats($filter: OperationRequestFilterInput) {
    operationRequestStats(filter: $filter) {
      totalRequests
      pendingCount
      approvedCount
      rejectedCount
      disbursedCount
    }
  }
`;
