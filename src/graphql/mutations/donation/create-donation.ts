import { gql } from "@apollo/client";

export const CREATE_DONATION = gql`
  mutation CreateDonation($input: CreateDonationInput!) {
    createDonation(input: $input) {
      amount
      bankAccountName
      bankFullName
      bankLogo
      bankName
      bankNumber
      description
      donationId
      qrCode
    }
  }
`;