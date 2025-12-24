"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CampaignCard } from "../shared/campaign-card";
import { Skeleton } from "../ui/skeleton";
import { campaignService } from "../../services/campaign.service";
import { ArrowRight } from "lucide-react";
import { Campaign } from "../../types/api/campaign";
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
          filter: { status: ["ACTIVE", "PROCESSING"] },
          sortBy: "MOST_DONATED",
          limit: 20,
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
        { y: 30, scale: 0.95, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".fc-hero", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".fc-card",
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: rootRef.current!,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [loading]); // Updated dependency

  if (loading) {
    return (
      <section className="pt-20 pb-12 bg-gray-50/50">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="mb-12 flex items-center justify-between">
            <Skeleton className="h-12 w-64 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[550px] w-full rounded-[2rem]" />
            </div>
            <div className="flex flex-col gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-[260px] w-full rounded-[2rem]" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!campaigns.length) {
    return (
      <div className="text-center py-24 text-gray-500 font-medium">
        Hiện chưa có chiến dịch nào đang hoạt động.
      </div>
    );
  }

  // Sort campaigns by donation count to get the most supported one as hero
  const sortedCampaigns = [...campaigns].sort(
    (a, b) => (b.donationCount || 0) - (a.donationCount || 0)
  );

  const [hero, ...rest] = sortedCampaigns.map(mapCampaignToCardProps);
  const rightTwoByTwo = rest.slice(0, 2); // Display 2 cards on the right
  const sliderCampaigns = rest.slice(2, 8); // Display next 6 in slider

  return (
    <section className="py-20 bg-gray-50/50">
      <div ref={rootRef} className="container mx-auto px-4 sm:px-8 max-w-[1600px]">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
              Chiến dịch <span className="text-[#E77731] underline decoration-[#E77731]/30 underline-offset-4">nổi bật</span>
            </h2>
            <p className="text-gray-500 text-lg hidden md:block">Các dự án đang nhận được nhiều sự quan tâm từ cộng đồng</p>
          </div>

          <Link
            href="/s"
            className="group flex items-center gap-2 text-[#E77731] font-bold text-sm md:text-base px-4 py-2 rounded-full hover:bg-[#E77731]/10 transition-all duration-300"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 mb-16">
          {/* Hero Card */}
          <div className="lg:col-span-2 h-full">
            <CampaignCard
              {...hero}
              coverImage={hero.coverImage || ""}
              isHero
              className="h-full"
            />
          </div>

          {/* Side Cards */}
          <div className="hidden lg:flex flex-col gap-8 h-full">
            {rightTwoByTwo.map((c) => (
              <CampaignCard
                key={c.id}
                {...c}
                coverImage={c.coverImage || ""}
                className="flex-1"
              />
            ))}
          </div>
        </div>

        {/* Slider Section */}
        {sliderCampaigns.length > 0 && (
          <div className="mt-12 relative w-full">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              loop
              speed={1000}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1440: { slidesPerView: 3 },
              }}
              className="pb-16 fc-swiper"
            >
              {sliderCampaigns.map((c) => (
                <SwiperSlide key={c.id} className="h-auto">
                  <div className="h-full py-4 px-1"> {/* Padding for hover effects */}
                    <CampaignCard {...c} coverImage={c.coverImage || ""} className="h-full" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
