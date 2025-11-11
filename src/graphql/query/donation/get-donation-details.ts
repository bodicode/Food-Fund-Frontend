import { gql } from "@apollo/client";

export const GET_DONATION_DETAILS = gql`
  query GetMyDonationDetails($orderCode: String!) {
    getMyDonationDetails(orderCode: $orderCode) {
      campaignId
      createdAt
      donationId
      isAnonymous
      paymentTransaction {
        amount
        createdAt
        description
        id
        orderCode
        paymentAmountStatus
        receivedAmount
        transactionStatus
        updatedAt
      }
    }
  }
`;
