import { CREATE_CATEGORY_MUTATION } from "@/graphql/mutations/create-category-campaign";
import { UPDATE_CATEGORY_MUTATION } from "@/graphql/mutations/update-category-campaign";
import { DELETE_CATEGORY_MUTATION } from "@/graphql/mutations/delete-category-campaign";
import { GET_CATEGORIES } from "@/graphql/query/get-category";
import client from "@/lib/apollo-client";
import {
    Category,
    CreateCategoryInput,
    CreateCategoryResponse,
    UpdateCategoryInput,
    UpdateCategoryResponse,
    DeleteCategoryResponse,
} from "@/types/api/category";

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
};
