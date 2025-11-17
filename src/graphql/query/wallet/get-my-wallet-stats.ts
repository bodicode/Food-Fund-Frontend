import { gql } from "@apollo/client";

export const GET_MY_WALLET_STATS = gql`
  query GetMyWalletStats {
    getMyWalletStats {
      availableBalance
      thisMonthReceived
      totalDonations
      totalReceived
      totalWithdrawn
    }
  }
`;
