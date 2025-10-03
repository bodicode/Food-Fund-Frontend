export interface Category {
  id: string;
  title: string;
  description?: string;
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