"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);

export function FeaturedCampaigns() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fc-hero",
        { y: 18, scale: 0.995, boxShadow: "0 0 0 rgba(0,0,0,0)" },
        {
          y: 0,
          scale: 1,
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".fc-hero", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".fc-card",
        { y: 20, scale: 0.995, boxShadow: "0 0 0 rgba(0,0,0,0)" },
        {
          y: 0,
          scale: 1,
          boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
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

      gsap.utils.toArray<HTMLElement>(".fc-progress").forEach((bar) => {
        const p = Number(bar.dataset.progress || "0");
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${Math.max(0, Math.min(100, p))}%`,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: bar, start: "top 90%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".fc-money").forEach((node) => {
        const value = Number(node.dataset.value || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: value,
          duration: 1.2,
          ease: "power1.out",
          snap: { val: 1000 },
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
          onUpdate() {
            node.textContent = fmtVND(Math.floor(obj.val));
          },
        });
      });

      document.querySelectorAll<HTMLElement>(".fc-parallax").forEach((card) => {
        const img = card.querySelector<HTMLElement>(".fc-img");
        if (!img) return;

        const move = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(img, {
            xPercent: relX * 4,
            yPercent: relY * 4,
            scale: 1.05,
            duration: 0.25,
            ease: "power2.out",
          });
        };
        const leave = () =>
          gsap.to(img, {
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            duration: 0.35,
            ease: "power3.out",
          });

        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
      });
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
      <div ref={rootRef} className="container mx-auto px-2">
        <h2 className="text-center text-3xl text-color font-bold mb-8 text-gray-900">
          Chiến dịch nổi bật
        </h2>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="fc-hero fc-parallax group relative rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:shadow-xl">
            <div className="overflow-hidden">
              <Image
                src={hero.image}
                alt={hero.title}
                width={800}
                height={600}
                className="fc-img w-full h-[460px] md:h-[570px] object-cover"
              />
            </div>
            <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {hero.donations.toLocaleString("vi-VN")} lượt ủng hộ
            </span>
            <div className="p-4">
              <h3 className="font-semibold text-lg line-clamp-2">
                {hero.title}
              </h3>

              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Đã ủng hộ</span>
                  <span
                    className="fc-money font-medium"
                    data-value={hero.raised}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Mục tiêu</span>
                  <span className="fc-money" data-value={hero.goal} />
                </div>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="fc-progress h-2 bg-green-color rounded-full"
                  data-progress={hero.progress}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {rightTwoByTwo.map((c) => (
              <div
                key={c.id}
                className="fc-card fc-parallax group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    width={400}
                    height={300}
                    className="fc-img w-full h-[170px] md:h-[190px] object-cover"
                  />
                </div>
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] md:text-xs px-2 py-0.5 rounded">
                  {c.donations.toLocaleString("vi-VN")} lượt ủng hộ
                </span>

                <div className="p-3">
                  <h4 className="font-medium text-sm md:text-base line-clamp-2 h-14">
                    {c.title}
                  </h4>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] md:text-sm text-gray-600">
                      <span>Đã ủng hộ</span>
                      <span
                        className="fc-money font-medium"
                        data-value={c.raised}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] md:text-sm text-gray-500">
                      <span>Mục tiêu</span>
                      <span className="fc-money" data-value={c.goal} />
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="fc-progress h-2 bg-green-color rounded-full"
                      data-progress={c.progress}
                    />
                  </div>
                </div>
              </div>
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
                <div className="fc-card fc-parallax group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg">
                  <div className="overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.title}
                      width={400}
                      height={300}
                      className="fc-img w-full h-[170px] md:h-[190px] object-cover"
                    />
                  </div>
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] md:text-xs px-2 py-0.5 rounded">
                    {c.donations.toLocaleString("vi-VN")} lượt ủng hộ
                  </span>

                  <div className="p-3">
                    <h4 className="font-medium text-sm md:text-base line-clamp-2 h-14">
                      {c.title}
                    </h4>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] md:text-sm text-gray-600">
                        <span>Đã ủng hộ</span>
                        <span
                          className="fc-money font-medium"
                          data-value={c.raised}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] md:text-sm text-gray-500">
                        <span>Mục tiêu</span>
                        <span className="fc-money" data-value={c.goal} />
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="fc-progress h-2 bg-green-color rounded-full"
                        data-progress={c.progress}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
