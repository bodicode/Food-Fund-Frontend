import { gql } from "@apollo/client";

export const SEARCH_DONATIONS = gql`
  query SearchDonationStatements($input: SearchDonationInput!) {
    searchDonationStatements(input: $input) {
      campaignId
      campaignTitle
      generatedAt
      totalDonations
      totalReceived
      transactions {
        no
        donorName
        receivedAmount
        transactionDateTime
      }
    }
  }
`;
