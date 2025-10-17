import { gql } from "@apollo/client";

export const GET_CATEGORY_BY_ID = gql`
  query GetCategory($id: String!) {
    campaignCategory(id: $id) {
      id
      title
      description
      created_at
      updated_at
    }
  }
`;
