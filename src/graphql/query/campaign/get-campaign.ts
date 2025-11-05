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
      status
      targetAmount
      donationCount
      receivedAmount
      fundraisingStartDate
      fundraisingEndDate
      
      # Budget percentages
      cookingBudgetPercentage
      ingredientBudgetPercentage
      deliveryBudgetPercentage
      
      # Legacy fields for backward compatibility
      cookingFundsAmount
      deliveryFundsAmount
      ingredientFundsAmount
      
      # Phases - new structure
      phases {
        id
        phaseName
        location
        ingredientPurchaseDate
        cookingDate
        deliveryDate
        status
      }
      
      category {
        id
        title
        description
      }
      
      creator {
        id
        full_name
        email
        phone_number
      }
      
      created_at
      createdBy
    }
  }
`;
