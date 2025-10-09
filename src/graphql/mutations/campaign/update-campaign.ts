import { gql } from "@apollo/client";

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: String!, $input: UpdateCampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      id
      title
      description
      targetAmount
      coverImage
      categoryId
      startDate
      endDate
      updatedAt
    }
  }
`;
