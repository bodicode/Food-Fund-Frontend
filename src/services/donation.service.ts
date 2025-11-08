"use client";

import { CREATE_DONATION } from "@/graphql/mutations/donation/create-donation";
import { GET_CAMPAIGN_DONATIONS } from "@/graphql/query/donation/get-campaign-donations";
import { GET_MY_DONATIONS } from "@/graphql/query/donation/get-my-donations";
import { GET_DONATION_PAYMENT_LINK } from "@/graphql/query/donation/get-donation-payment-link";
import client from "@/lib/apollo-client";
import {
  CreateDonationInput,
  CreateDonationResponse,
  DonationResponse,
  GetCampaignDonationsParams,
  GetCampaignDonationsResponse,
  CampaignDonation,
  GetMyDonationsParams,
  GetMyDonationsResponse,
  MyDonationsData,
  GetDonationPaymentLinkResponse,
  DonationPaymentDetail,
} from "@/types/api/donation";

export const donationService = {
  async createDonation(input: CreateDonationInput): Promise<DonationResponse | null> {
    try {
      const { data} = await client.mutate<CreateDonationResponse>({
        mutation: CREATE_DONATION,
        variables: { input },
      });

      return data?.createDonation || null;
    } catch (error) {
      console.error("❌ Error creating donation:", error);
      throw error;
    }
  },

  async getCampaignDonations(
    params: GetCampaignDonationsParams
  ): Promise<CampaignDonation[]> {
    try {
      const { data } = await client.query<GetCampaignDonationsResponse>({
        query: GET_CAMPAIGN_DONATIONS,
        variables: params,
        fetchPolicy: "network-only",
      });

      return data?.getCampaignDonations || [];
    } catch (error) {
      console.error("❌ Error fetching campaign donations:", error);
      throw error;
    }
  },

  async getMyDonations(
    params: GetMyDonationsParams = {}
  ): Promise<MyDonationsData> {
    try {
      const { data } = await client.query<GetMyDonationsResponse>({
        query: GET_MY_DONATIONS,
        variables: params,
        fetchPolicy: "network-only",
      });

      return (
        data?.getMyDonations || {
          donations: [],
          totalAmount: 0,
          totalSuccessDonations: 0,
          totalDonatedCampaigns: 0,
        }
      );
    } catch (error) {
      console.error("❌ Error fetching my donations:", error);
      throw error;
    }
  },

  async getDonationPaymentLink(
    orderCode: string
  ): Promise<DonationPaymentDetail | null> {
    try {
      const { data } = await client.query<GetDonationPaymentLinkResponse>({
        query: GET_DONATION_PAYMENT_LINK,
        variables: { orderCode },
        fetchPolicy: "network-only",
      });

      return data?.getMyDonationPaymentLink || null;
    } catch (error) {
      console.error("❌ Error fetching donation payment link:", error);
      throw error;
    }
  },
};
