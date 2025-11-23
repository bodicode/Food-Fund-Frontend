import { gql } from "@apollo/client";

export const CREATE_INFLOW_TRANSACTION = gql`
  mutation CreateInflowTransaction($input: CreateInflowTransactionInput!) {
    createInflowTransaction(input: $input) {
      id
      amount
      status
      transactionType
      created_at
      campaignPhaseId
      operationRequestId
      ingredientRequestId
      proof
      receiver {
        full_name
        email
        role
        user_name
      }
      receiverId
      reportedAt
      isReported
      updated_at
    }
  }
`;
