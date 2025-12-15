"use client";

import React, { useState, useEffect } from "react";
import { donationService } from "@/services/donation.service";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Heart } from "lucide-react";

interface DonationListProps {
  campaignId: string;
}

interface Donation {
  amount: number;
  donorName: string;
  transactionDatetime: string;
}

export function DonationList({ campaignId }: DonationListProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"HIGHEST_AMOUNT" | "LOWEST_AMOUNT" | "NEWEST" | "OLDEST">("NEWEST");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchDonations = React.useCallback(async () => {
    setLoading(true);
    try {
      // Client-side pagination workaround: Fetch larger batch to get correct total
      // The backend seems to return totalDonations capped by limit, so we fetch more to calculate pages locally
      const { donations: data } = await donationService.searchDonations({
        campaignId,
        limit: 50,
        page: 1,
        query: debouncedSearchQuery || null,
        sortBy: sortBy,
        minAmount: null,
        maxAmount: null,
      });

      setTotalItems(data.length);
      setTotalPages(Math.ceil(data.length / limit));

      // Slice data for current page
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      setDonations(data.slice(startIndex, endIndex));
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  }, [campaignId, sortBy, debouncedSearchQuery, page, limit]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  if (loading && donations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm người ủng hộ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(val) => {
            setSortBy(val as "HIGHEST_AMOUNT" | "LOWEST_AMOUNT" | "NEWEST" | "OLDEST");
            setPage(1); // Reset to first page on sort change
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEWEST">Mới nhất</SelectItem>
            <SelectItem value="OLDEST">Cũ nhất</SelectItem>
            <SelectItem value="HIGHEST_AMOUNT">Số tiền cao nhất</SelectItem>
            <SelectItem value="LOWEST_AMOUNT">Số tiền thấp nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Donation List */}
      {donations.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có lượt ủng hộ nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((donation, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-semibold text-gray-900">
                    {donation.donorName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(new Date(donation.transactionDatetime))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-[#ad4e28]">
                  {formatCurrency(donation.amount)}
                </div>
                <div className="text-xs text-gray-500">VNĐ</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}

      {/* Summary */}
      {donations.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị: <span className="font-semibold">{donations.length}</span> / <span className="font-semibold">{totalItems}</span> kết quả
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
