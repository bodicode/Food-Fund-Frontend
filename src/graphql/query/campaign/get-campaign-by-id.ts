import { gql } from "@apollo/client";

export const GET_CAMPAIGN_BY_ID = gql`
  query GetCampaign($id: String!) {
    campaign(id: $id) {
      id
      title
      description
      coverImage
      location
      startDate
      endDate
      status
      targetAmount
      donationCount
      receivedAmount
      createdAt
      createdBy
      category {
        id
        title
        description
      }
      creator {
        id
        full_name
        email
      }
    }
  }
`;
