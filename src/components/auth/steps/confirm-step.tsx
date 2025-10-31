"use client";

import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmStepProps = {
  email: string;
  onSuccess?: () => void;
};

export function ConfirmStep({ email, onSuccess }: ConfirmStepProps) {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="flex flex-col items-center space-y-3">
        <Mail className="w-12 h-12 text-[#ad4e28]" />
        <h3 className="text-lg font-semibold text-[#ad4e28]">
          Xác thực tài khoản của bạn
        </h3>
        <p className="text-gray-600 text-sm max-w-sm">
          Chúng tôi đã gửi email kích hoạt tới{" "}
          <span className="font-semibold text-[#ad4e28]">{email}</span>.
          <br />
          Vui lòng mở email và nhấp vào liên kết “Kích hoạt tài khoản” để hoàn tất đăng ký.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
        <p className="text-sm text-gray-500">
          Sau khi xác thực, bạn có thể đăng nhập vào tài khoản của mình.
        </p>
        <Button
          variant="outline"
          onClick={onSuccess}
          className="text-[#ad4e28] border-[#ad4e28] hover:bg-[#ad4e28] hover:text-white"
        >
          Quay lại đăng nhập
        </Button>
      </div>
    </div>
  );
}
