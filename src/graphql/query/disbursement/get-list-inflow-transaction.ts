import { gql } from "@apollo/client";

export const GET_LIST_INFLOW_TRANSACTION = gql`
  query GetListInflowTransaction($filter: InflowTransactionFilterInput, $limit: Int!, $page: Int!) {
    getListInflowTransaction(filter: $filter, limit: $limit, page: $page) {
      hasMore
      items {
        amount
        campaignPhaseId
        created_at
        id
        ingredientRequestId
        isReported
        operationRequestId
        proof
        receiver {
          user_name
          full_name
          role
        }
        receiverId
        reportedAt
        status
        transactionType
        updated_at
      }
    }
  }
`;
