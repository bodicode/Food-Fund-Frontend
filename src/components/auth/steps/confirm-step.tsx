"use client";

import { CheckCircle2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "../../ui/button";
import { motion } from "framer-motion";

type ConfirmStepProps = {
  email: string;
  onSuccess?: () => void;
};

export function ConfirmStep({ email, onSuccess }: ConfirmStepProps) {
  return (
    <div className="text-center space-y-12 py-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#ad4e28]/10 blur-3xl rounded-full" />
          <Mail className="w-24 h-24 text-[#ad4e28] relative" />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-black text-[#ad4e28] tracking-tight uppercase">
            Kiểm tra hộp thư của bạn
          </h3>
          <p className="text-gray-500 text-sm font-medium max-w-lg leading-relaxed">
            Chúng tôi đã gửi một liên kết kích hoạt tới địa chỉ email:
            <br />
            <span className="font-black text-[#ad4e28] block mt-2 text-base truncate px-4">
              {email}
            </span>
          </p>
          <p className="text-gray-400 text-xs">
            Vui lòng nhấp vào liên kết trong email để hoàn tất quá trình kích hoạt tài khoản.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-8 pt-6">
        <div className="flex items-center gap-3 text-green-600 bg-green-50 px-6 py-3 rounded-full border border-green-100">
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-bold uppercase tracking-wider text-sm">
            Email đã được gửi thành công
          </span>
        </div>

        <motion.div
          whileHover={{ x: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            variant="ghost"
            onClick={onSuccess}
            className="text-[#ad4e28] hover:text-[#8f4021] hover:bg-transparent font-black gap-2 text-base underline underline-offset-8 decoration-2"
          >
            <ArrowLeft className="w-5 h-5" />
            QUAY LẠI ĐĂNG NHẬP
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
