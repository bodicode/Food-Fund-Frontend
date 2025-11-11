import { gql } from "@apollo/client";

export const GET_MY_DONATIONS = gql`
  query GetMyDonations($skip: Float, $take: Float) {
    getMyDonations(skip: $skip, take: $take) {
      donations {
        amount
        orderCode
        donation {
          campaignId
          donorName
          donorId
          id
          isAnonymous
          status
          orderCode
          transactionDatetime
        }
        paymentAmountStatus
        receivedAmount
        transactionStatus
      }
      totalAmount
      totalSuccessDonations
      totalDonatedCampaigns
    }
  }
`;
