import { gql } from "@apollo/client";

export const SEARCH_CAMPAIGNS = gql`
  query SearchCampaigns($input: SearchCampaignInput!) {
    searchCampaigns(input: $input) {
      items {
        id
        title
        coverImage
        status
        targetAmount
        donationCount
        receivedAmount
        fundraisingStartDate
        fundraisingEndDate
        fundingProgress
        daysRemaining
        creator {
          id
          full_name
        }
        category {
          title
        }
        phases {
          location
        }
      }
      limit
      page
      total
      totalPages
    }
  }
`;
