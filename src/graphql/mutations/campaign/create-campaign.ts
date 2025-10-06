import { gql } from "@apollo/client";

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      title
      description
      coverImage
      location
      targetAmount
      startDate
      endDate
      status
      createdBy
      categoryId
    }
  }
`;