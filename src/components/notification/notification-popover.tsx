"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Bell, Trash2, CheckCheck, Loader } from "lucide-react";
import { notificationService } from "../../services/notification.service";
import { Notification } from "../../types/api/notification";
import { toast } from "sonner";
import { formatDate } from "../../lib/utils/date-utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function NotificationPopover() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Initial load
  useEffect(() => {
    if (user && isOpen) {
      loadNotifications(true);
    }
  }, [isOpen, user]);

  const loadNotifications = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const currentCursor = isInitial ? undefined : (cursor || undefined);
      const data = await notificationService.getMyNotifications(20, currentCursor);

      if (isInitial) {
        setNotifications(data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }

      setHasMore(data.hasMore);
      setCursor(data.nextCursor);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông báo");
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Only load notifications if user is logged in
    if (!user) return;

    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllAsRead = async (silent = false) => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      if (!silent) toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch {
      if (!silent) toast.error("Lỗi khi đánh dấu");
    }
  };

  const onOpenChange = (open: boolean) => {
    if (open && unreadCount > 0) {
      handleMarkAllAsRead(true);
    }
    setIsOpen(open);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
      toast.success("Đã xóa thông báo");
    } catch {
      toast.error("Lỗi khi xóa thông báo");
    }
  };

  // Don't render if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-96 p-0 max-h-[600px] overflow-hidden flex flex-col"
        align="end"
        onWheel={(e: React.WheelEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Thông báo</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAllAsRead(false)}
                className="text-xs text-blue-600 hover:text-blue-700 h-auto p-1"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Đánh dấu tất cả
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
          {loading ? (
            <div className="flex items-center justify-center h-full py-8">
              <Loader className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm py-8">
              Không có thông báo
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${!notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {typeof notification.data === "object" && notification.data?.message
                          ? notification.data.message
                          : typeof notification.data === "string"
                            ? notification.data
                            : JSON.stringify(notification.data)}
                      </p>
                      {typeof notification.data === "object" && notification.data?.postTitle && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Bài viết: {notification.data.postTitle}
                        </p>
                      )}
                      {typeof notification.data === "object" && notification.data?.likeCount && (
                        <p className="text-xs text-gray-500 mt-1">
                          👍 {notification.data.likeCount} lượt thích
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteNotification(notification.id)
                      }
                      className="text-gray-400 hover:text-red-600 flex-shrink-0 h-auto p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasMore && (
          <div className="px-4 py-2 border-t text-center flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadNotifications(false)}
              disabled={loadingMore}
              className="text-xs text-gray-600 hover:text-gray-900 h-auto p-1 w-full"
            >
              {loadingMore ? (
                <>
                  <Loader className="w-3 h-3 mr-2 animate-spin" />
                  Đang tải...
                </>
              ) : (
                "Xem tất cả thông báo"
              )}
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
