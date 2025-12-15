import { gql } from "@apollo/client";

export const GET_EXPENSE_PROOF = gql`
  query GetExpenseProof($id: String!) {
    getExpenseProof(id: $id) {
      id
      request {
        id
        items {
          ingredientName
          quantity
          estimatedUnitPrice
          estimatedTotalPrice
          supplier
        }
        campaignPhase {
          id
          phaseName
          location
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
      changedStatusAt
      created_at
      updated_at
    }
  }
`;
