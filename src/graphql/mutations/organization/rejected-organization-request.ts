import { gql } from "@apollo/client";

export const REJECT_ORGANIZATION_REQUEST = gql`
  mutation RejectOrganizationRequest($organizationId: String!) {
    rejectOrganizationRequest(organizationId: $organizationId) {
      success
      message
      organization {
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
  }
`;
