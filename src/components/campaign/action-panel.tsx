"use client";

import {
  MapPin,
  Target,
  Clock,
  Share2,
  Info,
  Navigation,
  CheckCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createCampaignSlug } from "@/lib/utils/slug-utils";
import { useState } from "react";
import { DonationTermsDialog } from "./donation-terms-dialog";

interface ActionPanelProps {
  campaignId?: string;
  campaignTitle?: string;
  campaignStatus?:
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "PROCESSING";
  canEdit: boolean;
  onEdit: () => void;
  onDirection?: () => void;
  targetAmount?: number;
  raisedAmount?: number;
  campaignFundingProgress?: number;
  daysLeft?: number | string;
  location?: string;
  goal?: string;
  onDonate?: () => void;
  organizationName?: string;

  onViewStatement?: () => void;
  fundraisingEndDate?: string;
  reason?: string;
}

export function ActionPanel({
  campaignId,
  campaignTitle,
  campaignStatus,
  canEdit,
  onEdit,
  onDirection,
  targetAmount = 0,
  raisedAmount = 0,
  campaignFundingProgress,
  daysLeft = 0,
  location,
  goal,
  onDonate,
  organizationName = "Tổ chức",

  onViewStatement,
  fundraisingEndDate,
  reason,
}: ActionPanelProps) {
  const router = useRouter();
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const progress = campaignFundingProgress ?? 0;

  const isCampaignEnded = fundraisingEndDate && new Date(fundraisingEndDate) <= new Date();
  const isFundingComplete = progress >= 100;
  const isDonationEnabled = campaignStatus === "ACTIVE" && !isCampaignEnded && !isFundingComplete;

  const getDonationButtonText = () => {
    // Handle PROCESSING status
    if (campaignStatus === "PROCESSING") {
      return "Đang trong quá trình vận hành";
    }

    if (campaignStatus === "CANCELLED") {
      return "Chiến dịch đã bị hủy";
    }

    if (isFundingComplete) {
      return "Đã đạt mục tiêu gây quỹ";
    }

    if (isCampaignEnded) {
      return "Đã kết thúc gây quỹ";
    }

    return isDonationEnabled ? "Ủng hộ" : "Chiến dịch chưa đến ngày";
  };


  const handleDonateClick = () => {
    if (!isDonationEnabled) return;
    setIsTermsDialogOpen(true);
  };

  const handleConfirmDonate = () => {
    setIsTermsDialogOpen(false);
    if (onDonate) {
      onDonate();
    } else if (campaignId) {
      const slug = campaignTitle ? createCampaignSlug(campaignTitle, campaignId) : campaignId;
      router.push(`/donation/${slug}`);
    }
  };

  const handleViewStatement = () => {
    if (onViewStatement) {
      onViewStatement();
    } else if (campaignId) {
      const slug = campaignTitle ? createCampaignSlug(campaignTitle, campaignId) : campaignId;
      router.push(`/campaign/${slug}/statement`);
    }
  };

  const handleOrganizationClick = () => {
    if (organizationName) {
      const slug = organizationName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      router.push(`/organizations/${slug}`);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-color-base rounded-2xl shadow-sm border p-5 md:p-6 space-y-4"
      >
        <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 shrink-0">
            <Building2 className="w-6 h-6 text-[#E77731]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">
              Tổ chức / Người đại diện
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={handleOrganizationClick}
                className="text-sm font-semibold text-[#E77731] truncate hover:underline"
              >
                {organizationName}
              </button>
              <CheckCircle className="w-4 h-4 text-[#E77731] shrink-0" />
            </div>
            <button
              onClick={handleViewStatement}
              className="mt-1 text-xs text-[#E77731] font-medium hover:underline"
            >
              Xem sao kê tài khoản →
            </button>
          </div>
        </div>

        {/* ====== Reason Alert ====== */}
        {(campaignStatus === "CANCELLED" || campaignStatus === "REJECTED") && reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">
                {campaignStatus === "CANCELLED" ? "Lý do hủy chiến dịch" : "Lý do từ chối"}
              </p>
              <p className="text-sm text-red-700 leading-relaxed">
                {reason}
                {campaignStatus === "CANCELLED" && (
                  <span className="block mt-1 font-medium">
                    (Chờ tổ chức khác đảm nhiệm)
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

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
          <div className="flex justify-between text-xs text-gray-700 mt-2">
            <span className="font-medium">Đã đạt được</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
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

          {(onDonate || campaignId) && (
            <Button
              onClick={handleDonateClick}
              disabled={!isDonationEnabled}
              className={`flex-1 font-semibold transition-all ${isDonationEnabled
                ? "bg-gradient-to-r from-[#E77731] to-[#ad4e28] text-white hover:opacity-90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {getDonationButtonText()}
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

      <DonationTermsDialog
        isOpen={isTermsDialogOpen}
        onClose={() => setIsTermsDialogOpen(false)}
        onConfirm={handleConfirmDonate}
      />
    </>
  );
}
