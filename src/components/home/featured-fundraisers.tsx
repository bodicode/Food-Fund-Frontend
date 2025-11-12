"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Fundraiser = {
  id: number;
  name: string;
  username: string;
  description?: string;
  logo: string;
  raised: number;
};

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);

const fundraisers: Fundraiser[] = [
  {
    id: 1,
    name: "Hội Chữ thập đỏ Việt Nam",
    username: "@chuthapdo",
    description:
      "Hội Chữ thập đỏ Việt Nam là tổ chức xã hội nhân đạo quần chúng, do Chủ tịch Hồ Chí Minh sáng lập…",
    logo: "/images/avatar.webp",
    raised: 439_058_502_851,
  },
  {
    id: 2,
    name: "Nguyễn Văn B",
    username: "@b@gmail.com",
    logo: "/images/avatar.webp",
    raised: 70_327_688_990,
  },
  {
    id: 3,
    name: "Ban Vận Động Quỹ Vì Người Nghèo Tỉnh Long An",
    username: "@quyvinguoingheolongan",
    logo: "/images/avatar.webp",
    raised: 46_796_947_438,
  },
];

export function FeaturedFundraisers() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.from(root, {
      y: 24,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 80%", once: true },
    });

    const MAX_TILT = 6;
    const SCALE_HOVER = 1.01;

    gsap.set(root, {
      transformStyle: "preserve-3d",
      transformOrigin: "50% 50%",
      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    });

    const qRotX = gsap.quickTo(root, "rotationX", {
      duration: 0.3,
      ease: "power2.out",
    });
    const qRotY = gsap.quickTo(root, "rotationY", {
      duration: 0.3,
      ease: "power2.out",
    });
    const qScale = gsap.quickTo(root, "scale", {
      duration: 0.3,
      ease: "power2.out",
    });

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const relX = (e.clientX - cx) / (rect.width / 2);
      const relY = (e.clientY - cy) / (rect.height / 2);

      const rotX = gsap.utils.clamp(-MAX_TILT, MAX_TILT, -relY * MAX_TILT);
      const rotY = gsap.utils.clamp(-MAX_TILT, MAX_TILT, relX * MAX_TILT);

      qRotX(rotX);
      qRotY(rotY);
      qScale(SCALE_HOVER);
    };

    const onLeave = () => {
      qRotX(0);
      qRotY(0);
      qScale(1);
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="container mx-auto pb-6 md:pb-20 px-4">
      <div
        ref={rootRef}
        className="mx-auto overflow-hidden bg-gradient-to-br from-[#E77731] via-[#E77731]/95 to-[#ad4e28] rounded-2xl md:rounded-3xl shadow-2xl min-h-[300px]"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 pt-8 md:pt-12 mb-16 md:mb-20">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg text-center md:text-left">
            Tổ chức, cá nhân gây quỹ nổi bật
          </h2>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-white hover:text-white/90 text-sm font-semibold transition-all duration-300 hover:gap-3 group"
          >
            <span>Xem tất cả</span>
            <span aria-hidden className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 pb-8 md:pb-12 items-stretch">
          {fundraisers.map((f) => (
            <div key={f.id} className="ff-card-wrap group">
              <article
                className="ff-card relative bg-white/95 backdrop-blur-sm dark:bg-card text-gray-800 dark:text-foreground
                           rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl ring-1 ring-white/50 dark:ring-white/10
                           p-5 md:p-6 pt-14 md:pt-16 flex flex-col h-full will-change-transform transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-8 sm:-top-10 md:-top-14 
                             size-20 sm:size-24 md:size-28 rounded-full overflow-hidden bg-white shadow-2xl
                             ring-4 ring-white/50 group-hover:ring-6 group-hover:ring-[#E77731]/30 transition-all duration-500"
                >
                  <Image
                    src={f.logo}
                    alt={f.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex flex-col flex-1 items-center text-center">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 min-h-[3rem] sm:min-h-[4rem] flex items-center justify-center group-hover:text-[#E77731] transition-colors duration-300 px-2">
                    {f.name}
                  </h3>

                  <span
                    className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4 bg-gradient-to-r from-[#E77731]/10 to-[#ad4e28]/10 border border-[#E77731]/20 truncate max-w-full"
                    style={{
                      color: "#E77731",
                    }}
                  >
                    {f.username}
                  </span>

                  {f.description ? (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground mb-4 sm:mb-5 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] px-2">
                      {f.description}
                    </p>
                  ) : (
                    <div className="min-h-[2.5rem] sm:min-h-[2.75rem] mb-4 sm:mb-5" />
                  )}

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl md:rounded-2xl p-3 md:p-4 mb-4 sm:mb-5 w-full border border-[#E77731]/10">
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-muted-foreground font-medium mb-1">
                      Số tiền gây quỹ
                    </p>
                    <p
                      className="text-xl sm:text-2xl md:text-3xl font-bold break-all"
                      style={{ color: "#E77731" }}
                    >
                      {fmtVND(f.raised)}
                    </p>
                  </div>

                  <div className="mt-auto w-full flex justify-center px-2">
                    <button className="btn-color w-full max-w-[220px] h-10 sm:h-11 md:h-12 rounded-full text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                      Theo dõi
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
