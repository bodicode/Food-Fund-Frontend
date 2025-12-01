import { gql } from "@apollo/client";

// Query to get campaign donation statement
export const GET_CAMPAIGN_DONATION_STATEMENT = gql`
  query GetCampaignDonationStatement($campaignId: String!) {
    getCampaignDonationStatement(campaignId: $campaignId) {
      campaignId
      campaignTitle
      totalReceived
      totalDonations
      generatedAt
      transactions {
        donationId
        transactionDateTime
        donorName
        amount
        receivedAmount
        gateway
        orderCode
        bankAccountNumber
        bankName
        description
      }
    }
  }
`;
