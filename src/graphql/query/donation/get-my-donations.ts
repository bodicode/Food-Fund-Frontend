import { gql } from "@apollo/client";

export const GET_MY_DONATIONS = gql`
  query GetMyDonations($skip: Float, $take: Float) {
    getMyDonations(skip: $skip, take: $take) {
      donations {
        amount
        campaignId
        donorName
        donorId
        id
        isAnonymous
        status
        orderCode
        transactionDatetime
      }
      totalAmount
      totalSuccessDonations
      totalDonatedCampaigns
    }
  }
`;
