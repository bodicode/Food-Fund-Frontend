import { gql } from "@apollo/client";

export const GET_FUNDRAISER_WALLET = gql`
  query GetFundraiserWallet($userId: String!) {
    getFundraiserWallet(userId: $userId) {
      balance
      createdAt
      id
      updatedAt
      walletType
      user {
        address
        avatar_url
        bio
        created_at
        email
        full_name
        id
        is_active
        phone_number
        role
        user_name
      }
    }
  }
`;
