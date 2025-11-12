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
  campaignId?: string;
  status?: MealBatchStatus;
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
