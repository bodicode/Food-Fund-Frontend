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
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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
      <section className="pt-12 mt-6">
        <div className="px-6 md:px-12 mx-auto max-w-7xl">
          <h2 className="text-center text-4xl font-bold mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Chiến dịch nổi bật
          </h2>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-[500px] w-full rounded-3xl" />
            </div>
            <div className="flex flex-col gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-[240px] w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!campaigns.length) {
    return (
      <div className="text-center py-16 text-gray-500 font-medium">
        Hiện chưa có chiến dịch nào.
      </div>
    );
  }

  // Sort campaigns by donation count to get the most supported one as hero
  const sortedCampaigns = [...campaigns].sort((a, b) =>
    (b.donationCount || 0) - (a.donationCount || 0)
  );

  const [hero, ...rest] = sortedCampaigns.map(mapCampaignToCardProps);
  const rightTwoByTwo = rest.slice(0, 4);
  const bottomSliderList = rest.slice(-6);

  return (
    <section className="pt-12 mt-6 bg-base-color">
      <div ref={rootRef} className="px-6 md:px-12 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-color text-transparent">
            Chiến dịch nổi bật
          </h2>
          <Link
            href="/s"
            className="text-sm font-semibold text-color flex items-center gap-x-2 group"
          >
            <span>Xem tất cả</span>
            <ArrowRight
              animate
              animateOnView
              animateOnHover
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 flex">
            <CampaignCard {...hero} coverImage={hero.coverImage || ""} isHero className="flex-1" />
          </div>

          <div className="flex flex-col gap-8">
            {rightTwoByTwo.slice(0, 2).map((c) => (
              <CampaignCard key={c.id} {...c} coverImage={c.coverImage || ""} className="flex-1" />
            ))}
          </div>
        </div>

        <div className="mt-20 relative pb-8">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop
            speed={1800}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !w-4 !h-2 !rounded-full !bg-orange-200 !opacity-100 transition-all duration-300',
              bulletActiveClass: 'swiper-pagination-bullet-active !w-10 !bg-gradient-to-r !from-[#E77731] !to-[#ad4e28]',
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-12"
          >
            {bottomSliderList.map((c) => (
              <SwiperSlide key={`bottom-${c.id}`}>
                <CampaignCard {...c} coverImage={c.coverImage || ""} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
