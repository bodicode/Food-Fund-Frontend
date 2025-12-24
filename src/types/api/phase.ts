// ==============================
// PHASE TYPES
// ==============================
export interface PlannedMeal {
  name: string;
  quantity: number;
}

export interface PlannedIngredient {
  id?: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface CampaignPhase {
  id: string;
  phaseName: string;
  location: string;
  ingredientPurchaseDate: string;
  cookingDate: string;
  deliveryDate: string;
  ingredientBudgetPercentage?: string;
  cookingBudgetPercentage?: string;
  deliveryBudgetPercentage?: string;
  ingredientFundsAmount?: string | null;
  cookingFundsAmount?: string | null;
  deliveryFundsAmount?: string | null;
  status?:
  | "PLANNING"
  | "INGREDIENT_PURCHASE"
  | "AWAITING_INGREDIENT_DISBURSEMENT"
  | "COOKING"
  | "AWAITING_COOKING_DISBURSEMENT"
  | "DELIVERY"
  | "AWAITING_DELIVERY_DISBURSEMENT"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";
  plannedMeals?: PlannedMeal[];
  plannedIngredients?: PlannedIngredient[];
}

export interface CreatePhaseInput {
  phaseName: string;
  location: string;
  ingredientPurchaseDate: string;
  cookingDate: string;
  deliveryDate: string;
  ingredientBudgetPercentage: string;
  cookingBudgetPercentage: string;
  deliveryBudgetPercentage: string;
  plannedMeals: PlannedMeal[];
  plannedIngredients: PlannedIngredient[];
}

export interface UpdatePhaseInput {
  phaseName?: string;
  location?: string;
  ingredientPurchaseDate?: string;
  cookingDate?: string;
  deliveryDate?: string;
}

export interface SyncPhaseInput {
  id?: string; // If provided, it's an update; if not, it's a create
  phaseName: string;
  location: string;
  ingredientPurchaseDate: string;
  cookingDate: string;
  deliveryDate: string;
  ingredientBudgetPercentage: string;
  cookingBudgetPercentage: string;
  deliveryBudgetPercentage: string;
}

// ==============================
// MUTATION RESPONSE TYPES
// ==============================
export interface AddCampaignPhaseResponse {
  addCampaignPhase: CampaignPhase;
}

export interface UpdateCampaignPhaseResponse {
  updateCampaignPhase: CampaignPhase;
}

export interface DeleteCampaignPhaseResponse {
  deleteCampaignPhase: boolean;
}

export interface DeleteManyCampaignPhasesResponse {
  deleteManyCampaignPhases: {
    success: boolean;
    deletedCount: number;
    affectedCampaignIds: string[];
  };
}

export interface SyncCampaignPhasesResponse {
  syncCampaignPhases: {
    success: boolean;
    message: string;
    createdCount: number;
    updatedCount: number;
    deletedCount: number;
    phases: CampaignPhase[];
  };
}

export interface UpdatePhaseStatusInput {
  phaseId: string;
  status: "COMPLETED" | "ACTIVE" | "UPCOMING" | "FAILED";
}

export interface UpdatePhaseStatusResponse {
  updatePhaseStatus: {
    id: string;
    phaseName: string;
    status: CampaignPhase["status"];
  };
}
