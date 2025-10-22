import { gql } from "@apollo/client";

export const REMOVE_STAFF_MEMBER = gql`
  mutation ($memberId: String!) {
    removeStaffMember(memberId: $memberId) {
      message
      removedMember {
        email
        id
        name
        role
      }
    }
  }
`;
