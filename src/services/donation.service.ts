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
import { DonationDetails, GetDonationDetailsResponse } from "@/types/api/donation-detail";
import { GET_DONATION_DETAILS } from "@/graphql/query/donation/get-donation-details";
import { SEARCH_DONATIONS } from "@/graphql/query/donation/search-donations";
import { SearchDonationInput, SearchDonationResponse } from "@/types/api/donation";

export const donationService = {
  async createDonation(input: CreateDonationInput): Promise<DonationResponse | null> {
    try {
      const { data } = await client.mutate<CreateDonationResponse>({
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

  async getDonationDetails(orderCode: string): Promise<DonationDetails | null> {
    try {
      const result = await client.query<GetDonationDetailsResponse>({
        query: GET_DONATION_DETAILS,
        variables: { orderCode },
        fetchPolicy: "network-only",
      });

      if (!result.data) {
        return null;
      }

      return result.data.getMyDonationDetails;
    } catch (error) {
      console.error("❌ Error fetching donation details:", error);
      throw error;
    }
  },
  async searchDonations(input: SearchDonationInput): Promise<CampaignDonation[]> {
    try {
      const { data } = await client.query<SearchDonationResponse>({
        query: SEARCH_DONATIONS,
        variables: { input },
        fetchPolicy: "network-only",
      });

      if (!data?.searchDonationStatements?.transactions) {
        return [];
      }

      // Map to CampaignDonation interface to maintain compatibility
      return data.searchDonationStatements.transactions.map(tx => ({
        amount: tx.receivedAmount,
        donorName: tx.donorName,
        transactionDatetime: tx.transactionDateTime
      }));
    } catch (error) {
      console.error("❌ Error searching donations:", error);
      throw error;
    }
  },
};
