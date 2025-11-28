"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { donationStatementService } from "@/services/donation-statement.service";
import { CampaignDonationStatement } from "@/types/api/donation-statement";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { translatePaymentStatus, getStatusColorClass } from "@/lib/utils/status-utils";
import { getCampaignIdFromSlug } from "@/lib/utils/slug-utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function CampaignStatementPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const [statement, setStatement] = useState<CampaignDonationStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        setLoading(true);
        // Get actual campaign ID from sessionStorage
        const campaignId = getCampaignIdFromSlug(slug);

        if (!campaignId) {
          setError("Không tìm thấy chiến dịch");
          setLoading(false);
          return;
        }

        const data = await donationStatementService.getCampaignDonationStatement(campaignId);
        setStatement(data);
      } catch (err) {
        console.error("Error fetching statement:", err);
        setError("Không thể tải sao kê tài khoản");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStatement();
    }
  }, [slug]);

  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateTime;
    }
  };

  const getStatusBadge = (status: string) => {
    const label = translatePaymentStatus(status);
    const className = getStatusColorClass(status);

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77731] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải sao kê...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !statement) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error || "Không tìm thấy sao kê"}</p>
          <Button onClick={() => router.back()} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-22 pb-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <div className="bg-color-base rounded-2xl shadow-sm border p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#E77731]/10 p-3 rounded-xl">
                  <FileText className="w-8 h-8 text-[#E77731]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Sao kê tài khoản
                  </h1>
                  <p className="text-gray-600 mb-1">{statement.campaignTitle}</p>
                </div>
              </div>

              <Button className="bg-[#E77731] hover:bg-[#ad4e28] text-white">
                <Download className="w-4 h-4 mr-2" />
                Tải xuống
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-color-base rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Tổng tiền nhận được</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(statement.totalReceived)}
            </p>
          </div>

          <div className="bg-color-base rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Tổng số giao dịch</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {statement.totalDonations}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-color-base rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Chi tiết giao dịch ({statement.transactions.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Người ủng hộ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nhận được
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cổng thanh toán
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mã giao dịch
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {statement.transactions.map((transaction, index) => (
                  <tr key={`${transaction.donationId}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(transaction.transactionDateTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{transaction.donorName}</p>
                        {transaction.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(transaction.receivedAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{transaction.gateway}</p>
                        {transaction.bankName && (
                          <p className="text-xs text-gray-500">{transaction.bankName}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {transaction.orderCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {statement.transactions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Chưa có giao dịch nào</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
