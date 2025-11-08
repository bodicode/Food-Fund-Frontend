import { gql } from "@apollo/client";

export const GET_CAMPAIGN_DONATIONS = gql`
  query GetCampaignDonations(
    $campaignId: String!
    $skip: Float
    $take: Float
    $sortBy: DonationSortField
    $sortOrder: SortOrder
    $searchDonorName: String
  ) {
    getCampaignDonations(
      campaignId: $campaignId
      skip: $skip
      take: $take
      sortBy: $sortBy
      sortOrder: $sortOrder
      searchDonorName: $searchDonorName
    ) {
      amount
      campaignId
      donorName
      isAnonymous
      transactionDatetime
    }
  }
`;
