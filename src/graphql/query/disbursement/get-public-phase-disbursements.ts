import { gql } from "@apollo/client";

export const GET_PUBLIC_PHASE_DISBURSEMENTS = gql`
  query GetPublicPhaseDisbursements($campaignPhaseId: String!) {
    getPublicPhaseDisbursements(campaignPhaseId: $campaignPhaseId) {
      id
      amount
      campaignPhaseId
      completedAt
      createdAt
      transactionType
      proof
      receiver {
        fullName
        id
        username
        role
        email
      }
    }
  }
`;
