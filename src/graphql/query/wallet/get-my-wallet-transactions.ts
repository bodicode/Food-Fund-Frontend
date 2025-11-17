import { gql } from "@apollo/client";

export const GET_MY_WALLET_TRANSACTIONS = gql`
  query GetMyWalletTransactions($skip: Int!, $limit: Int!) {
    getMyWalletTransactions(skip: $skip, limit: $limit) {
      totalTransactions
      transactions {
        amount
        campaignId
        createdAt
        description
        gateway
        id
        paymentTransactionId
        transactionType
        walletId
      }
      wallet {
        balance
        createdAt
        id
        updatedAt
        userId
        walletType
      }
    }
  }
`;
