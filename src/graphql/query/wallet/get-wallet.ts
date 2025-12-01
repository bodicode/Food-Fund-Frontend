import { gql } from "@apollo/client";

export const GET_WALLET = gql`
  query GetWallet($userId: String!) {
    getWallet(userId: $userId) {
      balance
      created_at
      id
      updated_at
      userId
      walletType
    }
  }
`;
