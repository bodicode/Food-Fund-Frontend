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
  startDate?: string;
  endDate?: string;
  creator: {
    id: string;
    full_name: string;
    email: string;
  };
  category?: {
    id: string;
    title: string;
  };
  createdAt: string;
}

export interface ListCampaignsResponse {
  campaigns: Campaign[];
}

export interface CampaignFilterInput {
  status?: Campaign["status"][];
  categoryId?: string;
}

export interface CampaignParams {
  filter?: {
    status?: Campaign["status"][];
    categoryId?: string;
  };
  search?: string;
  sortBy?: "NEWEST_FIRST" | "OLDEST_FIRST";
  limit?: number;
  offset?: number;
}

export type CampaignStatus =
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

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
  startDate: string;
  endDate: string;
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
  startDate?: string;
  endDate?: string;
}
