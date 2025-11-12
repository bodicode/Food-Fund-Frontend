import { gql } from "@apollo/client";

export const GET_MEAL_BATCHES = gql`
  query GetMealBatches($filter: MealBatchFilterInput) {
    getMealBatches(filter: $filter) {
      id
      campaignPhaseId
      foodName
      quantity
      status
      cookedDate
      kitchenStaff {
        id
        full_name
      }
    }
  }
`;
