import { gql } from "@apollo/client";

export const GET_INFLOW_TRANSACTION_DETAILS = gql`
  query GetInflowTransactionDetails($getInflowTransactionDetailsId: String!) {
    getInflowTransactionDetails(id: $getInflowTransactionDetailsId) {
      amount
      campaignPhaseId
      created_at
      id
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
      campaignPhase {
        phaseName
      }
      organization {
        bank_account_name
        bank_account_number
        bank_name
        bank_short_name
        name
        email
        representative_name
      }
    }
  }
`;
