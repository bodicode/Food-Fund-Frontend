import { gql } from "@apollo/client";

export const GET_FUNDRAISER_WALLET_WITH_TRANSACTIONS = gql`
  query GetFundraiserWalletWithTransactions($userId: String!, $skip: Int!, $limit: Int!) {
    getFundraiserWalletWithTransactions(userId: $userId, skip: $skip, limit: $limit) {
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
        walletType
        userId
      }
    }
  }
`;
