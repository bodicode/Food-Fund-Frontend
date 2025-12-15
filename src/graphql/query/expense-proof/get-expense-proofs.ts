import { gql } from "@apollo/client";

export const GET_EXPENSE_PROOFS = gql`
  query GetExpenseProofs(
    $filter: ExpenseProofFilterInput
    $limit: Int
    $offset: Int
  ) {
    getExpenseProofs(filter: $filter, limit: $limit, offset: $offset) {
      id
      requestId
      request {
        campaignPhase {
          phaseName
          campaign {
            id
            title
          }
        }
      }
      media
      amount
      status
      adminNote
      created_at
    }
  }
`;
