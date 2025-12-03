import { gql } from "@apollo/client";

export const GET_SYSTEM_WALLET = gql`
  query GetSystemWallet {
    getSystemWallet {
      balance
      created_at
      id
      updated_at
      userId
      walletType
      totalExpense
      totalIncome
    }
  }
`;
