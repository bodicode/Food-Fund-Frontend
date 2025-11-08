import { gql } from "@apollo/client";

export const GET_DONATION_PAYMENT_LINK = gql`
  query GetMyDonationPaymentLink($orderCode: String!) {
    getMyDonationPaymentLink(orderCode: $orderCode) {
      id
      orderCode
      amount
      amountPaid
      amountRemaining
      status
      createdAt
      transactions {
        reference
        amount
        accountNumber
        description
        transactionDateTime
      }
      qrCode
      bankNumber
      bankAccountName
      bankFullName
      bankName
      bankLogo
      description
    }
  }
`;
