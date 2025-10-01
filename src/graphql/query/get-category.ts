import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    campaignCategories {
      id
      title
      description
    }
  }
`;
