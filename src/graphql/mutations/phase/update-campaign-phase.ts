import { gql } from "@apollo/client";

export const UPDATE_CAMPAIGN_PHASE = gql`
  mutation UpdatePhase($id: String!, $input: UpdatePhaseInput!) {
    updateCampaignPhase(id: $id, input: $input) {
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