import { gql } from "@apollo/client";

export const ADD_CAMPAIGN_PHASE = gql`
  mutation AddPhase($campaignId: String!, $input: CreatePhaseInput!) {
    addCampaignPhase(campaignId: $campaignId, input: $input) {
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