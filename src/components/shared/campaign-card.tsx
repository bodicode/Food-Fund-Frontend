"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCampaignSlug } from "../../lib/utils/slug-utils";
import { Clock, MapPin, Users, Heart, ArrowUpRight } from "lucide-react";
import { STATUS_CONFIG } from "../../constants/status";
import { CampaignPhase } from "../../types/api/phase";

gsap.registerPlugin(ScrollTrigger);

type CampaignCardProps = {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  phases?: CampaignPhase[];
  status?:
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "PROCESSING"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";
  donationCount: number;
  receivedAmount: string;
  targetAmount: string;
  fundraisingStartDate?: string;
  fundraisingEndDate?: string;
  category?: {
    title: string;
  };
  creator?: {
    full_name: string;
    avatar?: string;
  };

  fundingProgress?: number;
  daysRemaining?: number;
  totalPhases?: number;
  daysActive?: number;

  isHero?: boolean;
  isEmergency?: boolean;
  className?: string;

  [key: string]: unknown;
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
  description,
  coverImage,
  phases,
  status,
  donationCount,
  receivedAmount,
  targetAmount,
  fundraisingEndDate,
  category,
  isHero = false,
  isEmergency = false,
  fundingProgress,
  daysRemaining: daysRemainingFromApi,
  className,
}: CampaignCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const raised = Number(receivedAmount);
  const goal = Number(targetAmount);

  const calculatedProgress = goal > 0 ? (raised / goal) * 100 : 0;
  const displayProgress =
    typeof fundingProgress === "number" ? fundingProgress : calculatedProgress;
  const visualProgress = Math.min(displayProgress, 100);
  const textProgress = Math.round(displayProgress);

  useLayoutEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      const bar = cardRef.current?.querySelector<HTMLElement>(
        ".progress-bar-fill"
      );
      if (bar) {
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${visualProgress}%`,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 95%",
              once: true,
            },
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, [visualProgress]);

  const daysLeft = () => {
    if (typeof daysRemainingFromApi === "number") return daysRemainingFromApi;
    if (!fundraisingEndDate) return null;
    const diff = new Date(fundraisingEndDate).getTime() - Date.now();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  const isPending = status === "PENDING";
  const daysLeftValue = daysLeft();

  const handleClick = () => {
    if (isPending) return;
    const slug = createCampaignSlug(title, id);
    router.push(`/campaign/${slug}`);
  };

  return (
    <article
      ref={cardRef}
      onClick={handleClick}
      className={`
        w-full bg-white rounded-[2rem] overflow-hidden cursor-pointer group select-none
        border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1
        flex flex-col
        ${isHero ? "fc-hero h-full" : "fc-card h-full"}
        ${isEmergency ? "ring-2 ring-red-500/50" : ""}
        ${isPending ? "opacity-60 grayscale cursor-not-allowed" : ""}
        ${className || ""}
      `}
    >
      {/* Image Section - Takes all available space not used by content */}
      <div
        className={`relative overflow-hidden w-full ${isHero ? "flex-1 min-h-[300px] md:min-h-[400px]" : "h-[220px]"
          }`}
      >
        <Image
          src={coverImage || "/images/default-cover.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isHero && category && (
            <div className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {category.title}
            </div>
          )}

          {status && STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] && (
            <div className="bg-white/90 backdrop-blur-md text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].color.split(' ')[0]}`} />
              {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-md text-[#E77731] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {donationCount.toLocaleString("vi-VN")} ủng hộ
          </div>

          {isEmergency && (
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Khẩn cấp
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div
        className={`flex flex-col bg-white shrink-0 ${isHero ? "p-6 md:p-8" : "p-5"
          }`}
      >
        {/* Top Section: Meta, Title, Description */}
        <div className="flex-1 flex flex-col">
          <div className="text-xs text-gray-500 font-medium mb-3 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md max-w-full">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{phases && phases[0] ? phases[0].location : "Toàn quốc"}</span>
            </span>
            {isHero && daysLeftValue !== null && (
              <span className="flex items-center gap-1 bg-orange-50 text-[#E77731] px-2.5 py-1 rounded-md whitespace-nowrap">
                <Clock className="w-3.5 h-3.5" />
                Còn {daysLeftValue} ngày
              </span>
            )}
          </div>

          <h3
            className={`font-bold text-gray-900 leading-tight group-hover:text-[#E77731] transition-colors ${isHero ? "text-2xl md:text-3xl mb-4" : "text-lg mb-2 line-clamp-2 h-12"
              }`}
          >
            {title}
          </h3>

          {description && (
            <div
              className={`text-gray-600 leading-relaxed ${isHero
                ? "text-base line-clamp-4 md:line-clamp-6 mb-6"
                : "text-sm line-clamp-2 mb-4"
                }`}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: description?.replace(/<[^>]*>?/gm, "") || "",
                }}
              />
            </div>
          )}

          {/* Filler to push bottom section down only if needed, but not too far if content is short */}
          <div className="flex-grow min-h-[1rem]"></div>
        </div>

        {/* Bottom Section: Stats, Progress, Action */}
        <div className="space-y-5 pt-4 border-t border-gray-50 mt-auto">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span className="flex items-baseline gap-1">
                <span className="text-[#E77731] text-sm">{textProgress}%</span>
                <span className="font-medium text-gray-400">hoàn thành</span>
              </span>
              {!isHero && daysLeftValue !== null && (
                <span className="text-[#E77731] font-medium">{daysLeftValue} ngày còn lại</span>
              )}
            </div>
            <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${isHero ? "h-3" : "h-2"}`}>
              <div
                className="progress-bar-fill h-full bg-[#E77731] rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] -translate-x-full" />
              </div>
            </div>
          </div>

          {/* Financial Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-gray-500 font-medium mb-1">
                Mục tiêu
              </span>
              <span className={`block font-bold text-gray-900 ${isHero ? "text-lg" : "text-sm"}`}>
                {fmtVND(goal)}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-xs text-gray-500 font-medium mb-1">
                Đã quyên góp
              </span>
              <span className={`block font-bold text-[#E77731] ${isHero ? "text-lg" : "text-sm"}`}>
                {fmtVND(raised)}
              </span>
            </div>
          </div>

          {/* Hero Button */}
          {isHero && (
            <div className="pt-2">
              <button className="w-full bg-[#E77731] hover:bg-[#cf621e] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg shadow-orange-200">
                <Heart className="w-5 h-5 fill-current" />
                <span>Quyên góp ngay</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
