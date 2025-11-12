import { gql } from "@apollo/client";

export const CREATE_OPERATION_REQUEST = gql`
  mutation CreateOperationRequest($input: CreateOperationRequestInput!) {
    createOperationRequest(input: $input) {
      id
      title
      totalCost
      expenseType
      status
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
