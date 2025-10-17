"use client";

import Image from "next/image";
import {
  MapPin,
  Target,
  Clock,
  Share2,
  Info,
  Navigation,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { motion } from "framer-motion";

interface ActionPanelProps {
  canEdit: boolean;
  onEdit: () => void;
  onDirection?: () => void;
  targetAmount?: number;
  raisedAmount?: number;
  daysLeft?: number | string;
  location?: string;
  goal?: string;
  onDonate?: () => void;
  organizationName?: string;
  organizationLogo?: string;
  onViewStatement?: () => void;
}

export function ActionPanel({
  canEdit,
  onEdit,
  onDirection,
  targetAmount = 0,
  raisedAmount = 0,
  daysLeft = 0,
  location,
  goal,
  onDonate,
  organizationName = "Tổ chức thiện nguyện",
  organizationLogo = "/images/avatar.webp",
  onViewStatement,
}: ActionPanelProps) {
  const progress =
    targetAmount > 0 ? Math.min((raisedAmount / targetAmount) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-color-base rounded-2xl shadow-sm border p-5 md:p-6 space-y-4"
    >
      <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
        <Image
          src={organizationLogo}
          alt={organizationName}
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12 border"
        />
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-0.5">
            Tiền ủng hộ được chuyển đến
          </p>
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-[#E77731] truncate">
              {organizationName}
            </p>
            <CheckCircle className="w-4 h-4 text-[#E77731] shrink-0" />
          </div>
          <button
            onClick={onViewStatement}
            className="mt-1 text-xs text-[#E77731] font-medium hover:underline"
          >
            Xem sao kê tài khoản →
          </button>
        </div>
      </div>

      {/* ====== Campaign Info ====== */}
      <div className="flex items-center gap-3">
        <Info className="w-5 h-5 text-gray-800" />
        <h3 className="font-semibold text-lg text-gray-800">
          Thông tin chiến dịch
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#E77731]" />
          <div>
            <p className="text-xs text-gray-500">Mục tiêu chiến dịch</p>
            <p className="text-sm font-semibold text-gray-900">{goal}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">Thời gian còn lại</p>
            <p className="text-sm font-semibold text-gray-900">{daysLeft}</p>
          </div>
        </div>
      </div>

      {location && (
        <div className="flex items-start gap-2 mt-4 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <p>{location}</p>
        </div>
      )}

      {/* ====== Progress ====== */}
      <div className="mt-4">
        <Progress
          value={progress}
          className="h-2 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-[#E77731] [&>div]:to-[#ad4e28]"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Đã đạt được</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <p className="text-base font-semibold text-[#E77731] mt-2">
          {formatCurrency(raisedAmount)}{" "}
          <span className="text-gray-500 font-normal text-sm">
            / {formatCurrency(targetAmount)}
          </span>
        </p>
      </div>

      {/* ====== Buttons ====== */}
      <div className="mt-5 flex flex-col gap-3">
        {canEdit && (
          <Button onClick={onEdit} className="btn-color font-medium flex-1">
            Chỉnh sửa chiến dịch
          </Button>
        )}

        {onDonate && (
          <Button
            onClick={onDonate}
            className="flex-1 bg-gradient-to-r from-[#E77731] to-[#ad4e28] text-white font-semibold hover:opacity-90 transition-all"
          >
            Ủng hộ
          </Button>
        )}

        {onDirection && (
          <Button
            variant="outline"
            onClick={onDirection}
            className="col-span-2 flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Navigation className="w-4 h-4" />
            Chỉ đường
          </Button>
        )}
      </div>

      {/* ====== Share ====== */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#E77731] font-medium cursor-pointer hover:underline">
        <Share2 className="w-3 h-3" />
        <span>Chia sẻ chiến dịch để lan tỏa yêu thương</span>
      </div>
    </motion.div>
  );
}
