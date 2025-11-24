import { gql } from "@apollo/client";

export const GET_MY_WALLET_TRANSACTIONS = gql`
  query GetMyWalletTransactions($skip: Int!, $limit: Int!) {
    getMyWalletTransactions(skip: $skip, limit: $limit) {
      totalTransactions
      transactions {
        amount
        campaignId
        created_at
        description
        gateway
        id
        paymentTransactionId
        transactionType
        walletId
      }
      wallet {
        balance
        created_at
        id
        updated_at
        userId
        walletType
      }
    }
  }
`;
