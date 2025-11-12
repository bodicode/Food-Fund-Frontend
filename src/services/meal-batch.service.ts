import client from "@/lib/apollo-client";
import { GET_MEAL_BATCHES } from "@/graphql/query/meal-batch/get-meal-batches";
import { GET_MEAL_BATCH } from "@/graphql/query/meal-batch/get-meal-batch";
import {
  MealBatch,
  GetMealBatchesParams,
  GetMealBatchesResponse,
  GetMealBatchResponse,
} from "@/types/api/meal-batch";

export const mealBatchService = {
  async getMealBatches(params: GetMealBatchesParams = {}): Promise<MealBatch[]> {
    try {
      const result = await client.query<GetMealBatchesResponse>({
        query: GET_MEAL_BATCHES,
        variables: params,
        fetchPolicy: "network-only",
      });

      if (!result.data) {
        return [];
      }

      return result.data.getMealBatches;
    } catch (error) {
      console.error("❌ Error fetching meal batches:", error);
      throw error;
    }
  },

  async getMealBatch(id: string): Promise<MealBatch | null> {
    try {
      const result = await client.query<GetMealBatchResponse>({
        query: GET_MEAL_BATCH,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (!result.data) {
        return null;
      }

      return result.data.getMealBatch;
    } catch (error) {
      console.error("❌ Error fetching meal batch:", error);
      throw error;
    }
  },
};
