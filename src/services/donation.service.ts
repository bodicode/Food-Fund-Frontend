"use client";

import { CREATE_DONATION } from "@/graphql/mutations/donation/create-donation";
import client from "@/lib/apollo-client";
import {
  CreateDonationInput,
  CreateDonationResponse,
  DonationResponse,
} from "@/types/api/donation";

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
};