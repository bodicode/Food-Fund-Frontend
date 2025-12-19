import { gql } from "@apollo/client";

export const GET_OPERATION_REQUESTS = gql`
  query OperationRequests($filter: OperationRequestFilterInput!, $sortBy: OperationRequestSortOrder) {
    operationRequests(filter: $filter, sortBy: $sortBy) {
      id
      title
      expenseType
      status
      totalCost
      user {
        id
        full_name
      }
      campaignPhase {
        id
        phaseName
        campaign {
          id
          title
        }
      }
      created_at
    }
  }
`;
