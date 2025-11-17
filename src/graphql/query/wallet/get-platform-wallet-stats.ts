import { gql } from "@apollo/client";

export const GET_PLATFORM_WALLET_STATS = gql`
  query GetPlatformWalletStats {
    getPlatformWalletStats {
      systemBalance
      totalFundraiserBalance
      totalFundraisers
      totalTransactionsThisMonth
      totalTransactionsToday
    }
  }
`;
