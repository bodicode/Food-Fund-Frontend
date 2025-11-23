"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { donationService } from "@/services/donation.service";
import { MyDonationsData } from "@/types/api/donation";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { getStatusColorClass, translateTransactionStatus } from "@/lib/utils/status-utils";
import { createCampaignSlug } from "@/lib/utils/slug-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DonationDetailDialog } from "@/components/profile/donation-detail-dialog";
import {
  Heart,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";

export function HistoryTab() {
  const router = useRouter();
  const [data, setData] = useState<MyDonationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

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
    const label = translateTransactionStatus(status);
    const colorClass = getStatusColorClass(status);

    const iconMap: Record<string, React.ReactNode> = {
      SUCCESS: <CheckCircle className="w-3 h-3" />,
      PENDING: <Clock className="w-3 h-3" />,
      PROCESSING: <Clock className="w-3 h-3" />,
      FAILED: <XCircle className="w-3 h-3" />,
      CANCELLED: <XCircle className="w-3 h-3" />,
    };

    const icon = iconMap[status.toUpperCase()] || <Clock className="w-3 h-3" />;

    return (
      <Badge className={`${colorClass} flex items-center gap-1 border`}>
        {icon}
        {label}
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
            {data.donations.map((item, index) => (
              <div
                key={item.donation.id || `${item.orderCode}-${index}`}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-gray-900">
                        Mã đơn: {item.orderCode}
                      </div>
                      {getStatusBadge(item.transactionStatus || item.donation.status)}
                      {item.donation.isAnonymous && (
                        <Badge variant="outline" className="text-xs">
                          Ẩn danh
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(item.donation.transactionDatetime)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Số tiền ủng hộ:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Đã nhận:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {formatCurrency(item.receivedAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrderCode(item.orderCode);
                          setDetailDialogOpen(true);
                        }}
                        className="text-xs"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/campaign/${item.donation.campaignId}`)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Xem chiến dịch
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#ad4e28]">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">VNĐ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donation Detail Dialog */}
      {selectedOrderCode && (
        <DonationDetailDialog
          orderCode={selectedOrderCode}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      )}
    </div>
  );
}
