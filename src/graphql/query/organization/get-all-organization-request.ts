import { gql } from "@apollo/client";

export const GET_ALL_ORGANIZATION_REQUESTS = gql`
  query GetAllOrganizationRequests($sortOrder: String!) {
    getAllOrganizationRequests(sortOrder: $sortOrder) {
      id
      name
      description
      address
      phone_number
      website
      status
      created_at
      representative {
        id
        full_name
        user_name
        email
        avatar_url
        bio
        role
        is_active
      }
    }
  }
`;
