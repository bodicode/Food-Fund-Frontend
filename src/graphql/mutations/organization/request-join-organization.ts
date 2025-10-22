import { gql } from "@apollo/client";

export const REQUEST_JOIN_ORGANIZATION = gql`
  mutation ($requestJoinOrganizationInput2: JoinOrganizationInput!) {
    requestJoinOrganization(input: $requestJoinOrganizationInput2) {
      id
      message
      requested_role
      status
      success
    }
  }
`;
