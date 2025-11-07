import { CampaignPhase, CreatePhaseInput } from "./phase";



// ==============================
// CAMPAIGN TYPES
// ==============================
export interface Campaign {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;

  status:
    | "PENDING"
    | "APPROVED"
    | "ACTIVE"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED";

  targetAmount: string;
  donationCount: number;
  receivedAmount: string;

  // Ngày gây quỹ
  fundraisingStartDate?: string;
  fundraisingEndDate?: string;

  // Budget percentages
  cookingBudgetPercentage?: string;
  ingredientBudgetPercentage?: string;
  deliveryBudgetPercentage?: string;

  // Phases - new structure
  phases?: CampaignPhase[];

  // Legacy fields - for backward compatibility
  cookingFundsAmount?: string;
  deliveryFundsAmount?: string;
  ingredientFundsAmount?: string;

  category: {
    id: string;
    title: string;
    description?: string;
  };

  creator: {
    id?: string;
    full_name: string;
    email?: string;
    phone_number?: string;
  };

  created_at: string;
  createdBy?: string;
}

// ==============================
// LIST RESPONSE
// ==============================
export interface ListCampaignsResponse {
  campaigns: Campaign[];
}

// ==============================
// FILTER & PARAM TYPES
// ==============================
export interface CampaignFilterInput {
  status?: Campaign["status"][];
  categoryId?: string;
}

export interface CampaignParams {
  filter?: CampaignFilterInput;
  search?: string;
  sortBy?: 
    | "NEWEST_FIRST" 
    | "OLDEST_FIRST" 
    | "ACTIVE_FIRST"
    | "TARGET_AMOUNT_ASC" 
    | "TARGET_AMOUNT_DESC"
    | "MOST_DONATED"
    | "LEAST_DONATED";
  limit?: number;
  offset?: number;
}

// ==============================
// STATUS TYPE
// ==============================
export type CampaignStatus =
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

// ==============================
// MUTATION RESPONSE TYPES
// ==============================
export interface ChangeCampaignStatusResponse {
  changeCampaignStatus: {
    id: string;
    status: Campaign["status"];
  };
}



export interface CreateCampaignInput {
  title: string;
  description: string;
  coverImageFileKey: string;
  targetAmount: string;
  categoryId: string;

  // Budget percentages
  ingredientBudgetPercentage: string; // "60.00"
  cookingBudgetPercentage: string; // "25.00"
  deliveryBudgetPercentage: string; // "15.00"

  // Fundraising dates
  fundraisingStartDate: string; // ISO
  fundraisingEndDate: string; // ISO

  // Phases - new structure
  phases: CreatePhaseInput[];
}

export interface CreateCampaignResponse {
  createCampaign: Campaign;
}

export interface UpdateCampaignInput {
  title?: string;
  description?: string;
  targetAmount?: string;
  categoryId?: string;
  coverImageFileKey?: string;

  fundraisingStartDate?: string;
  fundraisingEndDate?: string;

  ingredientBudgetPercentage?: string;
  cookingBudgetPercentage?: string;
  deliveryBudgetPercentage?: string;
}
