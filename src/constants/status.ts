import {
  CheckCircle,
  CheckCircle2,
  Clock,
  PlayCircle,
  StopCircle,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";

export const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ duyệt",
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
  },
  APPROVED: {
    label: "Đã duyệt",
    variant: "default" as const,
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-800",
  },
  VERIFIED: {
    label: "Đã duyệt",
    variant: "default" as const,
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-800",
  },
  ACTIVE: {
    label: "Đang hoạt động",
    variant: "default" as const,
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
  },
  REJECTED: {
    label: "Từ chối",
    variant: "destructive" as const,
    icon: XCircle,
    color: "bg-red-100 text-red-800",
  },
  COMPLETED: {
    label: "Hoàn thành",
    variant: "outline" as const,
    icon: CheckCircle,
    color: "bg-gray-100 text-gray-800",
  },
  CANCELLED: {
    label: "Đã hủy",
    variant: "destructive" as const,
    icon: XCircle,
    color: "bg-red-100 text-red-800",
  },
} as const;

export const STATUS_ACTIONS = {
  PENDING: [
    {
      status: "APPROVED" as const,
      label: "Phê duyệt",
      icon: ThumbsUp,
      variant: "default" as const,
    },
    {
      status: "REJECTED" as const,
      label: "Từ chối",
      icon: ThumbsDown,
      variant: "destructive" as const,
    },
  ],
  APPROVED: [
    {
      status: "ACTIVE" as const,
      label: "Kích hoạt",
      icon: PlayCircle,
      variant: "default" as const,
    },
    {
      status: "REJECTED" as const,
      label: "Từ chối",
      icon: ThumbsDown,
      variant: "destructive" as const,
    },
  ],
  ACTIVE: [
    {
      status: "COMPLETED" as const,
      label: "Hoàn thành",
      icon: CheckCircle2,
      variant: "outline" as const,
    },
    {
      status: "CANCELLED" as const,
      label: "Hủy bỏ",
      icon: StopCircle,
      variant: "destructive" as const,
    },
  ],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
} as const;

export type StatusType = keyof typeof STATUS_CONFIG;
export type StatusActionType = keyof typeof STATUS_ACTIONS;