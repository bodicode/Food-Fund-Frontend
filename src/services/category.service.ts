import { GET_CATEGORIES } from "@/graphql/query/get-category";
import client from "@/lib/apollo-client";
import { Category } from "@/types/api/category";

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
};
