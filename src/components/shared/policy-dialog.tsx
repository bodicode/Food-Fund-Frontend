"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@/components/animate-ui/icons/x";
import Link from "next/link";

interface LenisLike {
  pause: () => void;
  resume: () => void;
}

interface PolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lenisRef?: React.MutableRefObject<LenisLike | null>;
}

export default function PolicyDialog({
  open,
  onOpenChange,
  lenisRef,
}: PolicyDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!lenisRef?.current) return;
    if (open) lenisRef.current.pause();
    else lenisRef.current.resume();
  }, [open, lenisRef]);

  const handleWheel = (e: React.WheelEvent) => e.stopPropagation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 bg-black/40 z-50 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2
                       bg-white rounded-xl shadow-lg flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Chính sách bảo mật</h2>
                <p className="text-gray-600 text-sm">
                  Cách FoodFund bảo vệ thông tin cá nhân và dữ liệu của bạn
                </p>
              </div>
              <button className="p-2" onClick={() => onOpenChange(false)}>
                <X animate animateOnHover animateOnView className="w-5 h-5" />
              </button>
            </div>

            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700"
              onWheel={handleWheel}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <p>
                FoodFund cam kết tuân thủ các tiêu chuẩn bảo mật dữ liệu hiện
                hành (bao gồm GDPR). Chúng tôi coi việc bảo vệ dữ liệu cá nhân
                của bạn là ưu tiên hàng đầu.
              </p>

              {[
                {
                  title: "1. Thu thập và sử dụng thông tin",
                  items: [
                    "Chỉ thu thập thông tin cần thiết để cung cấp dịch vụ.",
                    "Không chia sẻ thông tin cá nhân với bên thứ ba nếu không có sự đồng ý của bạn.",
                    "Dữ liệu được mã hóa và lưu trữ an toàn trên máy chủ.",
                  ],
                },
                {
                  title: "2. Quyền của người dùng",
                  items: [
                    "Xem và cập nhật dữ liệu cá nhân trong hồ sơ của bạn.",
                    "Yêu cầu xuất toàn bộ dữ liệu cá nhân mà FoodFund đang lưu giữ.",
                    "Xóa tài khoản và toàn bộ dữ liệu bất kỳ lúc nào.",
                  ],
                },
                {
                  title: "3. Bảo mật đăng nhập",
                  items: [
                    "Sử dụng mật khẩu mạnh và thay đổi định kỳ.",
                    "Tránh chia sẻ thông tin đăng nhập và sử dụng thiết bị công cộng để truy cập.",
                    "Hệ thống có cơ chế cảnh báo khi phát hiện truy cập bất thường.",
                  ],
                },
              ].map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold">{section.title}</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <h3 className="font-semibold">4. Liên hệ hỗ trợ</h3>
              <p>
                Nếu có thắc mắc về việc bảo mật dữ liệu, vui lòng liên hệ đội
                ngũ hỗ trợ qua trang{" "}
                <Link
                  href="/help/contact"
                  className="text-color underline hover:text-green-700"
                >
                  Liên hệ
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
