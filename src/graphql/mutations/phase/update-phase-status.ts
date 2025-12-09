import { gql } from "@apollo/client";

export const UPDATE_PHASE_STATUS = gql`
  mutation UpdatePhaseStatus($input: UpdatePhaseStatusInput!) {
    updatePhaseStatus(input: $input) {
      id
      phaseName
      status
    }
  }
`;
