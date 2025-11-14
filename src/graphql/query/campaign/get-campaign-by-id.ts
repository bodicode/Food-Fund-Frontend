import { gql } from "@apollo/client";

export const GET_CAMPAIGN_BY_ID = gql`
  query GetCampaign($id: String!) {
    campaign(id: $id) {
      id
      title
      description
      coverImage
      status
      targetAmount
      donationCount
      receivedAmount
      fundingProgress
      daysActive
      totalPhases
      daysRemaining
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
