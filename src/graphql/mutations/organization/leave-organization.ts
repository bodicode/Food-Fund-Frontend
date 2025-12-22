import { gql } from "@apollo/client";

export const LEAVE_ORGANIZATION = gql`
  mutation LeaveOrganization {
    leaveOrganization {
      message
      previousOrganization {
        id
        name
      }
      requiresReLogin
      previousRole
      success
    }
  }
`;
