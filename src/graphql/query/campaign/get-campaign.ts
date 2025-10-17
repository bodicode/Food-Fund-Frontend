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
      description
      coverImage
      location
      status
      targetAmount
      donationCount
      receivedAmount
      fundraisingStartDate
      fundraisingEndDate
      cookingDate
      deliveryDate
      ingredientPurchaseDate
      cookingFundsAmount
      deliveryFundsAmount
      ingredientFundsAmount
      cookingBudgetPercentage
      ingredientBudgetPercentage
      deliveryBudgetPercentage
      categoryId
      creator {
        full_name
      }
      created_at
    }
  }
`;
