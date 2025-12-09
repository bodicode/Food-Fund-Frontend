"use client";

import { GET_INGREDIENT_REQUESTS } from "@/graphql/query/ingredient-request/get-ingredient-requests";
import { GET_INGREDIENT_REQUEST } from "@/graphql/query/ingredient-request/get-ingredient-request";
import { UPDATE_INGREDIENT_REQUEST_STATUS } from "@/graphql/mutations/ingredient-request/update-ingredient-request-status";
import { GET_INGREDIENT_REQUEST_STATS } from "@/graphql/query/ingredient-request/get-ingredient-request-stats";
import client from "@/lib/apollo-client";
import {
  IngredientRequest,
  GetIngredientRequestsParams,
  GetIngredientRequestsResponse,
  GetIngredientRequestResponse,
  UpdateIngredientRequestStatusInput,
  UpdateIngredientRequestStatusResponse,
  GetIngredientRequestStatsResponse,
  IngredientRequestStats,
} from "@/types/api/ingredient-request";

export const ingredientRequestService = {
  async getIngredientRequests(
    params: GetIngredientRequestsParams
  ): Promise<IngredientRequest[]> {
    try {
      const { data } = await client.query<GetIngredientRequestsResponse>({
        query: GET_INGREDIENT_REQUESTS,
        variables: params,
        fetchPolicy: "network-only",
      });

      return data?.getIngredientRequests || [];
    } catch (error) {
      console.error("❌ Error fetching ingredient requests:", error);
      throw error;
    }
  },

  async getIngredientRequest(id: string): Promise<IngredientRequest | null> {
    try {
      const { data } = await client.query<GetIngredientRequestResponse>({
        query: GET_INGREDIENT_REQUEST,
        variables: { id },
        fetchPolicy: "network-only",
      });

      return data?.getIngredientRequest || null;
    } catch (error) {
      console.error("❌ Error fetching ingredient request:", error);
      throw error;
    }
  },

  async updateIngredientRequestStatus(
    id: string,
    input: UpdateIngredientRequestStatusInput
  ): Promise<boolean> {
    try {
      const { data } = await client.mutate<UpdateIngredientRequestStatusResponse>({
        mutation: UPDATE_INGREDIENT_REQUEST_STATUS,
        variables: { id, input },
      });

      return !!data?.updateIngredientRequestStatus;
    } catch (error) {
      console.error("❌ Error updating ingredient request status:", error);
      throw error;
    }
  },

  async getIngredientRequestStats(): Promise<IngredientRequestStats | null> {
    try {
      const { data } = await client.query<GetIngredientRequestStatsResponse>({
        query: GET_INGREDIENT_REQUEST_STATS,
        fetchPolicy: "network-only",
      });

      return data?.getIngredientRequestStats || null;
    } catch (error) {
      console.error("❌ Error fetching ingredient request stats:", error);
      return null;
    }
  },
};
