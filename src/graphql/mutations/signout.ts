import { gql } from "@apollo/client";

export const SIGNOUT_MUTATION = gql`
  mutation {
    signOut {
      message
      success
      timestamp
    }
  }
`;
