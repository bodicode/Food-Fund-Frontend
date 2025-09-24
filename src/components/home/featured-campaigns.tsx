"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CampaignCard } from "../campaign-card";

gsap.registerPlugin(ScrollTrigger);

type Campaign = {
  id: number;
  title: string;
  image: string;
  donations: number;
  raised: number;
  goal: number;
};

const campaigns: Campaign[] = [
  {
    id: 1,
    title: "Nhà trẻ Hoa Hồng gặp khó khăn trong bữa ăn",
    image: "/images/what-we-do-2.jpg",
    donations: 10_000,
    raised: 2_899_000_000,
    goal: 2_900_000_000,
  },
  {
    id: 2,
    title: "Gây quỹ bữa ăn cho xóm trọ công nhân KCN Tân Bình",
    image: "/images/what-we-do-2.jpg",
    donations: 825,
    raised: 100_000_000,
    goal: 740_000_000,
  },
  {
    id: 3,
    title: "Hỗ trợ suất ăn cho bệnh nhân nghèo BV Q.8",
    image: "/images/what-we-do-2.jpg",
    donations: 5_100,
    raised: 523_000_000,
    goal: 1_050_000_000,
  },
  {
    id: 4,
    title: "Bếp ăn yêu thương tại xã vùng cao Mường Lống",
    image: "/images/what-we-do-2.jpg",
    donations: 1_100,
    raised: 255_000_000,
    goal: 550_000_000,
  },
  {
    id: 5,
    title: "Bữa trưa ấm nóng cho học sinh đảo Bé Lý Sơn",
    image: "/images/what-we-do-2.jpg",
    donations: 1_500,
    raised: 498_000_000,
    goal: 690_000_000,
  },
  {
    id: 6,
    title: "Bữa trưa ấm nóng cho học sinh đảo Bé Lý Sơn",
    image: "/images/what-we-do-2.jpg",
    donations: 1_500,
    raised: 498_000_000,
    goal: 690_000_000,
  },
  {
    id: 7,
    title: "Bữa trưa ấm nóng cho học sinh đảo Bé Lý Sơn",
    image: "/images/what-we-do-2.jpg",
    donations: 1_500,
    raised: 498_000_000,
    goal: 690_000_000,
  },
];

export function FeaturedCampaigns() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      // Hero card animation
      gsap.fromTo(
        ".fc-hero",
        { y: 18, scale: 0.98, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".fc-hero", start: "top 85%", once: true },
        }
      );

      // Other cards animation
      gsap.fromTo(
        ".fc-card",
        { y: 20, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: rootRef.current!,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const withProgress = (c: Campaign) => ({
    ...c,
    progress: Math.round((c.raised / c.goal) * 100),
  });

  const [hero, ...rest] = campaigns.map(withProgress);

  const rightTwoByTwo = rest.slice(0, 4);

  const bottomSliderList = rest.slice(-6);

  return (
    <section className="py-6">
      <div ref={rootRef} className="px-6 mx-auto">
        <h2 className="text-center text-3xl text-color font-bold mb-8 text-gray-900">
          Chiến dịch nổi bật
        </h2>

        <div className="grid lg:grid-cols-2 gap-6">
          <CampaignCard {...hero} isHero />

          <div className="grid grid-cols-2 gap-6">
            {rightTwoByTwo.map((c) => (
              <CampaignCard key={c.id} {...c} />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            speed={1800}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {bottomSliderList.map((c) => (
              <SwiperSlide key={`bottom-${c.id}`}>
                <CampaignCard {...c} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
