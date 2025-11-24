import { gql } from "@apollo/client";

export const GET_MY_WALLET = gql`
  query GetMyWallet {
    getMyWallet {
      balance
      created_at
      id
      updated_at
      userId
      walletType
    }
  }
`;
