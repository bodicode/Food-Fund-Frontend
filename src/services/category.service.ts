import { CREATE_CATEGORY_MUTATION } from "@/graphql/mutations/category/create-category-campaign";
import { UPDATE_CATEGORY_MUTATION } from "@/graphql/mutations/category/update-category-campaign";
import { DELETE_CATEGORY_MUTATION } from "@/graphql/mutations/category/delete-category-campaign";
import { GET_CATEGORIES } from "@/graphql/query/category/get-category";
import client from "@/lib/apollo-client";
import {
    Category,
    CategoryStats,
    CampaignCategoriesStatsResponse,
    CreateCategoryInput,
    CreateCategoryResponse,
    UpdateCategoryInput,
    UpdateCategoryResponse,
    DeleteCategoryResponse,
} from "@/types/api/category";
import { GET_CATEGORY_BY_ID } from "@/graphql/query/category/get-category-by-id";
import { GET_CAMPAIGN_CATEGORIES_STATS } from "@/graphql/query/category/get-campaign-categories-stats";

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        try {
            const { data } = await client.query<{ campaignCategories: Category[] }>({
                query: GET_CATEGORIES,
                fetchPolicy: "no-cache",
            });
            return data?.campaignCategories || [];
        } catch (err) {
            console.error("Error fetching categories:", err);
            return [];
        }
    },

    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const { data } = await client.query<{ campaignCategory: Category }>({
                query: GET_CATEGORY_BY_ID,
                variables: { id },
                fetchPolicy: "no-cache",
            });
            return data?.campaignCategory || null;
        } catch (err) {
            console.error(`Error fetching category with id ${id}:`, err);
            return null;
        }
    },

    async createCategory(input: CreateCategoryInput): Promise<Category | null> {
        try {
            const { data } = await client.mutate<CreateCategoryResponse>({
                mutation: CREATE_CATEGORY_MUTATION,
                variables: { input },
            });
            return data?.createCampaignCategory || null;
        } catch (err) {
            console.error("Error creating category:", err);
            throw err;
        }
    },

    async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category | null> {
        try {
            const { data } = await client.mutate<UpdateCategoryResponse>({
                mutation: UPDATE_CATEGORY_MUTATION,
                variables: { id, input },
            });
            return data?.updateCampaignCategory || null;
        } catch (err) {
            console.error("Error updating category:", err);
            throw err;
        }
    },

    async deleteCategory(id: string): Promise<boolean> {
        try {
            const { data } = await client.mutate<DeleteCategoryResponse>({
                mutation: DELETE_CATEGORY_MUTATION,
                variables: { id },
            });
            return data?.deleteCampaignCategory ?? false;
        } catch (err) {
            console.error("Error deleting category:", err);
            throw err;
        }
    },

    async getCampaignCategoriesStats(): Promise<CategoryStats[]> {
        try {
            const { data } = await client.query<CampaignCategoriesStatsResponse>({
                query: GET_CAMPAIGN_CATEGORIES_STATS,
                fetchPolicy: "no-cache",
            });
            return data?.campaignCategoriesStats || [];
        } catch (err) {
            console.error("Error fetching campaign categories stats:", err);
            return [];
        }
    },
};
