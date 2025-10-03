import { gql } from "@apollo/client";

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCampaignCategoryInput!) {
    createCampaignCategory(input: $input) {
      id
      title
      description
    }
  }
`;