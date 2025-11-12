import { gql } from "@apollo/client";

export const GET_OPERATION_REQUEST = gql`
  query GetOperationRequest($id: String!) {
    operationRequest(id: $id) {
      id
      title
      totalCost
      expenseType
      status
      adminNote
      changedStatusAt
      created_at
      user {
        id
        full_name
      }
      campaignPhase {
        id
        phaseName
      }
    }
  }
`;
