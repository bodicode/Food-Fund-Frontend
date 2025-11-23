"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlarmClock } from "@/components/animate-ui/icons/alarm-clock";
import { Clock12 } from "@/components/animate-ui/icons/clock-12";
import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { createCampaignSlug } from "@/lib/utils/slug-utils";

gsap.registerPlugin(ScrollTrigger);

type CampaignCardProps = {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  phases?: Array<{
    id?: string;
    phaseName: string;
    location: string;
    ingredientPurchaseDate: string;
    cookingDate: string;
    deliveryDate: string;
    status?: string;
  }>;
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
  categoryId?: string;
  creatorName?: string;

  fundingProgress?: number;
  daysRemaining?: number;
  totalPhases?: number;
  daysActive?: number;

  isHero?: boolean;
  isEmergency?: boolean;
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
  description,
  coverImage,
  phases,
  status,
  donationCount,
  receivedAmount,
  targetAmount,
  fundraisingStartDate,
  fundraisingEndDate,
  // categoryId,
  creatorName,
  isHero = false,
  isEmergency = false,
  fundingProgress,
  daysRemaining: daysRemainingFromApi,
  daysActive,
  className,
}: CampaignCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const raised = Number(receivedAmount);
  const goal = Number(targetAmount);
  const progress =
    typeof fundingProgress === "number"
      ? Math.round(fundingProgress)
      : goal > 0
      ? Math.round((raised / goal) * 100)
      : 0;

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
            duration: 0.6,
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

  const daysLeft = () => {
    if (typeof daysRemainingFromApi === "number") return daysRemainingFromApi;
    if (!fundraisingEndDate) return null;
    const diff = new Date(fundraisingEndDate).getTime() - Date.now();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  const isPending = status === "PENDING";

  // Derived date metrics (fallbacks if API not provided)
  const ONE_DAY_MS = 1000 * 60 * 60 * 24;
  const computedDaysActive = (() => {
    if (typeof daysActive === "number") return daysActive;
    if (!fundraisingStartDate) return null;
    const diff = Date.now() - new Date(fundraisingStartDate).getTime();
    return Math.max(Math.ceil(diff / ONE_DAY_MS), 0);
  })();

  const handleClick = () => {
    if (isPending) return;
    const slug = createCampaignSlug(title, id);
    router.push(`/campaign/${slug}`);
  };

  return (
    <div
      ref={cardRef}
      key={id}
      onClick={handleClick}
      className={`cursor-pointer select-none will-change-transform ${
        isHero
          ? "fc-hero fc-parallax group relative rounded-3xl overflow-hidden bg-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-2"
          : "fc-card fc-parallax group relative rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 ease-out hover:-translate-y-3"
      } ${
        isEmergency
          ? "ring-2 ring-red-400 ring-offset-2 bg-white/95 backdrop-blur-xl"
          : ""
      } ${isPending ? "opacity-50 pointer-events-none" : ""} ${
        className ? className : ""
      }`}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

        <Image
          src={coverImage || "/images/default-cover.jpg"}
          alt={title}
          width={isHero ? 800 : 400}
          height={isHero ? 600 : 300}
          className={`fc-img w-full ${
            isHero ? "h-[360px] md:h-[800px]" : "h-[220px] md:h-[300px]"
          } object-cover transition-transform duration-500 ease-out group-hover:scale-105`}
        />

        {isEmergency && (
          <span className="absolute top-3 right-3 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/50 flex items-center gap-x-1.5 animate-pulse">
            <Clock12 animate animateOnView loop className="h-4 w-4" />
            Sắp hết hạn
          </span>
        )}

        {isPending && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="text-gray-700 font-semibold text-lg">
              Chờ duyệt
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full px-4 pb-4 z-20">
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/40 group-hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between text-white text-sm font-bold mb-2.5 drop-shadow-lg">
              <span className="fc-money text-base" data-value={raised}>
                {fmtVND(raised)}
              </span>
              <span className="text-xs bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-bold border border-white/40 shadow-sm">
                {progress}%
              </span>
            </div>

            <div className="w-full bg-white/25 backdrop-blur-sm h-3 rounded-full overflow-hidden border border-white/40 shadow-inner">
              <div
                className="fc-progress h-3 bg-gradient-to-r from-white/70 to-white/90 rounded-full shadow-md relative"
                style={{ width: `${progress}%` }}
                data-value={progress}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <span
        className={`absolute ${
          isHero ? "top-4 left-4" : "top-3 left-3"
        } z-20 bg-gradient-to-r from-[#E77731] to-[#ad4e28] text-white text-[10px] md:text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/30 shadow-lg backdrop-blur-sm`}
      >
        {donationCount.toLocaleString("vi-VN")} lượt ủng hộ
      </span>

      <div className={`${isHero ? "p-5" : "p-4"} flex flex-col`}>
        <h3
          className={`${
            isHero
              ? "font-bold text-xl line-clamp-2 text-gray-900 group-hover:text-[#E77731] transition-colors duration-300"
              : "font-bold text-lg line-clamp-2 h-14 text-gray-900 group-hover:text-[#E77731] transition-colors duration-300"
          }`}
        >
          {title}
        </h3>

        {isHero && description && (
          <div className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3 overflow-hidden">
            <div
              className="[&_p]:my-1 [&_p]:last:mb-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {isEmergency && fundraisingEndDate && (
          <div className="mt-3 text-sm text-red-600 font-semibold flex items-center gap-x-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
            <AlarmClock
              className="w-5 h-5"
              animate
              animateOnHover
              animateOnView
              loop
            />
            <span>Còn {daysLeft()} ngày</span>
          </div>
        )}

        {!isHero && description && (
          <div className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-2 overflow-hidden min-h-[2.5rem]">
            <div
              className="[&_p]:inline [&_*]:inline [&_p]:m-0 [&_br]:hidden"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500 font-medium space-y-1 h-6">
          {phases && phases.length > 0 && (
            <>
              {phases.length === 1 ? (
                <div className="flex items-start gap-x-1.5">
                  <MapPin
                    animate
                    animateOnView
                    loop
                    className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
                  />
                  <span className="line-clamp-1 flex-1">
                    {phases[0].location}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-x-1.5">
                    <MapPin
                      animate
                      animateOnView
                      loop
                      className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
                    />
                    <span className="line-clamp-1 flex-1">
                      {phases[0].location}
                    </span>
                  </div>
                  <div className="flex items-start gap-x-1.5">
                    <MapPin
                      animate
                      animateOnView
                      loop
                      className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
                    />
                    <span className="line-clamp-1 flex-1">
                      {phases[1].location}
                      {phases.length > 2 && (
                        <span className="ml-1 text-[#E77731] font-semibold">
                          +{phases.length - 2}
                        </span>
                      )}
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-400 italic min-h-[1.25rem]">
          {creatorName && `Bởi ${creatorName}`}
        </div>

        {isHero && (computedDaysActive != null || daysLeft() != null) && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {computedDaysActive != null && (
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                <span className="text-gray-500 text-sm font-medium">
                  Đang hoạt động
                </span>
                <span className="text-gray-800 font-semibold">
                  {computedDaysActive} ngày
                </span>
              </div>
            )}
            {daysLeft() != null && (
              <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                <span className="text-gray-500 text-sm font-medium">
                  Còn lại
                </span>
                <span className="text-gray-800 font-semibold">
                  {daysLeft()} ngày
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 space-y-2 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Lượt ủng hộ</span>
            <span className="font-bold text-[#E77731]">
              {donationCount.toLocaleString("vi-VN")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Đã ủng hộ</span>
            <span
              className="fc-money font-bold text-color"
              data-value={raised}
            >
              {fmtVND(raised)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Mục tiêu</span>
            <span
              className="fc-money font-semibold text-gray-700"
              data-value={goal}
            >
              {fmtVND(goal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
