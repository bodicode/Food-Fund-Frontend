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
        title
        description
      }
      creator {
        id
        cognito_id
        full_name
        user_name
      }
      organization {
        id
        name
        phone_number
        representative {
          email
          full_name
          id
          cognito_id
        }
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
      reason
    }
  }
`;
