import { gql } from "@apollo/client";

export const GET_FUNDRAISER_WALLET_WITH_TRANSACTIONS = gql`
  query GetFundraiserWalletWithTransactions($userId: String!, $skip: Int!, $limit: Int!) {
    getFundraiserWalletWithTransactions(userId: $userId, skip: $skip, limit: $limit) {
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
        walletType
        userId
      }
    }
  }
`;
