"use client";

import { GET_PLATFORM_WALLET_STATS } from "@/graphql/query/wallet/get-platform-wallet-stats";
import { GET_ALL_FUNDRAISER_WALLETS } from "@/graphql/query/wallet/get-all-fundraiser-wallets";
import { GET_FUNDRAISER_WALLET } from "@/graphql/query/wallet/get-fundraiser-wallet";
import { GET_FUNDRAISER_WALLET_WITH_TRANSACTIONS } from "@/graphql/query/wallet/get-fundraiser-wallet-with-transactions";
import { GET_MY_WALLET } from "@/graphql/query/wallet/get-my-wallet";
import { GET_MY_WALLET_TRANSACTIONS } from "@/graphql/query/wallet/get-my-wallet-transactions";
import { GET_MY_WALLET_STATS } from "@/graphql/query/wallet/get-my-wallet-stats";
import { GET_WALLET } from "@/graphql/query/wallet/get-wallet";
import { GET_WALLET_TRANSACTIONS } from "@/graphql/query/wallet/get-wallet-transactions";
import client from "@/lib/apollo-client";

export interface PlatformWalletStats {
  systemBalance: string;
  totalFundraiserBalance: string;
  totalFundraisers: number;
  totalTransactionsThisMonth: number;
  totalTransactionsToday: number;
  totalUsers: number;
}

export interface FundraiserWallet {
  id: string;
  balance: string;
  walletType: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string;
    user_name: string;
    email: string;
    avatar_url: string;
    bio: string;
    address: string;
    phone_number: string;
    role: string;
    is_active: boolean;
    created_at: string;
  };
}

export interface GetAllFundraisersWalletsResponse {
  getAllFundraiserWallets: {
    wallets: FundraiserWallet[];
  };
}

export interface WalletTransaction {
  id: string;
  amount: string;
  campaignId: string;
  created_at: string;
  description: string;
  gateway: string;
  paymentTransactionId: string | null;
  transactionType: string;
  walletId: string;
  balanceAfter: string;
  balanceBefore: string;
}

export interface GetFundraiserWalletWithTransactionsResponse {
  getFundraiserWalletWithTransactions: {
    totalTransactions: number;
    transactions: WalletTransaction[];
    wallet: {
      balance: string;
      created_at: string;
      id: string;
      updated_at: string;
      walletType: string;
      userId: string;
    };
  };
}

export interface MyWallet {
  id: string;
  balance: string;
  walletType: string;
  created_at: string;
  updated_at: string;
  userId: string;
}

export interface GetMyWalletTransactionsResponse {
  getMyWalletTransactions: {
    totalTransactions: number;
    transactions: WalletTransaction[];
    wallet: MyWallet;
  };
}

export interface MyWalletStats {
  availableBalance: string;
  thisMonthReceived: string;
  totalDonations: number;
  totalReceived: string;
  totalWithdrawn: string;
}

export interface SearchWalletTransactionInput {
  walletId: string;
  query?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  transactionType?: string | null;
  sortBy?: "HIGHEST_AMOUNT" | "LOWEST_AMOUNT" | "NEWEST" | "OLDEST";
  page?: number;
  limit?: number;
}

export interface SearchWalletTransactionResponse {
  searchWalletTransactions: {
    items: WalletTransaction[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export const walletService = {
  async getPlatformWalletStats(): Promise<PlatformWalletStats | null> {
    try {
      const { data } = await client.query<{ getPlatformWalletStats: PlatformWalletStats }>({
        query: GET_PLATFORM_WALLET_STATS,
        fetchPolicy: "no-cache",
      });

      return data?.getPlatformWalletStats || null;
    } catch (error) {
      console.error("❌ Error fetching platform wallet stats:", error);
      return null;
    }
  },

  async getAllFundraiserWallets(skip: number = 0, take: number = 10): Promise<GetAllFundraisersWalletsResponse | null> {
    try {
      const { data } = await client.query<GetAllFundraisersWalletsResponse>({
        query: GET_ALL_FUNDRAISER_WALLETS,
        variables: { skip, take },
        fetchPolicy: "no-cache",
      });

      return data || null;
    } catch (error) {
      console.error("❌ Error fetching fundraiser wallets:", error);
      return null;
    }
  },

  async getFundraiserWallet(userId: string): Promise<FundraiserWallet | null> {
    try {
      const { data } = await client.query<{ getFundraiserWallet: FundraiserWallet }>({
        query: GET_FUNDRAISER_WALLET,
        variables: { userId },
        fetchPolicy: "no-cache",
      });

      return data?.getFundraiserWallet || null;
    } catch (error) {
      console.error("❌ Error fetching fundraiser wallet:", error);
      return null;
    }
  },

  async getFundraiserWalletWithTransactions(
    userId: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<GetFundraiserWalletWithTransactionsResponse | null> {
    try {
      const { data } = await client.query<GetFundraiserWalletWithTransactionsResponse>({
        query: GET_FUNDRAISER_WALLET_WITH_TRANSACTIONS,
        variables: { userId, skip, limit },
        fetchPolicy: "no-cache",
      });

      return data || null;
    } catch (error) {
      console.error("❌ Error fetching fundraiser wallet with transactions:", error);
      return null;
    }
  },

  async getMyWallet(): Promise<MyWallet | null> {
    try {
      const { data } = await client.query<{ getMyWallet: MyWallet }>({
        query: GET_MY_WALLET,
        fetchPolicy: "no-cache",
      });

      return data?.getMyWallet || null;
    } catch (error) {
      console.error("❌ Error fetching my wallet:", error);
      return null;
    }
  },

  async getMyWalletTransactions(skip: number = 0, limit: number = 10): Promise<GetMyWalletTransactionsResponse | null> {
    try {
      const { data } = await client.query<GetMyWalletTransactionsResponse>({
        query: GET_MY_WALLET_TRANSACTIONS,
        variables: { skip, limit },
        fetchPolicy: "no-cache",
      });

      return data || null;
    } catch (error) {
      console.error("❌ Error fetching my wallet transactions:", error);
      return null;
    }
  },

  async getMyWalletStats(): Promise<MyWalletStats | null> {
    try {
      const { data } = await client.query<{ getMyWalletStats: MyWalletStats }>({
        query: GET_MY_WALLET_STATS,
        fetchPolicy: "no-cache",
      });

      return data?.getMyWalletStats || null;
    } catch (error) {
      console.error("❌ Error fetching my wallet stats:", error);
      return null;
    }
  },

  async getWallet(userId: string): Promise<FundraiserWallet | null> {
    try {
      const { data } = await client.query<{ getWallet: FundraiserWallet }>({
        query: GET_WALLET,
        variables: { userId },
        fetchPolicy: "no-cache",
      });

      return data?.getWallet || null;
    } catch (error) {
      console.error("❌ Error fetching wallet:", error);
      return null;
    }
  },

  async getWalletTransactions(
    input: SearchWalletTransactionInput
  ): Promise<{ items: WalletTransaction[]; total: number; totalPages: number } | null> {
    try {
      const { data } = await client.query<SearchWalletTransactionResponse>({
        query: GET_WALLET_TRANSACTIONS,
        variables: {
          input,
        },
        fetchPolicy: "no-cache",
      });

      return data?.searchWalletTransactions || null;
    } catch (error) {
      console.error("❌ Error fetching wallet transactions:", error);
      return null;
    }
  },
};
