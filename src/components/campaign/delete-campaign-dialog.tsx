"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
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

interface DeleteCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  campaignTitle: string;
}

export function DeleteCampaignDialog({
  isOpen,
  onClose,
  onConfirm,
  campaignTitle,
}: DeleteCampaignDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting campaign:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl">Xóa chiến dịch</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            Bạn có chắc chắn muốn xóa chiến dịch{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              &quot;{campaignTitle}&quot;
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-2">
            ⚠️ Cảnh báo:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-400 space-y-1 list-disc list-inside">
            <li>Hành động này không thể hoàn tác</li>
            <li>Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn</li>
            <li>Các nhà hảo tâm sẽ không thể truy cập chiến dịch này nữa</li>
          </ul>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader className="mr-2 w-4 h-4" animate animateOnView />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Xác nhận xóa
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
