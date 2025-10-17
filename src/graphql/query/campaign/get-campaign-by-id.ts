import { gql } from "@apollo/client";

export const GET_CAMPAIGN_BY_ID = gql`
  query GetCampaign($id: String!) {
    campaign(id: $id) {
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
      category {
        id
        title
      }
      creator {
        full_name
        email
        phone_number
      }
      created_at
    }
  }
`;
