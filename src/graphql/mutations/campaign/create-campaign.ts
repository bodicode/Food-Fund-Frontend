import { gql } from "@apollo/client";

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      title
      description
      coverImage
      location
      status
      targetAmount
      donationCount
      receivedAmount
      created_at
      createdBy
      category {
        id
        title
        description
      }
      creator {
        id
        full_name
      }
    }
  }
`;
