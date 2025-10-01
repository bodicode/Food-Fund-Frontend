"use client";

import { GET_CAMPAIGNS } from "@/graphql/query/get-campaign";
import client from "@/lib/apollo-client";
import {
  Campaign,
  CampaignParams,
  ListCampaignsResponse,
} from "@/types/api/campaign";

export const campaignService = {
  getCampaigns: async (params: CampaignParams): Promise<Campaign[] | null> => {
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
};
