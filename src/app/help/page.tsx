"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Search,
  BarChart3,
  ShieldCheck,
  HeartHandshake,
  Headphones,
  HelpCircle,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";

const helpItems = [
  {
    icon: ShieldCheck,
    title: "Tài khoản & Bảo mật",
    desc: "Hướng dẫn tạo tài khoản, quản lý thông tin cá nhân, đổi mật khẩu và các biện pháp bảo mật dữ liệu.",
    href: "/help/account",
  },
  {
    icon: HeartHandshake,
    title: "Quyên góp & Thanh toán",
    desc: "Thông tin về các phương thức thanh toán, quy trình quyên góp và hỗ trợ khi phát sinh sự cố giao dịch.",
    href: "/help/donation-payment",
  },
  {
    icon: BarChart3,
    title: "Theo dõi chiến dịch",
    desc: "Cách thức tra cứu tiến độ, báo cáo minh bạch và kết quả của các chiến dịch mà Quý vị tham gia hỗ trợ.",
    href: "/help/campaign-tracking",
  },
  {
    icon: UtensilsCrossed,
    title: "Bếp & Vận chuyển",
    desc: "Hướng dẫn quy trình chuẩn bị suất ăn, phối hợp với tình nguyện viên và thông tin về việc vận chuyển thực phẩm.",
    href: "/help/kitchen-delivery",
  },
  {
    icon: Headphones,
    title: "Liên hệ & Hỗ trợ trực tiếp",
    desc: "Kênh tiếp nhận yêu cầu hỗ trợ, giải đáp thắc mắc và xử lý sự cố khẩn cấp.",
    href: "/help",
  },
  {
    icon: HelpCircle,
    title: "Câu hỏi thường gặp (FAQ)",
    desc: "Tổng hợp các câu hỏi và giải đáp liên quan đến quy trình quyên góp, hoàn tiền, và bảo mật thông tin.",
    href: "/help/faq",
  },
];

export default function HelpCenter() {
  return (
    <div className="w-full min-h-screen">
      <div className="bg-color-base text-color pt-32 pb-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Trung tâm hỗ trợ FoodFund</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Chúng tôi luôn sẵn sàng đồng hành cùng Quý vị – từ việc quyên góp,
          chuẩn bị bữa ăn đến vận chuyển và quản lý quỹ.
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Bạn cần hỗ trợ điều gì hôm nay?"
            className="pl-10 pr-4 py-3 rounded-xl"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {helpItems.map((help, i) => {
          const Icon = help.icon;
          return (
            <motion.div
              key={help.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={help.href}>
                <Card className="p-6 hover:shadow-lg transition rounded-xl min-h-60 cursor-pointer">
                  <CardContent className="flex flex-col items-center text-center space-y-4">
                    <Icon className="h-10 w-10 text-color" />
                    <h3 className="font-semibold text-lg">{help.title}</h3>
                    <p className="text-sm text-gray-600">{help.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
