"use client";

import { useLayoutEffect, useRef, useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw } from "@/components/animate-ui/icons/rotate-cw";
import { CampaignCard } from "@/components/shared/campaign-card";
import gsap from "gsap";
import { SearchIcon } from "@/components/animate-ui/icons/search";
import { useSearchParams } from "next/navigation";
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Button } from "@/components/ui/button";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader } from "../animate-ui/icons/loader";
gsap.registerPlugin(ScrollTrigger);

const tabMap: Record<string, string> = {
  personal: "Cá nhân",
  organization: "Tổ chức",
};

export default function CampaignSearchPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState("Tổ chức");
  const cardsRef = useRef<HTMLDivElement>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 9;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (tabParam && tabMap[tabParam]) {
      setActiveTab(tabMap[tabParam]);
    }
  }, [tabParam]);

  const fetchCampaigns = useCallback(async (loadMore = false) => {
    try {
      setLoading(true);
      const data = await campaignService.getCampaigns({
        filter: { status: ["ACTIVE", "APPROVED"] },
        sortBy: "NEWEST_FIRST",
        limit,
        offset: loadMore ? offset : 0,
      });

      if (data && data.length > 0) {
        if (loadMore) {
          setCampaigns((prev) => [...prev, ...data]);
          setOffset((prev) => prev + limit);
        } else {
          setCampaigns(data);
          setOffset(limit);
        }
        if (data.length < limit) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, [offset, limit]);

  useEffect(() => {
    fetchCampaigns(false);
  }, [fetchCampaigns]);


  useLayoutEffect(() => {
    if (!cardsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".campaign-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
        }
      );
    }, cardsRef);
    return () => ctx.revert();
  }, [campaigns]);

  return (
    <div className="lg:container mx-auto px-4 py-32">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-color mb-6">
          Danh sách chiến dịch gây quỹ
        </h1>

        <div className="flex justify-center gap-6 mb-6">
          {["Tất cả", "Tổ chức", "Cá nhân"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-1 text-sm font-medium transition nav-hover-btn ${activeTab === tab ? "text-color" : "text-gray-500"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 -bottom-[2px] w-full h-[2px] bg-brown-color rounded"></span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[180px] border rounded-md px-3 py-2 text-sm">
                <SelectValue placeholder="Đang thực hiện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px] border rounded-md px-3 py-2 text-sm">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Giáo dục</SelectItem>
                <SelectItem value="health">Y tế</SelectItem>
                <SelectItem value="disaster">Cứu trợ thiên tai</SelectItem>
              </SelectContent>
            </Select>

            <RotateCw
              animate
              animateOnHover
              animateOnTap
              animateOnView
              className="w-5 h-5 text-gray-500"
            />
          </div>

          <div className="relative w-full max-w-sm">
            <SearchIcon
              animate
              animateOnView
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm tên chiến dịch"
              className="w-full rounded-md border pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
          </div>
        </div>
      </div>

      <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {campaigns.map((c) => (
          <div key={c.id} className="campaign-card">
            <CampaignCard {...c} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => fetchCampaigns(true)}
            disabled={loading}
            className="px-6 py-2 rounded-lg btn-color"
          >
            {loading ? (
              <Loader animate animateOnView className="h-4 w-4" />
            ) : (
              "Xem thêm"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
