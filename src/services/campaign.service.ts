"use client";

import { CHANGE_CAMPAIGN_STATUS } from "@/graphql/mutations/campaign/change-campaign-status";
import { CREATE_CAMPAIGN } from "@/graphql/mutations/campaign/create-campaign";
import { UPDATE_CAMPAIGN } from "@/graphql/mutations/campaign/update-campaign";
import { DELETE_CAMPAIGN } from "@/graphql/mutations/campaign/delete-campaign";
import { EXTEND_CAMPAIGN } from "@/graphql/mutations/campaign/extend-campaign";
import { GET_CAMPAIGNS } from "@/graphql/query/campaign/get-campaign";
import { GET_CAMPAIGN_BY_ID } from "@/graphql/query/campaign/get-campaign-by-id";
import { GET_MY_CAMPAIGNS } from "@/graphql/query/campaign/get-my-campaign";
import { GET_MY_CAMPAIGN_STATS } from "@/graphql/query/campaign/get-my-campaign-stats";
import { GET_PLATFORM_CAMPAIGN_STATS } from "@/graphql/query/campaign/get-platform-campaign-stats";
import { GET_CATEGORY_CAMPAIGN_STATS } from "@/graphql/query/campaign/get-category-campaign-stats";
import client from "@/lib/apollo-client";
import {
  Campaign,
  CampaignParams,
  ListCampaignsResponse,
  ChangeCampaignStatusResponse,
  CreateCampaignInput,
  CreateCampaignResponse,
  UpdateCampaignInput,
  MyCampaignStats,
  MyCampaignStatsResponse,
  PlatformCampaignStats,
  PlatformCampaignStatsResponse,
  CampaignStatsFilterInput,
  CategoryCampaignStats,
  CategoryCampaignStatsResponse,
  SearchCampaignInput,
  SearchCampaignResponse,
  SearchCampaignResult,
} from "@/types/api/campaign";
import { SEARCH_CAMPAIGNS } from "@/graphql/query/campaign/search-campaigns";

import { CREATE_INGREDIENT_REQUEST } from "@/graphql/mutations/campaign/create-ingredient-request";
import {
  CreateIngredientRequestInput,
  CreateIngredientRequestResponse,
  IngredientRequest,
} from "@/types/api/ingredient-request";

