
import { gql } from "@apollo/client";

export const GET_DELIVERY_TASKS = gql`
  query Tasks($filter: DeliveryTaskFilterInput!) {
    deliveryTasks(filter: $filter) {
      id
      deliveryStaff {
        id
        full_name
      }
      mealBatchId
      status
      created_at
    }
  }
`;

export const GET_DELIVERY_TASK_BY_ID = gql`
  query GetTask($id: String!) {
    deliveryTask(id: $id) {
      id
      status
      created_at
      updated_at
      deliveryStaff {
        id
        full_name
      }
      mealBatch {
        id
        foodName
        quantity
      }
      statusLogs {
        id
        status
        note
        changedBy
        createdAt
        user {
          id
          full_name
        }
      }
    }
  }
`;
