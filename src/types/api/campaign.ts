// ==============================
// CAMPAIGN TYPES
// ==============================
export interface Campaign {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  location?: string;

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

  // Các mốc vận hành
  cookingDate?: string;
  deliveryDate?: string;
  ingredientPurchaseDate?: string;

  // (tuỳ backend có trả các khoản phân bổ hay không)
  cookingFundsAmount?: string;
  deliveryFundsAmount?: string;
  ingredientFundsAmount?: string;

  cookingBudgetPercentage?: string;
  ingredientBudgetPercentage?: string;
  deliveryBudgetPercentage?: string;

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
    approvedAt?: string;
  };
}

export interface CreateCampaignInput {
  title: string;
  description: string;
  coverImageFileKey: string;
  location: string;
  targetAmount: string;

  ingredientBudgetPercentage: string; // "60.00"
  cookingBudgetPercentage: string; // "25.00"
  deliveryBudgetPercentage: string; // "15.00"

  fundraisingStartDate: string; // ISO
  fundraisingEndDate: string; // ISO

  ingredientPurchaseDate: string; // ISO
  cookingDate: string; // ISO
  deliveryDate: string; // ISO

  categoryId: string;
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
  location?: string;

  fundraisingStartDate?: string;
  fundraisingEndDate?: string;

  ingredientPurchaseDate?: string;
  cookingDate?: string;
  deliveryDate?: string;

  ingredientBudgetPercentage?: string;
  cookingBudgetPercentage?: string;
  deliveryBudgetPercentage?: string;
}
