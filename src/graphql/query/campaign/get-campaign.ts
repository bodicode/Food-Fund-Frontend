import { gql } from "@apollo/client";

export const GET_CAMPAIGNS = gql`
  query ListCampaigns(
    $filter: CampaignFilterInput
    $search: String
    $sortBy: CampaignSortOrder
    $limit: Int
    $offset: Int
  ) {
    campaigns(
      filter: $filter
      search: $search
      sortBy: $sortBy
      limit: $limit
      offset: $offset
    ) {
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
      daysActive
      totalPhases
      daysRemaining
      creator {
        id
        full_name
      }
      category {
        id
        title
      }
      phases { 
          location
      }
    }
  }
`;
