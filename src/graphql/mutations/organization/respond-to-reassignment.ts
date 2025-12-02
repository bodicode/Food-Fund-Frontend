import { gql } from "@apollo/client";

export const RESPOND_TO_REASSIGNMENT = gql`
  mutation Respond($input: RespondReassignmentInput!) {
    respondToReassignment(input: $input) {
      id
      campaignId
      organizationId
      status
      respondedAt
      responseNote
    }
  }
`;
