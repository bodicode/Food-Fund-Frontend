import { gql } from "@apollo/client";

export const CANCEL_JOIN_REQUEST_ORGANIZATION = gql`
  mutation CancelJoinRequestOrganization {
    cancelJoinRequestOrganization {
      cancelledRequestId
      message
      success
    }
  }
`;
