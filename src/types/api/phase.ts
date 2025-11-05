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
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface CreatePhaseInput {
  phaseName: string;
  location: string;
  ingredientPurchaseDate: string;
  cookingDate: string;
  deliveryDate: string;
}

export interface UpdatePhaseInput {
  phaseName?: string;
  location?: string;
  ingredientPurchaseDate?: string;
  cookingDate?: string;
  deliveryDate?: string;
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