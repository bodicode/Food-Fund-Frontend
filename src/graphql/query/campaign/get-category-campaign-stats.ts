import { gql } from "@apollo/client";

export const GET_CATEGORY_CAMPAIGN_STATS = gql`
  query CategoryStats($categoryId: String!) {
    categoryCampaignStats(categoryId: $categoryId) {
      overview {
        totalCampaigns
        activeCampaigns
        completedCampaigns
      }
      byStatus {
        active
        completed
      }
      financial {
        totalTargetAmount
        totalReceivedAmount
        totalDonations
        fundingRate
      }
      performance {
        successRate
        averageDurationDays
        mostFundedCampaign {
          id
          title
        }
      }
    }
  }
`;

