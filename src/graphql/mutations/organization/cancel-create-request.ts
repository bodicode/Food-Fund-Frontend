import { gql } from "@apollo/client";

export const CANCEL_MY_CREATE_ORGANIZATION_REQUEST = gql`
  mutation CancelMyCreateOrganizationRequest {
    cancelMyCreateOrganizationRequest {
      cancelledOrganizationId
      message
      previousStatus
      reason
      success
    }
  }
`;
