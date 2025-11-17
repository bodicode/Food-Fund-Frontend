import { gql } from "@apollo/client";

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: String!, $input: UpdateCampaignInput!) {
    updateCampaign(id: $id, input: $input) {
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

      created_at
      createdBy
    }
  }
`;
