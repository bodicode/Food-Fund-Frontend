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
      activity_field
      email
      representative_name
      representative_identity_number
      representative_id
      bank_account_name
      bank_account_number
      bank_name
      bank_short_name
    }
  }
`;
