// ==============================
// PHASE TYPES
// ==============================
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
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
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