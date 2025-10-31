"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, X } from "lucide-react";

interface LoginRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionText?: string;
}

export function LoginRequiredDialog({
  isOpen,
  onClose,
  title = "Yêu cầu đăng nhập",
  description = "Bạn cần đăng nhập để thực hiện hành động này. Vui lòng đăng nhập để tiếp tục.",
  actionText = "Đăng nhập ngay"
}: LoginRequiredDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <LogIn className="w-5 h-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button onClick={handleLogin} className="w-full btn-color">
            <LogIn className="w-4 h-4 mr-2" />
            {actionText}
          </Button>
          
          <Button variant="outline" onClick={onClose} className="w-full">
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}