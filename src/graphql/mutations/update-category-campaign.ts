import { gql } from "@apollo/client";

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCampaignCategoryInput!) {
    updateCampaignCategory(id: $id, input: $input) {
      id
      title
      description
      isActive
      updatedAt
    }
  }
`;
