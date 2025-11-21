import { gql } from "@apollo/client";

export const GET_ALL_BADGES = gql`
  query GetAllBadges {
    getAllBadges {
      id
      name
      description
      icon_url
      is_active
      sort_order
      created_at
      updated_at
    }
  }
`;
