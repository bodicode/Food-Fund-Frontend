import { gql } from "@apollo/client";

export const GET_EXPENSE_PROOF_STATS = gql`
  query GetExpenseProofStats {
    getExpenseProofStats {
      totalProofs
      pendingCount
      approvedCount
      rejectedCount
    }
  }
`;
