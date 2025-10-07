"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSearchParams } from "next/navigation";

import { CampaignCard } from "@/components/shared/campaign-card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { SearchIcon } from "@/components/animate-ui/icons/search";
import { RotateCw } from "@/components/animate-ui/icons/rotate-cw";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { categoryService } from "@/services/category.service";
import { Category } from "@/types/api/category";
import { CampaignStatus } from "@/types/api/campaign";
import { useCampaigns } from "@/hooks/use-campaign";

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

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  const {
    campaigns,
    loading,
    hasMore,
    params,
    setParams,
    fetchCampaigns,
  } = useCampaigns({ limit: 9, offset: 0 });

  useEffect(() => {
    if (tabParam && tabMap[tabParam]) {
      setActiveTab(tabMap[tabParam]);
    }
  }, [tabParam]);

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
            <Select
              value={params.filter?.categoryId || "ALL"}
              onValueChange={(val) => {
                const newFilter = {
                  ...params.filter,
                  categoryId: val === "ALL" ? undefined : val,
                };
                setParams((prev) => ({ ...prev, filter: newFilter }));
                fetchCampaigns({ filter: newFilter, offset: 0 });
              }}
            >
              <SelectTrigger className="w-[200px] border rounded-md px-3 py-2 text-sm">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={params.filter?.status?.[0] || "ALL"}
              onValueChange={(val) => {
                const newFilter = {
                  ...params.filter,
                  status: val === "ALL" ? undefined : [val as CampaignStatus],
                };
                setParams((prev) => ({ ...prev, filter: newFilter }));
                fetchCampaigns({ filter: newFilter, offset: 0 });
              }}
            >
              <SelectTrigger className="w-[200px] border rounded-md px-3 py-2 text-sm">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>


            <RotateCw
              animate
              animateOnHover
              animateOnTap
              animateOnView
              className="w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => fetchCampaigns({ offset: 0 })}
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
              value={params.search || ""}
              onChange={(e) => {
                setParams((prev) => ({ ...prev, search: e.target.value }));
                fetchCampaigns({ search: e.target.value, offset: 0 });
              }}
            />
          </div>
        </div>
      </div>

      <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {campaigns.length === 0 && !loading ? (
          <div className="col-span-full text-center py-16 text-gray-500">
            <p className="text-lg font-medium">Không tìm thấy chiến dịch nào</p>
            <p className="text-sm text-gray-400 mt-2">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác nhé.
            </p>
          </div>
        ) : (
          campaigns.map((c) => (
            <div key={c.id} className="campaign-card">
              <CampaignCard {...c} coverImage={c.coverImage || ""} />
            </div>
          ))
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() =>
              fetchCampaigns(
                {
                  offset: (params.offset || 0) + (params.limit || 3),
                },
                true)
            }
            disabled={loading}
            className="px-6 py-2 rounded-lg btn-color"
          >
            {loading ? <Loader animate animateOnView className="h-4 w-4" /> : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  );
}
