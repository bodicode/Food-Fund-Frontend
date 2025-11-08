"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { donationService } from "@/services/donation.service";
import { MyDonationsData } from "@/types/api/donation";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export function HistoryTab() {
  const router = useRouter();
  const [data, setData] = useState<MyDonationsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const result = await donationService.getMyDonations({
        skip: 0,
        take: 50,
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      SUCCESS: { 
        label: "Thành công", 
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />
      },
      PENDING: { 
        label: "Đang xử lý", 
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <Clock className="w-3 h-3" />
      },
      FAILED: { 
        label: "Thất bại", 
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="w-3 h-3" />
      },
    };

    const statusInfo = statusMap[status] || statusMap.PENDING;

    return (
      <Badge className={`${statusInfo.color} flex items-center gap-1 border`}>
        {statusInfo.icon}
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không thể tải dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(data.totalAmount)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Tổng số tiền đã ủng hộ</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.totalSuccessDonations}
          </div>
          <div className="text-sm text-gray-600 mt-1">Lượt ủng hộ thành công</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.totalDonatedCampaigns}
          </div>
          <div className="text-sm text-gray-600 mt-1">Chiến dịch đã ủng hộ</div>
        </div>
      </div>

      {/* Donations List */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-[#ad4e28]">Lịch sử ủng hộ</h2>
          <p className="text-sm text-gray-600 mt-1">
            Danh sách các lần ủng hộ của bạn
          </p>
        </div>

        {data.donations.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Bạn chưa có lượt ủng hộ nào</p>
            <Button
              onClick={() => router.push("/s")}
              className="mt-4 bg-[#ad4e28] hover:bg-[#9c4624]"
            >
              Khám phá chiến dịch
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {data.donations.map((donation) => (
              <div
                key={donation.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-gray-900">
                        Mã đơn: {donation.orderCode}
                      </div>
                      {getStatusBadge(donation.status)}
                      {donation.isAnonymous && (
                        <Badge variant="outline" className="text-xs">
                          Ẩn danh
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(donation.transactionDatetime)}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/campaign/${donation.campaignId}`)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Xem chiến dịch
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#ad4e28]">
                      {formatCurrency(donation.amount)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">VNĐ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
