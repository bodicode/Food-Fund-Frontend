import { gql } from "@apollo/client";

export const GET_MY_CAMPAIGNS = gql`
  query MyCampaigns($limit: Int, $offset: Int, $sortBy: CampaignSortOrder) {
    myCampaigns(sortBy: $sortBy, limit: $limit, offset: $offset) {
      id
      title
      coverImage
      status
      created_at
      createdBy
    }
  }
`;
