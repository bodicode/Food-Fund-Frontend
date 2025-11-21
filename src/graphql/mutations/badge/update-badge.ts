import { gql } from "@apollo/client";

export const UPDATE_BADGE = gql`
  mutation UpdateBadge($updateBadgeId: String!, $input: UpdateBadgeInput!) {
    updateBadge(id: $updateBadgeId, input: $input) {
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
