import { gql } from "@apollo/client";

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
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
      ingredientBudgetPercentage
      cookingBudgetPercentage
      deliveryBudgetPercentage
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
      }
      created_at
      createdBy
    }
  }
`;
