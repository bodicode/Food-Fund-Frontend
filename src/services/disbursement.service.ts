"use client";

import client from "@/lib/apollo-client";
import { GET_MY_DISBURSEMENTS } from "@/graphql/query/disbursement/get-my-disbursements";
import { CONFIRM_DISBURSEMENT } from "@/graphql/mutations/disbursement/confirm-disbursement";

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
};
