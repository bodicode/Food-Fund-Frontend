"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";

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
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-neutral-800">
              Kết nối triệu trái tim, <br />
              <span className="text-color">trọn Việt Nam nhân ái</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-neutral-600 max-w-xl leading-relaxed">
              Mỗi đóng góp đều được ghi nhận minh bạch. Nền tảng giúp bạn tạo
              chiến dịch, quản lý và báo cáo dễ dàng – để điều tốt lan tỏa nhanh
              hơn.
            </p>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 flex items-center gap-2 sm:gap-3">
              <button
                aria-label="Câu trước đó"
                onClick={() => swiperRef.current?.slidePrev()}
                className="size-8 sm:size-10 rounded-full border text-[#436037] border-[#8BAE66]/40 bg-white/90 hover:bg-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
              >
                <span className="text-sm sm:text-base">‹</span>
              </button>
              <button
                aria-label="Câu tiếp theo"
                onClick={() => swiperRef.current?.slideNext()}
                className="size-8 sm:size-10 rounded-full border text-[#436037] border-[#8BAE66]/40 bg-white/90 hover:bg-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
              >
                <span className="text-sm sm:text-base">›</span>
              </button>
            </div>

            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-white shadow-lg border border-gray-100">
              <Swiper
                modules={[Autoplay, EffectFade, Keyboard]}
                onSwiper={(s) => (swiperRef.current = s)}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={800}
                loop
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                keyboard={{ enabled: true }}
                className="h-full"
              >
                {items.map((it) => (
                  <SwiperSlide key={it.id}>
                    <figure className="space-y-4 sm:space-y-6 h-full flex flex-col">
                      <svg
                        viewBox="0 0 48 48"
                        className="w-8 h-8 sm:w-10 sm:h-10 text-[#8BAE66] opacity-40 flex-shrink-0"
                        fill="currentColor"
                      >
                        <path d="M18 8c-6 0-10 4-10 10 0 5 4 9 9 9v9H4v-9c0-11 8-19 18-19v0zM44 8c-6 0-10 4-10 10 0 5 4 9 9 9v9H30v-9c0-11 8-19 18-19v0z" />
                      </svg>

                      <blockquote className="text-neutral-700 leading-relaxed text-sm sm:text-base md:text-lg flex-grow">
                        {it.quote}
                      </blockquote>

                      <figcaption className="flex items-center gap-3 pt-2 flex-shrink-0">
                        <Image
                          src={it.avatar}
                          alt={it.author}
                          width={44}
                          height={44}
                          className="rounded-full object-cover ring-2 ring-[#E77731]/20 w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-neutral-800 text-sm sm:text-base truncate">
                            {it.author}
                          </div>
                          <div className="text-xs sm:text-sm text-neutral-500 line-clamp-2">
                            {it.role}
                          </div>
                        </div>
                      </figcaption>
                    </figure>
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
