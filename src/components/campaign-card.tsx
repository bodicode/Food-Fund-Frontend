"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CampaignCardProps = {
  id: number;
  title: string;
  image: string;
  donations: number;
  raised: number;
  goal: number;
  progress: number;
  isHero?: boolean;
};

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);

export function CampaignCard({
  id,
  title,
  image,
  donations,
  raised,
  goal,
  progress,
  isHero = false,
}: CampaignCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      const bar = cardRef.current!.querySelector<HTMLElement>(".fc-progress");
      if (bar) {
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${progress}%`,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      cardRef
        .current!.querySelectorAll<HTMLElement>(".fc-money")
        .forEach((node) => {
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
    }, cardRef);

    return () => ctx.revert();
  }, [progress, raised, goal]);

  return (
    <div
      ref={cardRef}
      key={id}
      className={`${
        isHero
          ? "fc-hero fc-parallax group relative rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
          : "fc-card fc-parallax group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg"
      }`}
    >
      <div className="overflow-hidden cursor-pointer">
        <Image
          src={image}
          alt={title}
          width={isHero ? 800 : 400}
          height={isHero ? 600 : 300}
          className={`fc-img w-full ${
            isHero ? "h-[460px] md:h-[800px]" : "h-[280px] md:h-[300px]"
          } object-cover`}
        />
      </div>

      <span
        className={`absolute ${isHero ? "top-3 left-3" : "top-2 left-2"} 
          bg-black/70 text-white text-[10px] md:text-xs px-2 py-0.5 rounded`}
      >
        {donations.toLocaleString("vi-VN")} lượt ủng hộ
      </span>

      <div className={`${isHero ? "p-4" : "p-3"}`}>
        <h3
          className={`${
            isHero
              ? "font-semibold text-lg line-clamp-2"
              : "font-medium text-sm md:text-base line-clamp-2 h-14"
          }`}
        >
          {title}
        </h3>

        <div className="mt-2 md:mt-3 space-y-1">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Đã ủng hộ</span>
            <span className="fc-money font-medium" data-value={raised}></span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Mục tiêu</span>
            <span className="fc-money" data-value={goal}></span>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className="fc-progress h-2 bg-green-color rounded-full"
            data-progress={progress}
          />
        </div>
      </div>
    </div>
  );
}
