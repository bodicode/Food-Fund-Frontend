"use client";

import React, { useState, useEffect } from "react";
import { donationService } from "@/services/donation.service";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Heart, User } from "lucide-react";

interface DonationListProps {
  campaignId: string;
}

interface Donation {
  amount: number;
  donorName: string;
  transactionDatetime: string;
}

type DonationSortField = "AMOUNT" | "TRANSACTION_DATE";
type SortOrder = "ASC" | "DESC";

export function DonationList({ campaignId }: DonationListProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<DonationSortField>("TRANSACTION_DATE");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  const fetchDonations = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await donationService.getCampaignDonations({
        campaignId,
        skip: 0,
        take: 50,
        sortBy,
        sortOrder,
        searchDonorName: searchQuery || undefined,
      });
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  }, [campaignId, sortBy, sortOrder, searchQuery]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleSearch = () => {
    fetchDonations();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm người ủng hộ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="bg-[#ad4e28] hover:bg-[#9c4624]">
          Tìm kiếm
        </Button>

        <Select value={sortBy} onValueChange={(val) => setSortBy(val as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TRANSACTION_DATE">Thời gian</SelectItem>
            <SelectItem value="AMOUNT">Số tiền</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={(val) => setSortOrder(val as typeof sortOrder)}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Giảm dần</SelectItem>
            <SelectItem value="ASC">Tăng dần</SelectItem>
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white">
                  <span className="font-semibold text-lg">
                    {donation.donorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {donation.donorName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(donation.transactionDatetime)}
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

      {/* Summary */}
      {donations.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Tổng số lượt ủng hộ: <span className="font-semibold">{donations.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
