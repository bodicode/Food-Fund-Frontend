import { gql } from "@apollo/client";

export const GET_CAMPAIGN_PHASES = gql`
  query GetCampaignPhases($campaignId: String!) {
    campaignPhases(campaignId: $campaignId) {
      id
      phaseName
      location
      ingredientPurchaseDate
      cookingDate
      deliveryDate
      status
    }
  }
`;