"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LockIcon } from "@/components/animate-ui/icons/lock";
import { Binary } from "@/components/animate-ui/icons/binary";
import { UsersRound } from "@/components/animate-ui/icons/users-round";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PolicyDialog from "@/components/shared/policy-dialog";
import { Lightbulb } from "@/components/animate-ui/icons/lightbulb";
import { MessageCircleWarning } from "@/components/animate-ui/icons/message-circle-warning";
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check";

const cards = [
  {
    icon: (
      <LockIcon
        animate
        animateOnView
        loop
        className="h-8 w-8 mx-auto text-color"
      />
    ),
    title: "Đổi mật khẩu",
    desc: "Các bước để thay đổi mật khẩu nhanh chóng và an toàn.",
    detail: (
      <div className="space-y-6 text-gray-700">
        <p>
          Việc thay đổi mật khẩu định kỳ sẽ giúp bảo vệ tài khoản khỏi rủi ro
          truy cập trái phép. Hãy sử dụng mật khẩu mạnh gồm chữ hoa, chữ thường,
          số và ký tự đặc biệt.
        </p>

        <div>
          <h4 className="font-semibold mb-2">Các bước thực hiện</h4>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Đi tới mục <b>Cài đặt → Bảo mật</b> trong ứng dụng.
            </li>
            <li>Nhập mật khẩu hiện tại để xác minh.</li>
            <li>Tạo mật khẩu mới (tối thiểu 8 ký tự, khuyến nghị 12+).</li>
            <li>Nhập lại mật khẩu mới để xác nhận.</li>
            <li>
              Nhấn <b>Lưu thay đổi</b> để hoàn tất.
            </li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <Lightbulb
              className="w-4 h-4 mr-1 inline-block text-yellow-500"
              animate
              animateOnView
              loop
            />
            Mẹo: Tránh dùng lại mật khẩu cũ hoặc mật khẩu dễ đoán (ngày sinh, số
            điện thoại). Hãy cân nhắc sử dụng trình quản lý mật khẩu.
          </p>
        </div>

        <p className="text-sm">
          Xem thêm tại{" "}
          <Link href="/help/security" className="text-color underline">
            Trung tâm bảo mật FoodFund
          </Link>
        </p>
      </div>
    ),
  },
  {
    icon: (
      <Binary
        animate
        animateOnView
        loop
        className="h-8 w-8 mx-auto text-color"
      />
    ),
    title: "Khôi phục tài khoản",
    desc: "Xử lý khi quên mật khẩu, mất quyền truy cập hoặc không nhận email xác thực.",
    detail: (
      <div className="space-y-6 text-gray-700">
        <p>
          Nếu bạn không thể đăng nhập vào tài khoản, hãy thử các bước dưới đây
          để khôi phục quyền truy cập nhanh chóng.
        </p>

        <div>
          <h4 className="font-semibold mb-2">Các bước thực hiện</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Sử dụng tính năng <b>Quên mật khẩu</b> tại trang đăng nhập.
            </li>
            <li>Xác thực lại email đăng ký để mở khóa tài khoản.</li>
            <li>
              Nếu không nhận được email, hãy kiểm tra thư mục <b>Spam</b> hoặc
              liên hệ hỗ trợ.
            </li>
            <li>
              Trong trường hợp mất cả email lẫn số điện thoại, liên hệ trực tiếp
              đội ngũ hỗ trợ FoodFund.
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <MessageCircleWarning
              className="w-4 h-4 mr-1 inline-block text-yellow-500"
              animate
              animateOnView
              loop
            />{" "}
            Lưu ý: Hãy luôn giữ thông tin liên hệ (email, số điện thoại) được
            cập nhật để đảm bảo có thể khôi phục tài khoản bất cứ lúc nào.
          </p>
        </div>

        <p className="text-sm">
          Tham khảo thêm tại{" "}
          <Link href="/help/recovery" className="text-color underline">
            Hướng dẫn khôi phục tài khoản
          </Link>
        </p>
      </div>
    ),
  },
  {
    icon: (
      <UsersRound
        animate
        animateOnView
        loop
        className="h-8 w-8 mx-auto text-color"
      />
    ),
    title: "Quản lý thông tin cá nhân",
    desc: "Cập nhật tên, email và dữ liệu cá nhân của bạn.",
    detail: (
      <div className="space-y-6 text-gray-700">
        <p>
          Bạn có thể chỉnh sửa hồ sơ cá nhân để giữ cho thông tin liên hệ và dữ
          liệu của mình luôn chính xác. Điều này giúp chúng tôi hỗ trợ bạn nhanh
          hơn và đảm bảo tính bảo mật.
        </p>

        <div>
          <h4 className="font-semibold mb-2">Các bước thực hiện</h4>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Đi tới mục <b>Hồ sơ cá nhân</b> trong Cài đặt.
            </li>
            <li>
              Cập nhật các trường thông tin mong muốn (tên, email, số điện
              thoại).
            </li>
            <li>Kiểm tra kỹ dữ liệu trước khi lưu thay đổi.</li>
            <li>
              Nhấn <b>Lưu</b> để áp dụng ngay lập tức.
            </li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-sm text-green-800">
            <BadgeCheck
              className="w-4 h-4 mr-1 inline-block text-green-500"
              animate
              animateOnView
              loop
            />{" "}
            Mẹo: Đảm bảo email và số điện thoại bạn nhập là thông tin đang sử
            dụng thực tế, để không bỏ lỡ thông báo quan trọng.
          </p>
        </div>

        <p className="text-sm">
          Xem chi tiết tại{" "}
          <Link href="/help/profile" className="text-color underline">
            Hướng dẫn quản lý hồ sơ cá nhân
          </Link>
        </p>
      </div>
    ),
  },
];

