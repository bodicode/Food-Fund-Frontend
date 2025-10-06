import { gql } from "@apollo/client";

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: String!) {
    deleteCampaignCategory(id: $id)
  }
`;
