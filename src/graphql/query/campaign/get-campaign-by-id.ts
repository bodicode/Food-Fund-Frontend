import { gql } from "@apollo/client";

export const GET_CAMPAIGN_BY_ID = gql`
  query GetCampaign($id: String!) {
    campaign(id: $id) {
      id
      title
      description
      coverImage
      status
      fundraisingStartDate
      fundraisingEndDate
      fundingProgress
      daysActive
      daysRemaining
      totalPhases
      targetAmount
      donationCount
      receivedAmount
      extensionCount
      created_at
      
      category {
        id
        title
        description
      }
      organization {
        id
        name
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
        ingredientFundsAmount
        cookingFundsAmount
        deliveryFundsAmount
        status
      }
    }
  }
`;
