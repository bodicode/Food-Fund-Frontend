"use client";

import { CHANGE_CAMPAIGN_STATUS } from "@/graphql/mutations/campaign/change-campaign-status";
import { CREATE_CAMPAIGN } from "@/graphql/mutations/campaign/create-campaign";
import { GET_CAMPAIGNS } from "@/graphql/query/campaign/get-campaign";
import { GET_MY_CAMPAIGNS } from "@/graphql/query/campaign/get-my-campaign";
import client from "@/lib/apollo-client";
import {
  Campaign,
  CampaignParams,
  ListCampaignsResponse,
  ChangeCampaignStatusResponse,
  CreateCampaignInput,
  CreateCampaignResponse,
} from "@/types/api/campaign";

export const campaignService = {
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

  async getCampaigns(params: CampaignParams): Promise<Campaign[] | null> {
    try {
      const { data } = await client.query<ListCampaignsResponse>({
        query: GET_CAMPAIGNS,
        variables: params,
        fetchPolicy: "cache-first",
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

  async changeStatus(
    id: string,
    status: Campaign["status"]
  ): Promise<Campaign | null> {
    try {
      const { data } = await client.mutate<ChangeCampaignStatusResponse>({
        mutation: CHANGE_CAMPAIGN_STATUS,
        variables: { id, status },
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

  async createCampaign(
    input: CreateCampaignInput
  ): Promise<Campaign | null> {
    try {
      const { data } = await client.mutate<CreateCampaignResponse>({
        mutation: CREATE_CAMPAIGN,
        variables: { input },
        refetchQueries: [{ query: GET_CAMPAIGNS }],
      });

      if (!data || !data.createCampaign) return null;
      return data.createCampaign;
    } catch (error) {
      console.error("❌ Error creating campaign:", error);
      throw error;
    }
  },
};
