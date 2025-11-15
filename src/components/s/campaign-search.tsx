"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
import { CategoryStats } from "@/types/api/category";
import { Campaign, CampaignStatus } from "@/types/api/campaign";
import { useCampaigns } from "@/hooks/use-campaign";

gsap.registerPlugin(ScrollTrigger);

export default function CampaignSearchPage() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const [categoriesStats, setCategoriesStats] = useState<CategoryStats[]>([]);
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  
  useEffect(() => {
    categoryService.getCampaignCategoriesStats().then((stats) => {
      setCategoriesStats(stats);
      // Calculate total campaigns across all categories
      const total = stats.reduce((sum, category) => sum + category.campaignCount, 0);
      setTotalCampaigns(total);
    });
  }, []);

  const { campaigns, loading, hasMore, params, setParams, fetchCampaigns } =
    useCampaigns({ limit: 9, offset: 0, sortBy: "MOST_DONATED" });

  // Local state for debounced search input
  const [searchText, setSearchText] = useState<string>("");
  useEffect(() => {
    setSearchText(params.search || "");
  }, [params.search]);

  // Debounce: trigger search after user stops typing
  useEffect(() => {
    const h = setTimeout(() => {
      if (searchText !== params.search) {
        setParams((prev) => ({ ...prev, search: searchText }));
        fetchCampaigns({ search: searchText, offset: 0 });
      }
    }, 400);
    return () => clearTimeout(h);
  }, [searchText, params.search, setParams, fetchCampaigns]);

  // Handle category filter from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== params.filter?.categoryId) {
      const newFilter = {
        ...params.filter,
        categoryId: categoryFromUrl,
      };
      setParams((prev) => ({ ...prev, filter: newFilter }));
      fetchCampaigns({ filter: newFilter, offset: 0 });
    }
  }, [searchParams, params.filter, setParams, fetchCampaigns]);

  // Custom sorting function for campaigns when showing all statuses
  const sortCampaignsByStatus = (campaigns: Campaign[]) => {
    const statusPriority = {
      'ACTIVE': 1,
      'APPROVED': 2,
      'COMPLETED': 3,
      'PENDING': 4
    };

    return [...campaigns].sort((a, b) => {
      const priorityA = statusPriority[a.status as keyof typeof statusPriority] || 999;
      const priorityB = statusPriority[b.status as keyof typeof statusPriority] || 999;
      return priorityA - priorityB;
    });
  };

  // Apply custom sorting when showing all statuses ONLY if no explicit sortBy provided
  const displayCampaigns = (!params.filter?.status || params.filter.status.length === 0)
    && !params.sortBy
      ? sortCampaignsByStatus(campaigns)
      : campaigns;

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
  }, [displayCampaigns]);

  return (
    <div className="lg:container mx-auto px-4 py-32">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-color mb-6">
          Danh sách chiến dịch gây quỹ
        </h1>

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
                <SelectItem value="ALL">
                  <div className="flex items-center justify-between w-full">
                    <span>Tất cả danh mục</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {totalCampaigns}
                    </span>
                  </div>
                </SelectItem>
                {categoriesStats.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{cat.title}</span>
                      <span className="ml-2 px-2 py-0.5 text-xs bg-brown-color text-white rounded-full">
                        {cat.campaignCount}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={params.sortBy || "MOST_DONATED"}
              onValueChange={(val) => {
                const newSort = val as typeof params.sortBy;
                setParams((prev) => ({ ...prev, sortBy: newSort }));
                fetchCampaigns({ sortBy: newSort, offset: 0 });
              }}
            >
              <SelectTrigger className="w-[220px] border rounded-md px-3 py-2 text-sm">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOST_DONATED">Nhiều ủng hộ nhất</SelectItem>
                <SelectItem value="LEAST_DONATED">Ít ủng hộ nhất</SelectItem>
                <SelectItem value="NEWEST_FIRST">Mới nhất</SelectItem>
                <SelectItem value="OLDEST_FIRST">Cũ nhất</SelectItem>
                <SelectItem value="TARGET_AMOUNT_ASC">Mục tiêu tăng dần</SelectItem>
                <SelectItem value="TARGET_AMOUNT_DESC">Mục tiêu giảm dần</SelectItem>
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
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                {/* <SelectItem value="PENDING">Chờ duyệt</SelectItem> */}
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
              className="w-full rounded-md border pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setParams((prev) => ({ ...prev, search: searchText }));
                  fetchCampaigns({ search: searchText, offset: 0 });
                }
              }}
            />
            {searchText && (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base leading-none"
                onClick={() => {
                  setSearchText("");
                  setParams((prev) => ({ ...prev, search: "" }));
                  fetchCampaigns({ search: "", offset: 0 });
                }}
              >
                x
              </button>
            )}
          </div>
        </div>
      </div>

      <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {displayCampaigns.length === 0 && !loading ? (
          <div className="col-span-full text-center py-16 text-gray-500">
            <p className="text-lg font-medium">Không tìm thấy chiến dịch nào</p>
            <p className="text-sm text-gray-400 mt-2">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác nhé.
            </p>
          </div>
        ) : (
          displayCampaigns.map((c) => (
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
                true
              )
            }
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
