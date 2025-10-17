import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION = gql`
  mutation ($input: CreateOrganizationInput!) {
    requestCreateOrganization(input: $input) {
      message
      success
      organization {
        id
        name
        address
        phone_number
        website
        status
        description
        created_at
        representative {
          id
          full_name
          email
          user_name
          avatar_url
          is_active
          role
        }
      }
    }
  }
`;