import { gql } from "@apollo/client";

export const GET_CAMPAIGN_CATEGORIES_STATS = gql`
  query CampaignCategoriesStats {
    campaignCategoriesStats {
      id
      title
      description
      campaignCount
      created_at
      updated_at
    }
  }
`;