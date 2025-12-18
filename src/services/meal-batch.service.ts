import client from "@/lib/apollo-client";
import { GET_MEAL_BATCHES } from "@/graphql/query/meal-batch/get-meal-batches";
import { GET_MEAL_BATCH } from "@/graphql/query/meal-batch/get-meal-batch";
import {
  MealBatch,
  GetMealBatchesParams,
  GetMealBatchesResponse,
  GetMealBatchResponse,
  AssignTaskToStaffInput,
  AssignDeliveryTaskResponse,
  DeliveryTask,
  GetDeliveryTasksParams,
  GetDeliveryTasksResponse,
} from "@/types/api/meal-batch";
import { ASSIGN_DELIVERY_TASK } from "@/graphql/mutations/meal-batch/assign-delivery-task";
import { GET_DELIVERY_TASKS } from "@/graphql/query/meal-batch/get-delivery-tasks";

export const mealBatchService = {
  async getDeliveryTasks(params: GetDeliveryTasksParams): Promise<DeliveryTask[]> {
    try {
      const result = await client.query<GetDeliveryTasksResponse>({
        query: GET_DELIVERY_TASKS,
        variables: params,
        fetchPolicy: "network-only",
      });

      return result.data?.deliveryTasks || [];
    } catch (error) {
      console.error("❌ Error fetching delivery tasks:", error);
      throw error;
    }
  },
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

  async assignDeliveryTaskToStaff(input: AssignTaskToStaffInput): Promise<DeliveryTask[]> {
    try {
      const result = await client.mutate<AssignDeliveryTaskResponse>({
        mutation: ASSIGN_DELIVERY_TASK,
        variables: { input },
      });

      if (!result.data) {
        throw new Error("No data returned from mutation");
      }

      return result.data.assignDeliveryTaskToStaff;
    } catch (error) {
      console.error("❌ Error assigning delivery task:", error);
      throw error;
    }
  },
};
