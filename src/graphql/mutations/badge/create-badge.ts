import { gql } from "@apollo/client";

export const CREATE_BADGE = gql`
  mutation CreateBadge($input: CreateBadgeInput!) {
    createBadge(input: $input) {
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
