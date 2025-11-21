import { MY_NOTIFICATIONS } from "@/graphql/query/notification/my-notifications";
import { UNREAD_COUNT } from "@/graphql/query/notification/unread-count";
import { MARK_ALL_AS_READ } from "@/graphql/mutations/notification/mark-all-as-read";
import { DELETE_NOTIFICATION } from "@/graphql/mutations/notification/delete-notification";
import client from "@/lib/apollo-client";
import {
  Notification,
  MyNotificationsResponse,
  UnreadCountResponse,
  MarkAllAsReadResponse,
  DeleteNotificationResponse,
} from "@/types/api/notification";

export const notificationService = {
  async getMyNotifications(
    limit: number = 20,
    cursor?: string,
    isRead?: boolean
  ): Promise<{
    notifications: Notification[];
    hasMore: boolean;
    nextCursor: string | null;
  }> {
    try {
      const { data } = await client.query<MyNotificationsResponse>({
        query: MY_NOTIFICATIONS,
        variables: { limit, cursor, isRead },
        fetchPolicy: "network-only",
      });

      if (!data?.myNotifications) {
        return { notifications: [], hasMore: false, nextCursor: null };
      }

      return data.myNotifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const { data } = await client.query<UnreadCountResponse>({
        query: UNREAD_COUNT,
        fetchPolicy: "network-only",
      });

      return data?.unreadNotificationCount ?? 0;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<{
    success: boolean;
    count: number;
    message: string;
  }> {
    try {
      const { data } = await client.mutate<MarkAllAsReadResponse>({
        mutation: MARK_ALL_AS_READ,
      });

      if (!data?.markAllNotificationsAsRead) {
        throw new Error("Failed to mark all as read");
      }

      return data.markAllNotificationsAsRead;
    } catch (error) {
      console.error("Error marking all as read:", error);
      throw error;
    }
  },

  async deleteNotification(notificationId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { data } = await client.mutate<DeleteNotificationResponse>({
        mutation: DELETE_NOTIFICATION,
        variables: { notificationId },
      });

      if (!data?.deleteNotification) {
        throw new Error("Failed to delete notification");
      }

      return data.deleteNotification;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};
