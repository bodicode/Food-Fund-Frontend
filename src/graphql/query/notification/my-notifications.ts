import { gql } from "@apollo/client";

export const MY_NOTIFICATIONS = gql`
  query MyNotifications($limit: Int, $cursor: String, $isRead: Boolean) {
    myNotifications(limit: $limit, cursor: $cursor, isRead: $isRead) {
      notifications {
        id
        type
        data
        isRead
        created_at
      }
      hasMore
      nextCursor
    }
  }
`;
