"use client";

import { ADD_CAMPAIGN_PHASE } from "@/graphql/mutations/phase/add-campaign-phase";
import { UPDATE_CAMPAIGN_PHASE } from "@/graphql/mutations/phase/update-campaign-phase";
import { DELETE_CAMPAIGN_PHASE } from "@/graphql/mutations/phase/delete-campaign-phase";
import { DELETE_MANY_CAMPAIGN_PHASES } from "@/graphql/mutations/phase/delete-many-campaign-phases";
import { SYNC_CAMPAIGN_PHASES } from "@/graphql/mutations/campaign/sync-phases";
import client from "@/lib/apollo-client";
import {
  CampaignPhase,
  CreatePhaseInput,
  UpdatePhaseInput,
  SyncPhaseInput,
  AddCampaignPhaseResponse,
  UpdateCampaignPhaseResponse,
  DeleteCampaignPhaseResponse,
  DeleteManyCampaignPhasesResponse,
  SyncCampaignPhasesResponse,
} from "@/types/api/phase";

export const phaseService = {
  async addCampaignPhase(
    campaignId: string,
    input: CreatePhaseInput
  ): Promise<CampaignPhase | null> {
    try {
      const { data } = await client.mutate<AddCampaignPhaseResponse>({
        mutation: ADD_CAMPAIGN_PHASE,
        variables: { campaignId, input },
      });

      return data?.addCampaignPhase || null;
    } catch (error) {
      console.error("❌ Error adding campaign phase:", error);
      throw error;
    }
  },

  async updateCampaignPhase(
    id: string,
    input: UpdatePhaseInput
  ): Promise<CampaignPhase | null> {
    try {
      const { data } = await client.mutate<UpdateCampaignPhaseResponse>({
        mutation: UPDATE_CAMPAIGN_PHASE,
        variables: { id, input },
      });

      return data?.updateCampaignPhase || null;
    } catch (error) {
      console.error("❌ Error updating campaign phase:", error);
      throw error;
    }
  },

  async deleteCampaignPhase(id: string): Promise<boolean> {
    try {
      const { data } = await client.mutate<DeleteCampaignPhaseResponse>({
        mutation: DELETE_CAMPAIGN_PHASE,
        variables: { id },
      });

      return data?.deleteCampaignPhase ?? false;
    } catch (error) {
      console.error("❌ Error deleting campaign phase:", error);
      throw error;
    }
  },

  async deleteManyCampaignPhases(ids: string[]): Promise<{
    success: boolean;
    deletedCount: number;
    affectedCampaignIds: string[];
  } | null> {
    try {
      const { data } = await client.mutate<DeleteManyCampaignPhasesResponse>({
        mutation: DELETE_MANY_CAMPAIGN_PHASES,
        variables: { ids },
      });

      return data?.deleteManyCampaignPhases || null;
    } catch (error) {
      console.error("❌ Error deleting many campaign phases:", error);
      throw error;
    }
  },

  async syncCampaignPhases(
    campaignId: string,
    phases: SyncPhaseInput[]
  ): Promise<{
    success: boolean;
    message: string;
    createdCount: number;
    updatedCount: number;
    deletedCount: number;
    phases: CampaignPhase[];
  } | null> {
    try {
      const { data } = await client.mutate<SyncCampaignPhasesResponse>({
        mutation: SYNC_CAMPAIGN_PHASES,
        variables: { campaignId, phases },
      });

      return data?.syncCampaignPhases || null;
    } catch (error) {
      console.error("❌ Error syncing campaign phases:", error);
      throw error;
    }
  },
};