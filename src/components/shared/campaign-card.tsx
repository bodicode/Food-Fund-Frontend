"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlarmClock } from "@/components/animate-ui/icons/alarm-clock";
import { Clock12 } from "@/components/animate-ui/icons/clock-12";
import { MapPin } from "../animate-ui/icons/map-pin";

gsap.registerPlugin(ScrollTrigger);

type CampaignCardProps = {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  location?: string;
  status?: string;
  donationCount: number;
  receivedAmount: string;
  targetAmount: string;
  progress?: number;
  isHero?: boolean;
  isEmergency?: boolean;
  deadline?: string;
  className?: string;
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
  coverImage,
  location,
  status,
  donationCount,
  receivedAmount,
  targetAmount,
  progress,
  isHero = false,
  isEmergency = false,
  deadline,
}: CampaignCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const raised = Number(receivedAmount);
  const goal = Number(targetAmount);
  const computedProgress = progress ?? Math.round((raised / goal) * 100);

  useLayoutEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      cardRef
        .current!.querySelectorAll<HTMLElement>(".fc-progress")
        .forEach((bar) => {
          const targetWidth = Number(bar.dataset.value || "0");
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${targetWidth}%`,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardRef.current,
                start: "top 90%",
                once: true,
              },
            }
          );
        });

      cardRef
        .current!.querySelectorAll<HTMLElement>(".fc-money")
        .forEach((node) => {
          const value = Number(node.dataset.value || "0");
          const obj = { val: 0 };
          gsap.to(obj, {
            val: value,
            duration: 0.5,
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
  }, [computedProgress, raised, goal]);

  function daysLeft(deadline?: string) {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }

  const isPending = status === "PENDING";

  const handleClick = () => {
    if (isPending) return;
    router.push(`/campaign/${id}`);
  };

  return (
    <div
      ref={cardRef}
      key={id}
      onClick={handleClick}
      className={`cursor-pointer select-none ${
        isHero
          ? "fc-hero fc-parallax group relative rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
          : "fc-card fc-parallax group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg"
      } ${
        isEmergency ? "border border-red-400 bg-white/70 backdrop-blur-xl" : ""
      }
        ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="relative overflow-hidden">
        <Image
          src={coverImage}
          alt={title}
          width={isHero ? 800 : 400}
          height={isHero ? 600 : 300}
          className={`fc-img w-full ${
            isHero ? "h-[360px] md:h-[800px]" : "h-[220px] md:h-[300px]"
          } object-cover transition-transform duration-500 group-hover:scale-105`}
        />

        {isEmergency && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow flex items-center gap-x-1">
            Khẩn cấp <Clock12 animate animateOnView loop className="h-5 w-5" />
          </span>
        )}

        {isPending && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="text-gray-700 font-semibold text-lg">
              Chờ duyệt
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full px-3 pb-3">
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-2">
            <div className="flex items-center justify-between text-white text-sm font-semibold mb-1">
              <span className="fc-money" data-value={raised}>
                {fmtVND(raised)}
              </span>
              <span>{computedProgress}%</span>
            </div>

            <div className="w-full bg-white/40 h-2 rounded-full overflow-hidden">
              <div
                className="fc-progress h-2 bg-green-color rounded-full"
                style={{ width: `${computedProgress}%` }}
                data-value={computedProgress}
              />
            </div>
          </div>
        </div>
      </div>

      <span
        className={`absolute ${isHero ? "top-3 left-3" : "top-2 left-2"} 
          bg-black/70 text-white text-[10px] md:text-xs px-2 py-0.5 rounded`}
      >
        {donationCount.toLocaleString("vi-VN")} lượt ủng hộ
      </span>

      <div className={`${isHero ? "p-4" : "p-3"}`}>
        <h3
          className={`${
            isHero
              ? "font-semibold text-lg line-clamp-2"
              : "font-medium text-lg line-clamp-2 h-14"
          }`}
        >
          {title}
        </h3>

        {isEmergency && deadline && (
          <div className="mt-3 text-sm text-red-600 font-medium flex items-center gap-x-1">
            <AlarmClock
              className="w-4 h-4"
              animate
              animateOnHover
              animateOnView
              loop
            />
            <span>Còn {daysLeft(deadline)} ngày</span>
          </div>
        )}

        {location && (
          <div className="mt-2 text-xs text-gray-400 italic line-clamp-1">
            <MapPin
              animate
              animateOnView
              loop
              className="w-4 h-4 inline-block"
            />{" "}
            {location}
          </div>
        )}

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
      </div>
    </div>
  );
}
