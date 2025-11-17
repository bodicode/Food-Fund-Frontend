import { gql } from "@apollo/client";

export const GET_MY_WALLET = gql`
  query GetMyWallet {
    getMyWallet {
      balance
      createdAt
      id
      updatedAt
      userId
      walletType
    }
  }
`;
