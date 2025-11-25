export type IngredientRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED";

export interface IngredientRequestItem {
  id: string;
  ingredientName: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  supplier?: string;
}

export interface IngredientRequest {
  id: string;
  kitchenStaff: {
    id: string;
    full_name: string;
  };
  campaignPhase: {
    id: string;
    phaseName: string;
    cookingDate: string;
    status: string;
    campaign?: {
      id: string;
      title: string;
    };
  };
  totalCost: number;
  status: IngredientRequestStatus;
  changedStatusAt?: string;
  created_at: string;
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
