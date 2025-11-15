import { gql } from "@apollo/client";

export const GET_MY_CAMPAIGNS = gql`
  query MyCampaigns($limit: Int, $offset: Int, $sortBy: CampaignSortOrder) {
    myCampaigns(sortBy: $sortBy, limit: $limit, offset: $offset) {
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
      fundingProgress
      daysActive
      daysRemaining
      totalPhases
      created_at
      
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
      
      phases {
        id
        phaseName
        location
        ingredientPurchaseDate
        cookingDate
        deliveryDate
        ingredientBudgetPercentage
        cookingBudgetPercentage
        deliveryBudgetPercentage
        status
      }
    }
  }
`;
