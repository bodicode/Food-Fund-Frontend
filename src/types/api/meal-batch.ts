// ==============================
// MEAL BATCH TYPES
// ==============================

export type MealBatchStatus = "PREPARING" | "READY" | "DELIVERED";

export interface MealBatchKitchenStaff {
  id: string;
  full_name: string;
}

export interface IngredientItem {
  ingredientName: string;
  quantity: number;
}

export interface IngredientUsage {
  ingredientItem: IngredientItem;
}

export interface MealBatch {
  id: string;
  campaignPhaseId: string;
  foodName: string;
  quantity: number;
  status: MealBatchStatus;
  cookedDate: string;
  kitchenStaff: MealBatchKitchenStaff;
  media?: string[];
  ingredientUsages?: IngredientUsage[];
}

export interface MealBatchFilterInput {
  campaignId?: string | null;
  campaignPhaseId?: string | null;
  kitchenStaffId?: string | null;
  status?: MealBatchStatus | null;
}

export interface GetMealBatchesParams {
  filter?: MealBatchFilterInput;
}

export interface GetMealBatchesResponse {
  getMealBatches: MealBatch[];
}

export interface GetMealBatchResponse {
  getMealBatch: MealBatch;
}

export interface AssignTaskToStaffInput {
  mealBatchId: string;
  deliveryStaffIds: string[];
}

export interface DeliveryTask {
  id: string;
  deliveryStaffId: string;
  deliveryStaff?: {
    id: string;
    full_name: string;
  };
  mealBatchId: string;
  mealBatch?: MealBatch;
  status: string;
  created_at: string;
}

export interface DeliveryTaskFilterInput {
  campaignId?: string | null;
  campaignPhaseId?: string | null;
  mealBatchId?: string | null;
  deliveryStaffId?: string | null;
  status?: string | null;
  limit?: number;
  offset?: number;
}

export interface GetDeliveryTasksParams {
  filter: DeliveryTaskFilterInput;
}

export interface GetDeliveryTasksResponse {
  deliveryTasks: DeliveryTask[];
}

export interface AssignDeliveryTaskResponse {
  assignDeliveryTaskToStaff: DeliveryTask[];
}
