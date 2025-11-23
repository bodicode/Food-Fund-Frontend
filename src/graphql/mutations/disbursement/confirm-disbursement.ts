import { gql } from "@apollo/client";

export const CONFIRM_DISBURSEMENT = gql`
  mutation ConfirmDisbursement($input: ConfirmDisbursementInput!) {
    confirmDisbursement(input: $input) {
      id
      amount
      campaignPhaseId
      created_at
      ingredientRequestId
      isReported
      operationRequestId
      proof
      receiver {
        user_name
        full_name
        role
      }
      receiverId
      reportedAt
      status
      transactionType
      updated_at
    }
  }
`;
