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
    | "PROCESSING"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED";

  targetAmount: string;
  donationCount: number;
  receivedAmount: string;

  // Computed fields from backend (optional for backward compatibility)
  fundingProgress?: number; // 0-100
  daysActive?: number; // days since fundraising start
  totalPhases?: number; // number of phases
  daysRemaining?: number; // remaining days until fundraising end

  // Ngày gây quỹ
  fundraisingStartDate?: string;
  fundraisingEndDate?: string;

  // Phases - new structure (budget percentages are now at phase level)
  phases?: CampaignPhase[];

  category: {
    id: string;
    title: string;
    description?: string;
  };

  creator?: {
    id?: string;
    full_name: string;
    email?: string;
    phone_number?: string;
  };

  organization?: {
    id: string;
    name: string;
  };

  created_at: string;
  createdBy?: string;
}

// ==============================
// MY CAMPAIGN STATS
// ==============================

export interface MyCampaignStatsOverview {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

export interface MyCampaignStatsByStatus {
  pending: number;
  approved: number;
  active: number;
  processing: number;
  completed: number;
  rejected: number;
  cancelled: number;
}

export interface MyCampaignStatsFinancial {
  totalTargetAmount: string;
  totalReceivedAmount: string;
  totalDonations: number;
  averageDonationAmount: string;
  fundingRate: number;
}

export interface MyCampaignStatsPerformance {
  successRate: number;
  averageDurationDays: number;
  mostFundedCampaign: {
    id: string;
    title: string;
  } | null;
}

export interface MyCampaignStats {
  overview: MyCampaignStatsOverview;
  byStatus: MyCampaignStatsByStatus;
  financial: MyCampaignStatsFinancial;
  performance: MyCampaignStatsPerformance;
}

export interface MyCampaignStatsResponse {
  myCampaignStats: MyCampaignStats;
}

// ==============================
// PLATFORM & CATEGORY STATS (ADMIN)
// ==============================

export interface PlatformCampaignStatsOverview {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

export interface PlatformCampaignStatsByStatus {
  pending: number;
  approved: number;
  active: number;
  processing: number;
  completed: number;
  rejected: number;
  cancelled: number;
}

export interface PlatformCampaignStatsFinancial {
  totalTargetAmount: string;
  totalReceivedAmount: string;
  totalDonations: number;
  averageDonationAmount: string;
  fundingRate: number;
}

export interface PlatformCampaignStatsByCategoryItem {
  categoryId: string;
  categoryTitle: string;
  campaignCount: number;
  totalReceivedAmount: string;
}

export interface PlatformCampaignStatsPerformance {
  successRate: number;
  averageDurationDays: number;
  mostFundedCampaign: {
    id: string;
    title: string;
  } | null;
}

export interface PlatformCampaignStatsTimeRange {
  startDate: string;
  endDate: string;
  campaignsCreated: number;
  campaignsCompleted: number;
  totalRaised: string;
  donationsMade: number;
}

export interface PlatformCampaignStats {
  overview: PlatformCampaignStatsOverview;
  byStatus: PlatformCampaignStatsByStatus;
  financial: PlatformCampaignStatsFinancial;
  byCategory: PlatformCampaignStatsByCategoryItem[];
  performance: PlatformCampaignStatsPerformance;
  timeRange: PlatformCampaignStatsTimeRange;
}

export interface PlatformCampaignStatsResponse {
  platformCampaignStats: PlatformCampaignStats;
}

export interface CampaignStatsFilterInput {
  dateFrom?: string | null;
  dateTo?: string | null;
  categoryId?: string | null;
  creatorId?: string | null;
  status?: CampaignStatus[] | null;
}

export interface CategoryCampaignStatsOverview {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

export interface CategoryCampaignStatsByStatus {
  active: number;
  completed: number;
}

export interface CategoryCampaignStatsFinancial {
  totalTargetAmount: string;
  totalReceivedAmount: string;
  totalDonations: number;
  fundingRate: number;
}

export interface CategoryCampaignStatsPerformance {
  successRate: number;
  averageDurationDays: number;
  mostFundedCampaign: {
    id: string;
    title: string;
  } | null;
}

export interface CategoryCampaignStats {
  overview: CategoryCampaignStatsOverview;
  byStatus: CategoryCampaignStatsByStatus;
  financial: CategoryCampaignStatsFinancial;
  performance: CategoryCampaignStatsPerformance;
}

export interface CategoryCampaignStatsResponse {
  categoryCampaignStats: CategoryCampaignStats;
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
  | "PROCESSING"
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

  // Fundraising dates
  fundraisingStartDate: string; // ISO
  fundraisingEndDate: string; // ISO

  // Phases - new structure with budget allocation per phase
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
}
