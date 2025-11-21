import { gql } from "@apollo/client";

export const UNREAD_COUNT = gql`
  query UnreadCount {
    unreadNotificationCount
  }
`;
