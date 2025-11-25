"use client";

import client from "@/lib/apollo-client";
import { GET_MY_DISBURSEMENTS } from "@/graphql/query/disbursement/get-my-disbursements";
import { CONFIRM_DISBURSEMENT } from "@/graphql/mutations/disbursement/confirm-disbursement";
import { GET_INFLOW_TRANSACTION_DETAILS } from "@/graphql/query/disbursement/get-inflow-transaction-details";
import { GET_LIST_INFLOW_TRANSACTION } from "@/graphql/query/disbursement/get-list-inflow-transaction";

export type DisbursementStatus = "PENDING" | "COMPLETED" | "FAILED";
export type TransactionType = "INGREDIENT" | "COOKING" | "DELIVERY";

export interface Disbursement {
  id: string;
  amount: string;
  campaignPhaseId: string;
  campaignPhase?: {
    phaseName: string;
  };
  created_at: string;
  ingredientRequestId?: string;
  isReported: boolean;
  operationRequestId?: string;
  proof: string;
  receiver: {
    user_name: string;
    full_name: string;
    role: string;
  };
  receiverId: string;
  reportedAt?: string;
  status: DisbursementStatus;
  transactionType: TransactionType;
  updated_at: string;
  organization?: {
    bank_account_name: string;
    bank_account_number: string;
    bank_name: string;
    bank_short_name: string;
    name: string;
    email: string;
    representative_name: string;
  };
}

export interface GetMyDisbursementsFilter {
  campaignPhaseId?: string;
  fromDate?: string;
  toDate?: string;
  status?: DisbursementStatus;
  transactionType?: TransactionType;
}

export interface GetMyDisbursementsResponse {
  getMyDisbursements: {
    hasMore: boolean;
    items: Disbursement[];
  };
}

export interface ConfirmDisbursementInput {
  id: string;
  status: "COMPLETED" | "FAILED";
}

export interface ConfirmDisbursementResponse {
  confirmDisbursement: Disbursement;
}

export const disbursementService = {
  async getMyDisbursements(
    limit: number = 100,
    page: number = 1
  ): Promise<GetMyDisbursementsResponse["getMyDisbursements"]> {
    try {
      const { data, error } = await client.query<GetMyDisbursementsResponse>({
        query: GET_MY_DISBURSEMENTS,
        variables: {
          limit,
          page,
        },
        fetchPolicy: "no-cache",
      });

      if (!data?.getMyDisbursements) {
        return Promise.reject(error);
      }

      return data.getMyDisbursements;
    } catch (error) {
      console.error("Error fetching disbursements:", error);
      throw error;
    }
  },

  async confirmDisbursement(
    input: ConfirmDisbursementInput
  ): Promise<Disbursement> {
    try {
      const { data, error } = await client.mutate<ConfirmDisbursementResponse>({
        mutation: CONFIRM_DISBURSEMENT,
        variables: { input },
      });

      if (!data?.confirmDisbursement) {
        return Promise.reject(error);
      }

      return data.confirmDisbursement;
    } catch (error) {
      console.error("Error confirming disbursement:", error);
      throw error;
    }
  },

  async getInflowTransactionDetails(id: string): Promise<Disbursement> {
    try {
      const { data, error } = await client.query<{
        getInflowTransactionDetails: Disbursement;
      }>({
        query: GET_INFLOW_TRANSACTION_DETAILS,
        variables: { getInflowTransactionDetailsId: id },
        fetchPolicy: "network-only",
      });

      if (!data?.getInflowTransactionDetails) {
        return Promise.reject(error);
      }

      return data.getInflowTransactionDetails;
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      throw error;
    }
  },

  async getListInflowTransaction(
    filter: Record<string, unknown> = {},
    limit: number = 100,
    page: number = 1
  ): Promise<{ hasMore: boolean; items: Disbursement[] }> {
    try {
      const { data, error } = await client.query<{
        getListInflowTransaction: { hasMore: boolean; items: Disbursement[] };
      }>({
        query: GET_LIST_INFLOW_TRANSACTION,
        variables: { filter, limit, page },
        fetchPolicy: "network-only",
      });

      if (!data?.getListInflowTransaction) {
        return Promise.reject(error);
      }

      return data.getListInflowTransaction;
    } catch (error) {
      console.error("Error fetching inflow transactions:", error);
      throw error;
    }
  },

  async getInflowIdByRequestId(
    requestId: string,
    requestType: "operation" | "ingredient"
  ): Promise<string | null> {
    try {
      // Get all inflow transactions (filter doesn't support operationRequestId/ingredientRequestId)
      const { items } = await this.getListInflowTransaction({}, 1000, 1);

      // Filter on client side
      const found = items.find((item) => {
        if (requestType === "operation") {
          return item.operationRequestId === requestId;
        } else {
          return item.ingredientRequestId === requestId;
        }
      });

      if (!found) {
        console.warn("No inflow transaction found for request:", requestId);
        return null;
      }
      return found.id;
    } catch (error) {
      console.error("Error finding inflow transaction:", error);
      return null;
    }
  },
};
