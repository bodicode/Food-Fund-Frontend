export type IngredientRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED";

export interface IngredientRequestItem {
  id: string;
  ingredientName: string;
  quantity: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  supplier?: string;
  plannedIngredientId?: string;
}

export interface CreateIngredientRequestItemInput {
  ingredientName: string;
  quantity: string;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  supplier?: string;
  plannedIngredientId?: string;
}

export interface CreateIngredientRequestInput {
  campaignPhaseId: string;
  totalCost: string;
  items: CreateIngredientRequestItemInput[];
}

export interface CreateIngredientRequestResponse {
  createIngredientRequest: IngredientRequest;
}

export interface IngredientRequest {
  id: string;
  kitchenStaff: {
    id: string;
    full_name: string;
  };
  campaignPhase?: {
    id: string;
    phaseName: string;
    cookingDate: string;
    status: string;
    campaign?: {
      id: string;
      title: string;
    };
  } | null;
  totalCost: number;
  status: IngredientRequestStatus;
  changedStatusAt?: string;
  created_at: string;
  adminNote?: string;
  items?: IngredientRequestItem[];
  organization?: {
    id: string;
    name: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_name: string;
    bank_short_name: string;
  };
}

export interface IngredientRequestFilterInput {
  status?: IngredientRequestStatus | null;
  campaignId?: string | null;
  sortBy?: string | null;
}

export interface GetIngredientRequestsParams {
  filter?: IngredientRequestFilterInput;
  limit?: number;
  offset?: number;
}

export interface GetIngredientRequestsResponse {
  getIngredientRequests: IngredientRequest[];
}

export interface GetIngredientRequestResponse {
  getIngredientRequest: IngredientRequest;
}

export interface UpdateIngredientRequestStatusInput {
  status: IngredientRequestStatus;
  adminNote?: string;
}

export interface UpdateIngredientRequestStatusResponse {
  updateIngredientRequestStatus: {
    id: string;
    status: IngredientRequestStatus;
    changedStatusAt: string;
  };
}

export interface IngredientRequestStats {
  totalRequests: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  disbursedCount: number;
}

export interface GetIngredientRequestStatsResponse {
  getIngredientRequestStats: IngredientRequestStats;
}
