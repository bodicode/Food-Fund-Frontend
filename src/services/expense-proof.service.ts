"use client";

import { GET_EXPENSE_PROOFS } from "@/graphql/query/expense-proof/get-expense-proofs";
import { GET_EXPENSE_PROOF } from "@/graphql/query/expense-proof/get-expense-proof";
import { GET_EXPENSE_PROOF_STATS } from "@/graphql/query/expense-proof/get-expense-proof-stats";
import { UPDATE_EXPENSE_PROOF_STATUS } from "@/graphql/mutations/expense-proof/update-expense-proof-status";
import client from "@/lib/apollo-client";
import {
  ExpenseProof,
  GetExpenseProofsParams,
  GetExpenseProofsResponse,
  GetExpenseProofResponse,
  ExpenseProofStats,
  GetExpenseProofStatsResponse,
  UpdateExpenseProofStatusInput,
  UpdateExpenseProofStatusResponse,
} from "@/types/api/expense-proof";

export const expenseProofService = {
  async getExpenseProofs(
    params: GetExpenseProofsParams
  ): Promise<ExpenseProof[]> {
    try {
      const { data } = await client.query<GetExpenseProofsResponse>({
        query: GET_EXPENSE_PROOFS,
        variables: params,
        fetchPolicy: "network-only",
      });

      return data?.getExpenseProofs || [];
    } catch (error) {
      console.error("❌ Error fetching expense proofs:", error);
      throw error;
    }
  },

  async getExpenseProof(id: string): Promise<ExpenseProof | null> {
    try {
      const { data } = await client.query<GetExpenseProofResponse>({
        query: GET_EXPENSE_PROOF,
        variables: { id },
        fetchPolicy: "network-only",
      });

      return data?.getExpenseProof || null;
    } catch (error) {
      console.error("❌ Error fetching expense proof:", error);
      throw error;
    }
  },

  async getExpenseProofStats(): Promise<ExpenseProofStats | null> {
    try {
      const { data } = await client.query<GetExpenseProofStatsResponse>({
        query: GET_EXPENSE_PROOF_STATS,
        fetchPolicy: "network-only",
      });

      return data?.getExpenseProofStats || null;
    } catch (error) {
      console.error("❌ Error fetching expense proof stats:", error);
      throw error;
    }
  },

  async updateExpenseProofStatus(
    id: string,
    input: UpdateExpenseProofStatusInput
  ): Promise<boolean> {
    try {
      const { data } = await client.mutate<UpdateExpenseProofStatusResponse>({
        mutation: UPDATE_EXPENSE_PROOF_STATUS,
        variables: { id, input },
      });

      return !!data?.updateExpenseProofStatus;
    } catch (error) {
      console.error("❌ Error updating expense proof status:", error);
      throw error;
    }
  },
};
