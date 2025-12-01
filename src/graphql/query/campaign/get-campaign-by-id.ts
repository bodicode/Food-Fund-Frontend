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
        representative {
          email
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
    }
  }
`;
