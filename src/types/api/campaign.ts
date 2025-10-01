export interface Campaign {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  location?: string;
  status: "PENDING" | "APPROVED" | "ACTIVE" | "REJECTED" | "COMPLETED" | "CANCELLED";
  targetAmount: string;
  donationCount: number;
  receivedAmount: string;
  startDate?: string;
  endDate?: string;
  creator: {
    id: string;
  };
  category?: {
    id: string;
    title: string;
  };
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