import { gql } from "@apollo/client";

export const GET_BADGE_BY_ID = gql`
  query GetBadgeById($getBadgeIdId: String!) {
    getBadgeId(id: $getBadgeIdId) {
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
