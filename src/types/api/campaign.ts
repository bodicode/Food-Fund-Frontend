export interface Campaign {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  location: string;
  status: "PENDING" | "APPROVED" | "ACTIVE" | "REJECTED" | "COMPLETED";
  targetAmount: string;
  donationCount: number;
  receivedAmount: string;
  creator: {
    id: string;
  };
}

export interface ListCampaignsResponse {
  campaigns: Campaign[];
}

export interface CampaignFilterInput {
  status?: Campaign["status"][];
}

export interface CampaignParams {
  filter?: CampaignFilterInput;
  search?: string;
  sortBy?: "NEWEST_FIRST" | "OLDEST_FIRST" | "MOST_FUNDED";
  limit?: number;
  offset?: number;
}
