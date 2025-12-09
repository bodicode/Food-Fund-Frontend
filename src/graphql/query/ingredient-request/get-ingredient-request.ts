import { gql } from "@apollo/client";

export const GET_INGREDIENT_REQUEST = gql`
  query GetIngredientRequest($id: String!) {
    getIngredientRequest(id: $id) {
      id
      totalCost
      status
      changedStatusAt
      created_at
      adminNote
      kitchenStaff {
        id
        full_name
      }
      campaignPhase {
        id
        phaseName
        cookingDate
        status
        campaign {
          id
          title
          receivedAmount
        }
      }
      items {
        id
        ingredientName
        quantity
        estimatedUnitPrice
        estimatedTotalPrice
        supplier
      }
      organization {
        id
        name
        bank_account_name
        bank_account_number
        bank_name
        bank_short_name
      }
    }
  }
`;