export default function AccountPage() {
  const [policyOpen, setPolicyOpen] = useState(false);

  return (
    <div className="w-full min-h-screen">
      <motion.div
        className="bg-color-base text-color pt-32 pb-20 px-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-4">Tài khoản & Bảo mật</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Hướng dẫn chi tiết về quản lý tài khoản, bảo mật đăng nhập và quyền
          riêng tư để đảm bảo an toàn dữ liệu của bạn.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Card className="hover:shadow-md transition h-64 cursor-pointer">
                  <CardContent className="p-6 text-center space-y-3">
                    {item.icon}
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                    <span className="text-color font-medium nav-hover-btn">
                      Xem chi tiết
                    </span>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{item.title}</DialogTitle>
                  <DialogDescription>{item.desc}</DialogDescription>
                </DialogHeader>
                <div className="mt-4">{item.detail}</div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto py-10 px-6 space-y-8 ">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="account">
            <AccordionTrigger>Quản lý tài khoản</AccordionTrigger>
            <AnimatePresence>
              <AccordionContent asChild>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>Đăng ký và kích hoạt tài khoản FoodFund</li>
                    <li>Cập nhật thông tin cá nhân trong mục “Cài đặt”</li>
                    <li>Xóa hoặc tạm khóa tài khoản khi không sử dụng</li>
                  </ol>

                  <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg mt-4 flex items-start space-x-3">
                    <ShieldCheck className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Luôn đảm bảo thông tin tài khoản (email, số điện thoại)
                      được cập nhật để nhận thông báo quan trọng và tránh mất
                      quyền truy cập.
                    </p>
                  </div>
                </motion.div>
              </AccordionContent>
            </AnimatePresence>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger>Khôi phục & Bảo mật đăng nhập</AccordionTrigger>
            <AnimatePresence>
              <AccordionContent asChild>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Hướng dẫn đặt lại mật khẩu khi quên</li>
                    <li>Xác thực email khi đăng ký hoặc đổi thông tin</li>
                    <li>Xử lý khi không nhận được email xác thực</li>
                    <li>Khuyến nghị bảo mật khi sử dụng thiết bị công cộng</li>
                  </ul>
                  <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg mt-4 flex items-start space-x-3">
                    <ShieldCheck className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Để bảo vệ tài khoản, hãy sử dụng mật khẩu mạnh và thay đổi
                      định kỳ. Tránh chia sẻ thông tin đăng nhập với người khác.
                    </p>
                  </div>
                </motion.div>
              </AccordionContent>
            </AnimatePresence>
          </AccordionItem>

          <AccordionItem value="privacy" id="privacy">
            <AccordionTrigger>
              Quyền riêng tư & Dữ liệu cá nhân
            </AccordionTrigger>
            <AnimatePresence>
              <AccordionContent asChild>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-3 text-gray-700">
                    FoodFund cam kết bảo mật dữ liệu theo chuẩn GDPR. Bạn có
                    thể:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      Xem{" "}
                      <Button
                        onClick={() => setPolicyOpen(true)}
                        className="bg-transparent hover:bg-transparent border-none p-0 text-color nav-hover-btn"
                      >
                        chính sách bảo mật dữ liệu
                      </Button>
                    </li>
                    <li>Quản lý dữ liệu cá nhân trong hồ sơ</li>
                    <li>Yêu cầu xuất hoặc xóa toàn bộ dữ liệu</li>
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg mt-4 flex items-start space-x-3">
                    <ShieldCheck className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Không chia sẻ thông tin đăng nhập với người khác và thường
                      xuyên kiểm tra các quyền truy cập ứng dụng bên thứ ba để
                      bảo vệ dữ liệu cá nhân.
                    </p>
                  </div>
                </motion.div>
              </AccordionContent>
            </AnimatePresence>
          </AccordionItem>

          <PolicyDialog open={policyOpen} onOpenChange={setPolicyOpen} />
        </Accordion>
      </div>

      <motion.div
        className="text-center py-12 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-4 text-gray-700">Bạn vẫn cần thêm sự hỗ trợ?</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/help/contact"
            className="px-6 py-3 btn-color text-white rounded-lg hover:bg-green-700 transition"
          >
            Liên hệ đội ngũ FoodFund
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
