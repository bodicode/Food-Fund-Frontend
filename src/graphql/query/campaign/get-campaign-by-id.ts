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
