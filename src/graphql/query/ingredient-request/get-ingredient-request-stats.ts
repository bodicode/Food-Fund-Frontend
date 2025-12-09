import { gql } from "@apollo/client";

export const GET_INGREDIENT_REQUEST_STATS = gql`
  query GetIngredientRequestStats {
    getIngredientRequestStats {
      totalRequests
      pendingCount
      approvedCount
      rejectedCount
      disbursedCount
    }
  }
`;
