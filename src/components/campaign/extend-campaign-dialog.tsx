"use client";

import { useState } from "react";
import { Calendar, AlertCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "../animate-ui/icons/loader";
import { formatDate } from "@/lib/utils/date-utils";

interface ExtendCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (days: number) => Promise<void>;
  currentEndDate: string;
}

const EXTENSION_OPTIONS = [
  { label: "7 ngày", days: 7 },
  { label: "14 ngày", days: 14 },
  { label: "1 tháng", days: 30 },
  { label: "2 tháng", days: 60 },
];

export function ExtendCampaignDialog({
  isOpen,
  onClose,
  onConfirm,
  currentEndDate,
}: ExtendCampaignDialogProps) {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const calculateNewDate = (days: number) => {
    const current = new Date(currentEndDate);
    const newDate = new Date(current.getTime() + days * 24 * 60 * 60 * 1000);
    return newDate;
  };

  const handleSelectDays = (days: number) => {
    setSelectedDays(days);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!selectedDays) return;

    setIsExtending(true);
    try {
      await onConfirm(selectedDays);
      onClose();
      setSelectedDays(null);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error extending campaign:", error);
    } finally {
      setIsExtending(false);
    }
  };

  const newEndDate = selectedDays ? calculateNewDate(selectedDays) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <DialogTitle className="text-xl">
                  Kéo dài thời gian gây quỹ
                </DialogTitle>
              </div>
              <DialogDescription className="text-base pt-2">
                Chọn thời gian bạn muốn kéo dài chiến dịch gây quỹ
              </DialogDescription>
            </DialogHeader>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Ngày kết thúc hiện tại:
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {formatDate(currentEndDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chọn thời gian kéo dài:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {EXTENSION_OPTIONS.map((option) => (
                  <button
                    key={option.days}
                    onClick={() => handleSelectDays(option.days)}
                    className={`p-4 rounded-lg border-2 transition-all text-center font-medium ${
                      selectedDays === option.days
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600"
                    }`}
                  >
                    <div className="text-lg">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={() => handleSelectDays(selectedDays || 7)}
                disabled={!selectedDays}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Tiếp tục
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <DialogTitle className="text-xl">
                  Xác nhận kéo dài chiến dịch
                </DialogTitle>
              </div>
              <DialogDescription className="text-base pt-2">
                Vui lòng xem xét các thay đổi trước khi xác nhận
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ngày kết thúc hiện tại:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatDate(currentEndDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ngày kết thúc mới:
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {newEndDate && formatDate(newEndDate.toISOString())}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-300 mb-3">
                  ⚠️ Lưu ý quan trọng:
                </p>
                <ul className="text-sm text-amber-800 dark:text-amber-400 space-y-2 list-disc list-inside">
                  <li>
                    Thời gian gây quỹ sẽ được kéo dài thêm{" "}
                    <span className="font-semibold">{selectedDays} ngày</span>
                  </li>
                  <li>
                    Các giai đoạn thực hiện (mua nguyên liệu, nấu ăn, giao hàng)
                    sẽ được kéo dài tương ứng
                  </li>
                  <li>
                    Các nhà hảo tâm sẽ được thông báo về thay đổi này
                  </li>
                  <li>
                    Hành động này không thể hoàn tác
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedDays(null);
                }}
                disabled={isExtending}
                className="flex-1"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isExtending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isExtending ? (
                  <>
                    <Loader className="mr-2 w-4 h-4" animate animateOnView />
                    Đang kéo dài...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Xác nhận kéo dài
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
