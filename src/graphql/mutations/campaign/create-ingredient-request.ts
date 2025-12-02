import { gql } from "@apollo/client";

export const CREATE_INGREDIENT_REQUEST = gql`
  mutation CreateIngredientRequest($input: CreateIngredientRequestInput!) {
    createIngredientRequest(input: $input) {
      id
      campaignPhaseId
      kitchenStaffId
      totalCost
      status
      created_at
      items {
        id
        ingredientName
        quantity
        estimatedUnitPrice
        estimatedTotalPrice
        supplier
      }
    }
  }
`;
