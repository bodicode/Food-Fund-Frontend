import { gql } from "@apollo/client";

export const DELETE_MANY_CAMPAIGN_PHASES = gql`
  mutation DeleteManyPhases($ids: [String!]!) {
    deleteManyCampaignPhases(ids: $ids) {
      success
      deletedCount
      affectedCampaignIds
    }
  }
`;