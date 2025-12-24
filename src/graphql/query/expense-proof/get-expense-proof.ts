import { gql } from "@apollo/client";

export const GET_EXPENSE_PROOF = gql`
  query GetExpenseProof($id: String!) {
    getExpenseProof(id: $id) {
      id
      requestId
      request {
        items {
          ingredientName
          quantity
          estimatedUnitPrice
          estimatedTotalPrice
          supplier
        }
        campaignPhase {
          phaseName
          location
          campaign {
            title
          }
        }
      }
      media
      amount
      status
      adminNote
      changedStatusAt
      created_at
      updated_at
    }
  }
`;
