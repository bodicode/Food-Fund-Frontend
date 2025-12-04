import { gql } from "@apollo/client";

export const GET_MY_DISBURSEMENTS = gql`
  query GetMyDisbursements($limit: Int, $page: Int) {
    getMyDisbursements(limit: $limit, page: $page) {
      hasMore
      items {
        id
        amount
        campaignPhaseId
        campaignPhase {
          phaseName
          campaign {
            title
          }
        }
        created_at
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
