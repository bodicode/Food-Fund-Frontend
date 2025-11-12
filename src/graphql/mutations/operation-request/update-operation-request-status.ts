import { gql } from "@apollo/client";

export const UPDATE_OPERATION_REQUEST_STATUS = gql`
  mutation UpdateOperationRequestStatus(
    $input: UpdateOperationRequestStatusInput!
  ) {
    updateOperationRequestStatus(input: $input) {
      id
      status
      adminNote
      changedStatusAt
    }
  }
`;
