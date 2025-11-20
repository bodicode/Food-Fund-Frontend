import { gql } from "@apollo/client";

export const GET_ORGANIZATION_BY_ID = gql`
  query GetOrganizationById($getOrganizationByIdId: String!) {
    getOrganizationById(id: $getOrganizationByIdId) {
      id
      name
      description
      address
      phone_number
      website
      status
      created_at
      active_members
      total_members
      representative_id
      representative {
        id
        full_name
        user_name
        email
        avatar_url
        phone_number
        is_active
      }
      members {
        id
        joined_at
        member_role
        status
        member {
          id
          full_name
          user_name
          email
          avatar_url
          phone_number
          is_active
        }
      }
    }
  }
`;
