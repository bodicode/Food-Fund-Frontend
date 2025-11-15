import { gql } from "@apollo/client";

export const GET_PLATFORM_CAMPAIGN_STATS = gql`
  query PlatformStats($filter: CampaignStatsFilterInput) {
    platformCampaignStats(filter: $filter) {
      overview {
        totalCampaigns
        activeCampaigns
        completedCampaigns
      }
      byStatus {
        pending
        approved
        active
        processing
        completed
        rejected
        cancelled
      }
      financial {
        totalTargetAmount
        totalReceivedAmount
        totalDonations
        averageDonationAmount
        fundingRate
      }
      byCategory {
        categoryId
        categoryTitle
        campaignCount
        totalReceivedAmount
      }
      performance {
        successRate
        averageDurationDays
        mostFundedCampaign {
          id
          title
        }
      }
      timeRange {
        startDate
        endDate
        campaignsCreated
        campaignsCompleted
        totalRaised
        donationsMade
      }
    }
  }
`;

