import { gql } from "@apollo/client";

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: String!) {
    deleteNotification(notificationId: $notificationId) {
      success
      message
    }
  }
`;
