"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  description,
  itemName = "mục này",
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  const defaultDescription = `Bạn có chắc chắn muốn xóa ${itemName}? Hành động này không thể hoàn tác.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-red-600">
            <AlertTriangle className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Hủy bỏ
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}