"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CampaignCard } from "@/components/shared/campaign-card";
import { Skeleton } from "@/components/ui/skeleton";
import { campaignService } from "@/services/campaign.service";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { Campaign } from "@/types/api/campaign";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

const mapCampaignToCardProps = (c: Campaign) => ({
  ...c,
  progress: Math.round(
    (Number(c.receivedAmount) / Number(c.targetAmount || 1)) * 100
  ),
});

export function FeaturedCampaigns() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns({
          filter: { status: ["ACTIVE", "APPROVED"] },
          sortBy: "NEWEST_FIRST",
          limit: 10,
          offset: 0,
        });
        setCampaigns(data ?? []);
      } catch (err) {
        console.error("Error loading campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
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

  if (loading) {
    return (
      <section className="py-6 mt-3">
        <div className="px-6 mx-auto">
          <h2 className="text-center text-3xl font-bold mb-8 text-gray-900">
            Chiến dịch nổi bật
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!campaigns.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        Hiện chưa có chiến dịch nào.
      </div>
    );
  }

  const [hero, ...rest] = campaigns.map(mapCampaignToCardProps);
  const rightTwoByTwo = rest.slice(0, 4);
  const bottomSliderList = rest.slice(-6);

  return (
    <section className="py-6 mt-3">
      <div ref={rootRef} className="px-12 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl text-color font-bold text-gray-900">
            Chiến dịch nổi bật
          </h2>
          <Link
            href="/s"
            className="text-sm font-medium text-color nav-hover-btn"
          >
            Xem tất cả{" "}
            <ArrowRight
              animate
              animateOnView
              animateOnHover
              className="w-4 h-4 inline-block"
            />
          </Link>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 flex">
            <CampaignCard {...hero} isHero className="flex-1" />
          </div>

          <div className="flex flex-col gap-6">
            {rightTwoByTwo.slice(0, 2).map((c) => (
              <CampaignCard key={c.id} {...c} className="flex-1" />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop
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
