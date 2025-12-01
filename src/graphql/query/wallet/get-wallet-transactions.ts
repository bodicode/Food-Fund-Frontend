import { gql } from "@apollo/client";

export const GET_WALLET_TRANSACTIONS = gql`
  query SearchWalletTransactions($input: SearchWalletTransactionInput!) {
    searchWalletTransactions(input: $input) {
      items {
        id
        amount
        balanceAfter
        balanceBefore
        campaignId
        created_at
        description
        gateway
        paymentTransactionId
        transactionType
        walletId
        updated_at
      }
      limit
      page
      total
      totalPages
    }
  }
`;
