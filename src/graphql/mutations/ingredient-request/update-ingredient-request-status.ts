import { gql } from "@apollo/client";

export const UPDATE_INGREDIENT_REQUEST_STATUS = gql`
  mutation UpdateIngredientRequestStatus(
    $id: String!
    $input: UpdateIngredientRequestStatusInput!
  ) {
    updateIngredientRequestStatus(id: $id, input: $input) {
      id
      status
      changedStatusAt
    }
  }
`;
