export interface NotificationData {
  title?: string;
  message?: string;
  postTitle?: string;
  likeCount?: number;
  [key: string]: string | number | undefined;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData | string;
  isRead: boolean;
  created_at: string;
}

export interface MyNotificationsResponse {
  myNotifications: {
    notifications: Notification[];
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface UnreadCountResponse {
  unreadNotificationCount: number;
}

export interface MarkAllAsReadResponse {
  markAllNotificationsAsRead: {
    success: boolean;
    count: number;
    message: string;
  };
}

export interface DeleteNotificationResponse {
  deleteNotification: {
    success: boolean;
    message: string;
  };
}
