import { gql } from "@apollo/client";

export const MARK_CAMPAIGN_COMPLETE = gql`
  mutation MarkCampaignComplete($campaignId: String!) {
    markCampaignComplete(campaignId: $campaignId) {
      id
      title
      slug
      status
      completedAt
      receivedAmount
      donationCount
      fundingProgress
      phases {
        id
        phaseName
        status
      }
    }
  }
`;
