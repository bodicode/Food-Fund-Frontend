import { gql } from "@apollo/client";

export const SYNC_CAMPAIGN_PHASES = gql`
  mutation SyncPhases($campaignId: String!, $phases: [SyncPhaseInput!]!) {
    syncCampaignPhases(campaignId: $campaignId, phases: $phases) {
      success
      message
      createdCount
      updatedCount
      deletedCount
      phases {
        id
        phaseName
        location
        ingredientPurchaseDate
        cookingDate
        deliveryDate
        ingredientBudgetPercentage
        cookingBudgetPercentage
        deliveryBudgetPercentage
        status
      }
    }
  }
`;
