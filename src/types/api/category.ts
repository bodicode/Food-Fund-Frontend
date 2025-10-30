export interface Category {
  id: string;
  title: string;
  description?: string;
}

export interface CategoryStats {
  id: string;
  title: string;
  description?: string;
  campaignCount: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignCategoriesStatsResponse {
  campaignCategoriesStats: CategoryStats[];
}
export interface CreateCategoryInput {
  title: string;
  description: string;
}
export interface CreateCategoryResponse {
  createCampaignCategory: Category;
}

export type UpdateCategoryInput = {
  title?: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateCategoryResponse = {
  updateCampaignCategory: Category;
};

export type DeleteCategoryResponse = {
  deleteCampaignCategory: boolean;
};