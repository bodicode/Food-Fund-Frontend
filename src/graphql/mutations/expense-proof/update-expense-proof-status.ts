import { gql } from "@apollo/client";

export const UPDATE_EXPENSE_PROOF_STATUS = gql`
  mutation UpdateExpenseProofStatus(
    $id: String!
    $input: UpdateExpenseProofStatusInput!
  ) {
    updateExpenseProofStatus(id: $id, input: $input) {
      id
      status
      adminNote
      changedStatusAt
    }
  }
`;
