import { gql } from "@apollo/client";

export const MARK_ALL_AS_READ = gql`
  mutation MarkAllAsRead {
    markAllNotificationsAsRead {
      success
      count
      message
    }
  }
`;
