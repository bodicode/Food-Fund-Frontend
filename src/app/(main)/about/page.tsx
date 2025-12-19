"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { ShieldCheck, Users, Leaf, Quote, Sparkles, CheckCircle2 } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const founders = [
  {
    name: "Trương Minh Phước",
    role: "CEO",
    img: "/images/avatar.webp",
  },
  {
    name: "Huỳnh Đình Luyện",
    role: "CTO",
    img: "/images/avatar.webp",
  },
  {
    name: "Huỳnh Lê Nhật Hoàng",
    role: "COO",
    img: "/images/avatar.webp",
  },
  {
    name: "Phan Cảnh Bảo Duy",
    role: "CMO",
    img: "/images/avatar.webp",
  },
];

const values = [
  {
    title: "Minh bạch",
    desc: "Mọi khoản quyên góp đều được công khai. Chúng tôi cam kết 100% số tiền được sử dụng đúng mục đích.",
    icon: <ShieldCheck className="w-8 h-8 text-pink-500" />,
    color: "bg-pink-50",
  },
  {
    title: "Tiếp cận công bằng",
    desc: "Bất kỳ ai cũng có thể nhận hỗ trợ hoặc đóng góp, không phân biệt hoàn cảnh, địa vị.",
    icon: <Users className="w-8 h-8 text-yellow-500" />,
    color: "bg-yellow-50",
  },
  {
    title: "Đơn giản",
    desc: "Quy trình gây quỹ và theo dõi được thiết kế trực quan, dễ hiểu, ai cũng có thể tham gia.",
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
    color: "bg-emerald-50",
  },
  {
    title: "Bền vững",
    desc: "Không chỉ bữa ăn trước mắt, mà còn tạo động lực phát triển lâu dài cho cộng đồng.",
    icon: <Leaf className="w-8 h-8 text-sky-500" />,
    color: "bg-sky-50",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-background font-sans">
      {/* Hero Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="relative pt-32 pb-24 px-6 text-center bg-color-base"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-medium text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Chia sẻ yêu thương, lan tỏa hy vọng</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
            Tại sao vẫn còn nhiều người <br className="hidden md:block" />
            <span className="text-color relative inline-block">
              không đủ bữa ăn?
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            FoodFund giúp kết nối cộng đồng để gây quỹ, chuẩn bị và phân phát bữa an đến những người đang gặp khó khăn. Một hành động nhỏ, một ý nghĩa lớn.
          </p>
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Trải nghiệm từ thực tế</h2>
              <div className="h-1.5 w-24 bg-color rounded-full"></div>
            </div>

            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                Khi dịch bệnh và thiên tai xảy ra, chúng tôi chứng kiến nhiều gia đình,
                trẻ em và người lao động mất đi nguồn thu nhập và không có đủ lương thực.
                Nhiều người chỉ cần một bữa cơm nóng để có thêm nghị lực vượt qua khó khăn.
              </p>
              <p>
                Chúng tôi nhận ra rằng, có rất nhiều tấm lòng sẵn sàng giúp đỡ,
                nhưng lại thiếu một nền tảng minh bạch để quyên góp.
                Chính vì vậy, <strong>FoodFund</strong> được ra đời.
              </p>
            </div>

            <div className="p-6 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl relative">
              <Quote className="absolute top-4 left-4 w-8 h-8 text-orange-300 opacity-50" />
              <p className="italic text-gray-800 font-medium pl-8 relative z-10">
                &quot;Với FoodFund, mỗi đóng góp nhỏ đều có thể biến thành một bữa cơm ấm áp,
                mang đến niềm hy vọng và sự sẻ chia cho cộng đồng.&quot;
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full relative px-4"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-amber-50 rounded-2xl transform rotate-3 scale-105 opacity-60 blur-xl"></div>
            <div className="relative bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800">Đội ngũ sáng lập</h3>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              </div>

              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                }}
                className="pb-12 !px-2"
              >
                {founders.map((founder, idx) => (
                  <SwiperSlide key={idx} className="h-full">
                    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full group hover:shadow-md transition-all duration-300">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-orange-100 rounded-full scale-105 group-hover:scale-110 transition-transform duration-300"></div>
                        <Image
                          src={founder.img}
                          alt={founder.name}
                          width={120}
                          height={120}
                          className="rounded-full relative z-10 object-cover border-4 border-white"
                        />
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-color transition-colors">{founder.name}</h4>
                      <p className="text-sm text-gray-500 font-medium">{founder.role}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 md:px-16 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Sứ mệnh của FoodFund</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Chúng tôi tin rằng không ai nên phải lo lắng về bữa ăn hằng ngày.
              FoodFund được xây dựng để kết nối những tấm lòng nhân ái với những
              người đang cần sự hỗ trợ cấp thiết, đặc biệt là trong những thời
              điểm khó khăn.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((item, idx) => (
              <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group h-full">
                <CardHeader className={`${item.color} pb-6 pt-8 flex flex-col items-center`}>
                  <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent className="text-center pt-6 pb-8">
                  <CardTitle className="text-lg font-bold text-gray-800 mb-3">{item.title}</CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
