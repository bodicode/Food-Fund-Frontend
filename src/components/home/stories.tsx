"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
};

const items: Testimonial[] = [
  {
    id: 1,
    quote:
      "Sự ra đời của App FoodFund minh bạch đã giúp tôi có nhiều thời gian hơn để giúp đỡ người bị nạn mà không phải lo lắng về báo cáo. Đây là giải pháp chuẩn nhất hiện tại để áp dụng quản lý chất lượng các chương trình thiện nguyện.",
    author: "Phạm Quốc Việt (STK 8727)",
    role: "Sáng lập đội hỗ trợ sơ cứu FAS Angel",
    avatar: "/images/avatar.webp",
  },
  {
    id: 2,
    quote:
      "Nhờ nền tảng, chúng tôi kết nối nhà hảo tâm nhanh hơn, tiền và nhu yếu phẩm đến đúng nơi – đúng lúc. Dữ liệu minh bạch giúp cộng đồng tin tưởng và đồng hành dài hạn.",
    author: "Lan Anh",
    role: "Điều phối viên bếp ăn dã chiến miền Trung",
    avatar: "/images/avatar.webp",
  },
  {
    id: 3,
    quote:
      "Quản lý chiến dịch, theo dõi tiến độ, xuất báo cáo chỉ vài phút. Đội ngũ tình nguyện giảm khối lượng giấy tờ để tập trung vào người cần giúp.",
    author: "Nguyễn Minh Trí",
    role: "Trưởng nhóm phát cơm cho người vô gia cư",
    avatar: "/images/avatar.webp",
  },
];

export function Stories() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#E77731] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-50" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Kết nối <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ff9f65]">triệu trái tim</span>, <br />
              trọn vẹn niềm tin.
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
              Nền tảng của chúng tôi không chỉ là công cụ, mà là cầu nối tin cậy giữa những tấm lòng nhân ái. Minh bạch, hiển thị rõ ràng và lan tỏa yêu thương.
            </p>

            {/* Custom Navigation */}
            <div className="flex items-center gap-4 pt-4">
              <button
                aria-label="Previous"
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 active:scale-95 group"
              >
                <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
              </button>
              <button
                aria-label="Next"
                onClick={() => swiperRef.current?.slideNext()}
                className="w-12 h-12 rounded-full bg-[#E77731] hover:bg-[#d66620] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Right Content - Swiper Card */}
          <div className="relative">
            {/* Decoration behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#E77731] to-purple-600 rounded-[2.5rem] opacity-30 blur-2xl -z-10" />

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
              <Swiper
                modules={[Autoplay, EffectFade, Keyboard]}
                onSwiper={(s) => (swiperRef.current = s)}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={800}
                loop
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                keyboard={{ enabled: true }}
                className="h-full"
              >
                {items.map((it) => (
                  <SwiperSlide key={it.id}>
                    <div className="flex flex-col h-full">
                      <Quote className="w-12 h-12 text-[#E77731] mb-6 opacity-80" />

                      <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 flex-grow">
                        &quot;{it.quote}&quot;
                      </blockquote>

                      <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
                        <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-[#E77731] to-purple-500">
                          <Image
                            src={it.avatar}
                            alt={it.author}
                            width={56}
                            height={56}
                            className="rounded-full object-cover border-2 border-transparent w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">
                            {it.author}
                          </div>
                          <div className="text-sm text-gray-400">
                            {it.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
