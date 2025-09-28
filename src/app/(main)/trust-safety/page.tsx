"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ShieldCheck, BarChart3, Lock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export default function TransparencyPage() {
  return (
    <div className="min-h-screen pt-32">
      {/* Hero */}
      <section className="text-center mb-12">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-5xl font-bold text-[#ad4e28] mb-4"
        >
          Minh bạch & An toàn
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className=" text-gray-600 max-w-2xl mx-auto"
        >
          Niềm tin của bạn là giá trị lớn nhất của chúng tôi. FoodFund cam kết
          đảm bảo mọi đóng góp luôn minh bạch và an toàn tuyệt đối.
        </motion.p>
      </section>

      {/* Cam kết an toàn */}
      <section className="container mx-auto px-6">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl font-bold text-[#ad4e28] mb-6"
        >
          Cam kết an toàn
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <ShieldCheck className="h-8 w-8 text-[#ad4e28]" />,
              title: "Minh bạch",
              desc: "Tất cả thông tin về chiến dịch, số tiền đóng góp và giải ngân đều công khai.",
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-[#ad4e28]" />,
              title: "Công bằng",
              desc: "Các chiến dịch đều trải qua quy trình xét duyệt để đảm bảo công bằng cho mọi người.",
            },
            {
              icon: <Lock className="h-8 w-8 text-[#ad4e28]" />,
              title: "An toàn",
              desc: "Hệ thống bảo mật nhiều lớp, bảo vệ dữ liệu cá nhân và giao dịch tài chính.",
            },
            {
              icon: <HelpCircle className="h-8 w-8 text-[#ad4e28]" />,
              title: "Trách nhiệm",
              desc: "Đội ngũ FoodFund luôn giám sát, xử lý khiếu nại và đảm bảo quyền lợi cộng đồng.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 min-h-60">
                <CardHeader>
                  {item.icon}
                  <CardTitle className="mt-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>{item.desc}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Separator */}
      <div className="border-t border-gray-200 my-12" />

      {/* Quy trình minh bạch */}
      <section className="container mx-auto px-6">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl font-bold text-[#ad4e28] mb-10"
        >
          Quy trình minh bạch của FoodFund
        </motion.h2>

        <ol className="relative border-l border-gray-300 space-y-10">
          {[
            {
              title: "Đăng ký chiến dịch",
              desc: "Người dùng điền thông tin, mục tiêu và minh chứng cho chiến dịch. Mọi dữ liệu ban đầu được lưu trữ an toàn.",
            },
            {
              title: "Xác minh & kiểm duyệt",
              desc: "Đội ngũ FoodFund kiểm tra giấy tờ, thông tin người khởi tạo và xác thực tính chính đáng của chiến dịch.",
            },
            {
              title: "Công khai & Gây quỹ",
              desc: "Chiến dịch được hiển thị trên nền tảng. Người ủng hộ có thể theo dõi tiến độ đóng góp theo thời gian thực.",
            },
            {
              title: "Giải ngân minh bạch",
              desc: "Sau khi đạt mốc gây quỹ, tiền được giải ngân có kiểm soát. Toàn bộ giao dịch được ghi nhận và công khai.",
            },
            {
              title: "Báo cáo & giám sát",
              desc: "Người khởi tạo phải nộp báo cáo, hình ảnh, hóa đơn. Cộng đồng và FoodFund đều có thể giám sát và phản hồi.",
            },
          ].map((step, i) => (
            <motion.li
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="ml-6"
            >
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-[#ad4e28] rounded-full text-white font-bold">
                {i + 1}
              </span>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Separator */}
      <div className="border-t border-gray-200 my-12" />

      {/* FAQ */}
      <section className="container mx-auto px-6">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl font-bold text-[#ad4e28] mb-6"
        >
          Câu hỏi thường gặp
        </motion.h2>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {/* Giữ nguyên danh sách FAQ bạn đã làm */}
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <HelpCircle className="h-4 w-4 mr-2" />
                Làm sao biết tiền của tôi đến đúng nơi?
              </AccordionTrigger>
              <AccordionContent>
                Mọi chiến dịch đều có báo cáo chi tiết và được giám sát chặt
                chẽ, bạn có thể theo dõi ngay trong hồ sơ chiến dịch.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <HelpCircle className="h-4 w-4 mr-2" />
                FoodFund có thu phí không?
              </AccordionTrigger>
              <AccordionContent>
                FoodFund thu <strong>5%</strong> phí nền tảng để duy trì vận
                hành và đảm bảo an toàn hệ thống.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <HelpCircle className="h-4 w-4 mr-2" />
                Tôi có thể khiếu nại thế nào?
              </AccordionTrigger>
              <AccordionContent>
                Bạn có thể gửi khiếu nại trực tiếp qua mục Liên hệ hoặc Trung
                tâm trợ giúp, đội ngũ FoodFund sẽ xử lý trong vòng 48h.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <HelpCircle className="h-4 w-4 mr-2" />
                Thông tin cá nhân của tôi có được bảo mật không?
              </AccordionTrigger>
              <AccordionContent>
                Có. Mọi dữ liệu cá nhân và giao dịch đều được mã hóa và tuân thủ
                các tiêu chuẩn bảo mật quốc tế (GDPR).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                <HelpCircle className="h-4 w-4 mr-2" />
                Tôi có thể hủy đóng góp và hoàn tiền không?
              </AccordionTrigger>
              <AccordionContent>
                Trong trường hợp chiến dịch chưa giải ngân, bạn có thể yêu cầu
                hoàn tiền. Sau khi giải ngân, FoodFund sẽ hỗ trợ xử lý theo quy
                định.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                <HelpCircle className="h-4 w-4 mr-2" />
                FoodFund chọn lọc chiến dịch như thế nào?
              </AccordionTrigger>
              <AccordionContent>
                Mọi chiến dịch đều trải qua quá trình kiểm duyệt gồm xác thực
                thông tin cá nhân, giấy tờ pháp lý và mục tiêu gây quỹ trước khi
                được công khai.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>
                <HelpCircle className="h-4 w-4 mr-2" />
                Nếu chiến dịch không đạt mục tiêu thì sao?
              </AccordionTrigger>
              <AccordionContent>
                Tiền vẫn sẽ được chuyển tới người thụ hưởng để hỗ trợ một phần,
                và toàn bộ tiến trình được công khai báo cáo đến cộng đồng.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </section>

      {/* Separator */}
      <div className="border-t border-gray-200 my-12" />

      {/* CTA */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center bg-[#fff5eb] py-12"
      >
        <h2 className="text-2xl font-bold text-[#ad4e28] mb-4">
          Tin tưởng và đồng hành cùng FoodFund
        </h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button className="btn-color">Khám phá các chiến dịch</Button>
        </motion.div>
      </motion.section>
    </div>
  );
}
