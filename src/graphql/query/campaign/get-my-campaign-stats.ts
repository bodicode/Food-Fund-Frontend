import { gql } from "@apollo/client";

export const GET_MY_CAMPAIGN_STATS = gql`
  query MyStats {
    myCampaignStats {
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