export const campaignService = {
  async createIngredientRequest(
    input: CreateIngredientRequestInput
  ): Promise<IngredientRequest | null> {
    try {
      const { data } = await client.mutate<CreateIngredientRequestResponse>({
        mutation: CREATE_INGREDIENT_REQUEST,
        variables: { input },
      });
      return data?.createIngredientRequest ?? null;
    } catch (error) {
      console.error("Error creating ingredient request:", error);
      throw error;
    }
  },
  async getMyCampaigns(params?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
  }): Promise<Campaign[]> {
    try {
      const { data } = await client.query<{ myCampaigns: Campaign[] }>({
        query: GET_MY_CAMPAIGNS,
        variables: params,
        fetchPolicy: "no-cache",
      });
      return data?.myCampaigns || [];
    } catch (error) {
      console.error("❌ Error fetching my campaigns:", error);
      return [];
    }
  },

  async getMyCampaignStats(): Promise<MyCampaignStats | null> {
    try {
      const { data } = await client.query<MyCampaignStatsResponse>({
        query: GET_MY_CAMPAIGN_STATS,
        fetchPolicy: "no-cache",
      });
      return data?.myCampaignStats ?? null;
    } catch (error) {
      console.error("Error fetching my campaign stats:", error);
      return null;
    }
  },

  async getPlatformCampaignStats(
    filter: CampaignStatsFilterInput
  ): Promise<PlatformCampaignStats | null> {
    try {
      const { data } = await client.query<PlatformCampaignStatsResponse>({
        query: GET_PLATFORM_CAMPAIGN_STATS,
        variables: { filter },
        fetchPolicy: "no-cache",
      });
      return data?.platformCampaignStats ?? null;
    } catch (error) {
      console.error("Error fetching platform campaign stats:", error);
      return null;
    }
  },

  async getCategoryCampaignStats(
    categoryId: string
  ): Promise<CategoryCampaignStats | null> {
    try {
      const { data } = await client.query<CategoryCampaignStatsResponse>({
        query: GET_CATEGORY_CAMPAIGN_STATS,
        variables: { categoryId },
        fetchPolicy: "no-cache",
      });
      return data?.categoryCampaignStats ?? null;
    } catch (error) {
      console.error("Error fetching category campaign stats:", error);
      return null;
    }
  },

  async getCampaigns(params: CampaignParams): Promise<Campaign[] | null> {
    try {
      const { data } = await client.query<ListCampaignsResponse>({
        query: GET_CAMPAIGNS,
        variables: params,
        fetchPolicy: "network-only",
      });

      if (!data || !data.campaigns) {
        return null;
      }

      return data.campaigns;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  },

  async getCampaignById(id: string): Promise<Campaign | null> {
    try {
      const { data } = await client.query<{ campaign: Campaign }>({
        query: GET_CAMPAIGN_BY_ID,
        variables: { id },
        fetchPolicy: "no-cache",
      });

      return data?.campaign || null;
    } catch (error) {
      console.error("❌ Error fetching campaign by ID:", error);
      return null;
    }
  },

  async changeStatus(
    id: string,
    status: Campaign["status"],
    reason?: string
  ): Promise<Campaign | null> {
    try {
      const { data } = await client.mutate<ChangeCampaignStatusResponse>({
        mutation: CHANGE_CAMPAIGN_STATUS,
        variables: {
          input: {
            campaignId: id,
            newStatus: status,
            reason,
          },
        },
        refetchQueries: [{ query: GET_CAMPAIGNS }],
      });

      if (!data || !data.changeCampaignStatus) {
        return null;
      }

      return data.changeCampaignStatus as Campaign;
    } catch (error) {
      console.error("Error changing campaign status:", error);
      throw error;
    }
  },

  async createCampaign(input: CreateCampaignInput): Promise<Campaign | null> {
    try {
      const { data, error } = await client.mutate<CreateCampaignResponse>({
        mutation: CREATE_CAMPAIGN,
        variables: { input },
        refetchQueries: [{ query: GET_CAMPAIGNS }],
      });

      if (!data || !data.createCampaign) {
        return Promise.reject(error);
      }

      return data.createCampaign;
    } catch (error) {
      console.error("❌ Error creating campaign:", error);
      throw error;
    }
  },

  async updateCampaign(
    id: string,
    input: UpdateCampaignInput
  ): Promise<Campaign | null> {
    try {
      const { data } = await client.mutate<{
        updateCampaign: Campaign;
      }>({
        mutation: UPDATE_CAMPAIGN,
        variables: { id, input },
        fetchPolicy: "no-cache",
        refetchQueries: [{ query: GET_CAMPAIGNS }],
      });

      if (!data?.updateCampaign) {
        throw new Error("Không nhận được dữ liệu phản hồi từ server");
      }

      return data.updateCampaign;
    } catch (error) {
      console.error("❌ Error updating campaign:", error);
      throw error;
    }
  },

  async deleteCampaign(id: string): Promise<boolean> {
    try {
      const { data } = await client.mutate<{ deleteCampaign: boolean }>({
        mutation: DELETE_CAMPAIGN,
        variables: { id },
        refetchQueries: [{ query: GET_CAMPAIGNS }, { query: GET_MY_CAMPAIGNS }],
      });

      return data?.deleteCampaign ?? false;
    } catch (error) {
      console.error("❌ Error deleting campaign:", error);
      throw error;
    }
  },

  async extendCampaign(
    id: string,
    extensionDays: number
  ): Promise<Campaign | null> {
    try {
      const { data } = await client.mutate<{
        extendCampaign: Campaign;
      }>({
        mutation: EXTEND_CAMPAIGN,
        variables: { id, input: { extensionDays } },
        refetchQueries: [{ query: GET_CAMPAIGN_BY_ID, variables: { id } }],
      });

      if (!data?.extendCampaign) {
        throw new Error("Không nhận được dữ liệu phản hồi từ server");
      }

      return data.extendCampaign;
    } catch (error) {
      console.error("❌ Error extending campaign:", error);
      throw error;
    }
  },
  async searchCampaigns(
    input: SearchCampaignInput
  ): Promise<SearchCampaignResult | null> {
    try {
      const { data } = await client.query<SearchCampaignResponse>({
        query: SEARCH_CAMPAIGNS,
        variables: { input },
        fetchPolicy: "network-only",
      });

      return data?.searchCampaigns ?? null;
    } catch (error) {
      console.error("❌ Error searching campaigns:", error);
      return null;
    }
  },
};
