"use client";

import { useLayoutEffect, useRef, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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

import { campaignService } from "@/services/campaign.service";
import { categoryService } from "@/services/category.service";
import { CategoryStats } from "@/types/api/category";
import type { Campaign, CampaignStatus, SearchCampaignInput } from "@/types/api/campaign";
import { titleToSlug } from "@/lib/utils/slug-utils";

gsap.registerPlugin(ScrollTrigger);

export default function CampaignSearchPage() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categoriesStats, setCategoriesStats] = useState<CategoryStats[]>([]);
  const [totalSystemCampaigns, setTotalSystemCampaigns] = useState<number>(0);

  // Search State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filter State - Initialized from URL or defaults
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchParams.get("q") || "");
  const [categoryId, setCategoryId] = useState<string | null>(searchParams.get("category") || null);
  const [status, setStatus] = useState<CampaignStatus | "ALL">((searchParams.get("status") as CampaignStatus | "ALL") || "ACTIVE");
  const [sortBy, setSortBy] = useState<SearchCampaignInput["sortBy"]>((searchParams.get("sort") as SearchCampaignInput["sortBy"]) || "MOST_DONATED");

  // Fetch Categories Stats
  useEffect(() => {
    categoryService.getCampaignCategoriesStats().then((stats) => {
      setCategoriesStats(stats);
      const total = stats.reduce((sum, category) => sum + category.campaignCount, 0);
      setTotalSystemCampaigns(total);
    });
  }, []);

  // Auto-focus search input
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Sync URL to State
  useEffect(() => {
    const catSlugFromUrl = searchParams.get("category");
    if (catSlugFromUrl && categoriesStats.length > 0) {
      const foundCat = categoriesStats.find(c => titleToSlug(c.title) === catSlugFromUrl);
      setCategoryId(foundCat ? foundCat.id : null);
    } else if (!catSlugFromUrl) {
      setCategoryId(null);
    }

    const queryFromUrl = searchParams.get("q");
    setSearchText(queryFromUrl || "");
    setDebouncedSearchText(queryFromUrl || "");

    const statusFromUrl = searchParams.get("status");
    setStatus((statusFromUrl as CampaignStatus | "ALL") || "ACTIVE");

    const sortFromUrl = searchParams.get("sort");
    setSortBy((sortFromUrl as SearchCampaignInput["sortBy"]) || "MOST_DONATED");
  }, [searchParams, categoriesStats]);

  // Helper to update URL
  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }, [searchParams, pathname, router]);

  // Debounce Search Text Update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== (searchParams.get("q") || "")) {
        updateParams({ q: searchText });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText, searchParams, updateParams]);

  // Fetch Campaigns
  const fetchCampaigns = async (isLoadMore = false) => {
    const currentPage = isLoadMore ? page + 1 : 1;
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const result = await campaignService.searchCampaigns({
        limit: 9,
        page: currentPage,
        query: debouncedSearchText,
        sortBy: sortBy,
        categoryId: categoryId === "ALL" ? null : categoryId,
        status: status === "ALL" ? null : status,
      });

      if (result) {
        if (isLoadMore) {
          setCampaigns((prev) => [...prev, ...result.items]);
        } else {
          setCampaigns(result.items);
        }
        setPage(result.page);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error searching campaigns:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Trigger fetch when filters change (State changes)
  useEffect(() => {
    fetchCampaigns(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText, categoryId, status, sortBy]);

  // GSAP Animation for cards
  useLayoutEffect(() => {
    if (!cardsRef.current || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".campaign-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          clearProps: "all"
        }
      );
    }, cardsRef);
    return () => ctx.revert();
  }, [campaigns, loading]);

  return (
    <div className="lg:container mx-auto px-4 py-32 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-color mb-6">
          Tìm kiếm chiến dịch
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            {/* Category Filter */}
            <Select
              value={categoryId || "ALL"}
              onValueChange={(val) => {
                if (val === "ALL") {
                  updateParams({ category: null });
                } else {
                  const cat = categoriesStats.find(c => c.id === val);
                  if (cat) {
                    updateParams({ category: titleToSlug(cat.title) });
                  }
                }
              }}
            >
              <SelectTrigger className="w-[200px] border rounded-md px-3 py-2 text-sm bg-white">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>Tất cả danh mục</span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {totalSystemCampaigns}
                    </span>
                  </div>
                </SelectItem>
                {categoriesStats.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span>{cat.title}</span>
                      <span className="px-2 py-0.5 text-xs bg-brown-color text-white rounded-full">
                        {cat.campaignCount}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={sortBy || "MOST_DONATED"}
              onValueChange={(val) => updateParams({ sort: val })}
            >
              <SelectTrigger className="w-[200px] border rounded-md px-3 py-2 text-sm bg-white">
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

            {/* Status Filter */}
            <Select
              value={status}
              onValueChange={(val) => updateParams({ status: val })}
            >
              <SelectTrigger className="w-[180px] border rounded-md px-3 py-2 text-sm bg-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Đang gây quỹ</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="PROCESSING">Đang trong tiếng trình</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              </SelectContent>
            </Select>

            <RotateCw
              className={`w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors ${loading ? "animate-spin" : ""}`}
              onClick={() => {
                // Reset all filters by pushing pathname without query params
                router.push(pathname);
                // Also reset local search text state immediately for better UX
                setSearchText("");
              }}
            />
          </div>

          {/* Search Input */}
          <div className="relative w-full max-w-sm">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm tên chiến dịch..."
              className="w-full rounded-md border pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all shadow-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParams({ q: searchText });
                }
              }}
            />
            {searchText && (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setSearchText("");
                  updateParams({ q: "" });
                }}
              >
                <span className="text-xs font-bold">✕</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 min-h-[400px] content-start">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[380px] bg-gray-100 rounded-2xl animate-pulse" />
          ))
        ) : campaigns.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium">Không tìm thấy chiến dịch nào</p>
            <p className="text-sm text-gray-400 mt-2">
              Thử thay đổi từ khóa hoặc bộ lọc xem sao nhé.
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

      {/* Load More Button */}
      {page < totalPages && !loading && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={() => fetchCampaigns(true)}
            disabled={loadingMore}
            className="px-8 py-6 rounded-full btn-color text-base font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-w-[160px]"
          >
            {loadingMore ? (
              <div className="flex items-center gap-2">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Đang tải...</span>
              </div>
            ) : (
              "Xem thêm chiến dịch"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
