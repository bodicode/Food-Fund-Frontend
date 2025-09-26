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
    <section className="container mx-auto">
      <div
        ref={rootRef}
        className="mx-auto px-4 overflow-hidden bg-gradient-to-br from-[#E77731]/90 via-[#E77731]/80 to-[#ad4e28]/85 min-h-[300px]"
      >
        <div className="flex items-center justify-between px-4 md:px-8 pt-10 mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-sm text-center md:text-left">
            Tổ chức, cá nhân gây quỹ nổi bật
          </h2>
          <Link
            href="#"
            className="hidden md:inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium"
          >
            Xem tất cả <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 px-4 md:px-8 py-10 items-stretch">
          {fundraisers.map((f) => (
            <div key={f.id} className="ff-card-wrap">
              <article
                className="ff-card relative bg-white dark:bg-card text-gray-800 dark:text-foreground
                           rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10
                           p-6 pt-16 flex flex-col h-full will-change-transform transition-transform"
              >
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-8 md:-top-12 
                             size-24 rounded-full overflow-hidden bg-white shadow-md
                             ring-4 ring-[#E77731]/20"
                >
                  <Image
                    src={f.logo}
                    alt={f.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 items-center text-center">
                  <h3 className="text-lg md:text-xl font-semibold mb-1 h-16">
                    {f.name}
                  </h3>

                  <span
                    className="text-[13px] px-3 py-1 rounded-full mb-3"
                    style={{
                      backgroundColor: "rgba(231,119,49,0.12)",
                      color: "#E77731",
                    }}
                  >
                    {f.username}
                  </span>

                  {f.description ? (
                    <p className="text-sm text-gray-600 dark:text-muted-foreground mb-4 line-clamp-2 min-h-[44px]">
                      {f.description}
                    </p>
                  ) : (
                    <div className="min-h-[44px] mb-4" />
                  )}

                  <p className="text-sm text-gray-500 dark:text-muted-foreground">
                    Số tiền gây quỹ
                  </p>
                  <p
                    className="text-xl md:text-2xl font-extrabold mb-5"
                    style={{ color: "#E77731" }}
                  >
                    {fmtVND(f.raised)}
                  </p>

                  <div className="mt-auto w-full flex justify-center">
                    <button className="btn-color w-full max-w-[220px] h-11 rounded-full font-medium flex items-center justify-center gap-2 transition-colors">
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
