import { gql } from "@apollo/client";

export const DELETE_CAMPAIGN_PHASE = gql`
  mutation DeletePhase($id: String!) {
    deleteCampaignPhase(id: $id)
  }
`;