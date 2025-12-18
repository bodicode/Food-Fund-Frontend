import { gql } from "@apollo/client";

export const GET_DELIVERY_TASKS = gql`
  query GetDeliveryTasks($filter: DeliveryTaskFilterInput!) {
    deliveryTasks(filter: $filter) {
      id
      deliveryStaff {
        id
        full_name
      }
      mealBatch {
        id
        foodName
        quantity
        cookedDate
        status
      }
      mealBatchId
      status
      created_at
    }
  }
`;
