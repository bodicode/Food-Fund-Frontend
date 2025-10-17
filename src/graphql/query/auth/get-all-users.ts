import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query getAllUsers($limit: Int!, $offset: Int!) {
    getAllUsers(limit: $limit, offset: $offset) {
      avatar_url
      bio
      created_at
      email
      full_name
      id
      is_active
      phone_number
      role
      updated_at
      user_name
    }
  }
`;


