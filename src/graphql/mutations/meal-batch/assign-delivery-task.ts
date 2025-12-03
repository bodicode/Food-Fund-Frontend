import { gql } from "@apollo/client";

export const ASSIGN_DELIVERY_TASK = gql`
  mutation AssignMultiple($input: AssignTaskToStaffInput!) {
    assignDeliveryTaskToStaff(input: $input) {
      id
      deliveryStaffId
      mealBatchId
      status
      created_at
    }
  }
`;
