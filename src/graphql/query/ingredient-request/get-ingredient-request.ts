import { gql } from "@apollo/client";

export const GET_INGREDIENT_REQUEST = gql`
  query GetIngredientRequest($id: String!) {
    getIngredientRequest(id: $id) {
      id
      totalCost
      status
      changedStatusAt
      created_at
      kitchenStaff {
        id
        full_name
      }
      campaignPhase {
        id
        phaseName
        cookingDate
        status
      }
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
