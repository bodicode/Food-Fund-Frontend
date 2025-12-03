"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { campaignService } from "@/services/campaign.service";
import { walletService, WalletTransaction, FundraiserWallet } from "@/services/wallet.service";
import { Campaign } from "@/types/api/campaign";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { getCampaignIdFromSlug } from "@/lib/utils/slug-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Wallet, ArrowUpDown, Search } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { translateWalletTransactionType } from "@/lib/translator";

export default function CampaignStatementPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [wallet, setWallet] = useState<FundraiserWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [campaignTitles, setCampaignTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionPage, setTransactionPage] = useState(1); // 1-indexed for backend
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<"HIGHEST_AMOUNT" | "LOWEST_AMOUNT" | "NEWEST" | "OLDEST">("NEWEST");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get actual campaign ID from slug
        const campaignId = getCampaignIdFromSlug(slug);

        if (!campaignId) {
          setError("Không tìm thấy chiến dịch");
          setLoading(false);
          return;
        }

        // 1. Fetch Campaign
        const campaignData = await campaignService.getCampaignById(campaignId);
        if (!campaignData) {
          setError("Không tìm thấy thông tin chiến dịch");
          setLoading(false);
          return;
        }
        setCampaign(campaignData);

        // 2. Fetch Wallet using organization representative ID (as userId)
        if (!campaignData.organization?.representative?.id) {
          setError("Không tìm thấy thông tin người đại diện tổ chức");
          setLoading(false);
          return;
        }

        const walletData = await walletService.getWallet(campaignData.organization.representative.id);

        if (walletData) {
          setWallet(walletData);

          // 3. Fetch Transactions using Wallet ID
          const limit = 10;
          const response = await walletService.getWalletTransactions({
            walletId: walletData.id,
            page: transactionPage,
            limit,
            sortBy: sortOrder,
            query: searchQuery || null
          });

          if (response) {
            setTransactions(response.items);
            setTotalPages(response.totalPages);

            // 4. Fetch Campaign Titles for transactions with campaignId
            const uniqueCampaignIds = Array.from(new Set(
              response.items
                .filter(t => t.campaignId)
                .map(t => t.campaignId)
            ));

            if (uniqueCampaignIds.length > 0) {
              const titles: Record<string, string> = {};
              await Promise.all(uniqueCampaignIds.map(async (id) => {
                try {
                  // Check if we already have the title from the main campaign
                  if (id === campaignData.id) {
                    titles[id] = campaignData.title;
                  } else {
                    const c = await campaignService.getCampaignById(id);
                    if (c) titles[id] = c.title;
                  }
                } catch (e) {
                  console.error(`Error fetching campaign ${id}`, e);
                }
              }));
              setCampaignTitles(prev => ({ ...prev, ...titles }));
            }
          }
        } else {
          console.log("No wallet data found");
        }

      } catch (err) {
        console.error("Error fetching statement data:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, transactionPage, sortOrder, searchQuery]);

  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateTime;
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) return;

    // Define headers
    const headers = [
      "Thời gian",
      "Loại giao dịch",
      "Mô tả",
      "Chiến dịch",
      "Số tiền",
      "Số dư trước",
      "Số dư sau"
    ];

    // Format data rows
    const rows = transactions.map(t => {
      const campaignTitle = t.campaignId && campaignTitles[t.campaignId]
        ? campaignTitles[t.campaignId]
        : "";

      return [
        formatDateTime(t.created_at),
        translateWalletTransactionType(t.transactionType),
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
        `"${campaignTitle.replace(/"/g, '""')}"`,
        t.amount,
        t.balanceBefore,
        t.balanceAfter
      ].join(",");
    });

    // Combine headers and rows with BOM for UTF-8 support
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sao-ke-vi-${format(new Date(), "dd-MM-yyyy")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "NEWEST": return "Mới nhất";
      case "OLDEST": return "Cũ nhất";
      case "HIGHEST_AMOUNT": return "Số tiền cao nhất";
      case "LOWEST_AMOUNT": return "Số tiền thấp nhất";
      default: return "Sắp xếp";
    }
  };

  if (loading && !campaign && transactions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E77731] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Không tìm thấy dữ liệu"}</p>
          <Button onClick={() => router.back()}>
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
            Quay lại chiến dịch
          </Button>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#E77731]/10 p-3 rounded-xl">
                  <Wallet className="w-8 h-8 text-[#E77731]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Sao kê ví nhà gây quỹ
                  </h1>
                  <p className="text-gray-600 mb-1 font-medium">{campaign.title}</p>
                  <p className="text-sm text-gray-500">
                    Tổ chức: {campaign.organization?.name}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm giao dịch..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setTransactionPage(1); // Reset to first page on search
                    }}
                    className="pl-10"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      {getSortLabel(sortOrder)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOrder("NEWEST")}>
                      Mới nhất
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("OLDEST")}>
                      Cũ nhất
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("HIGHEST_AMOUNT")}>
                      Số tiền cao nhất
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("LOWEST_AMOUNT")}>
                      Số tiền thấp nhất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  className="bg-[#E77731] hover:bg-[#ad4e28] text-white"
                  onClick={handleExport}
                  disabled={transactions.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Xuất sao kê
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Overview */}
        {wallet && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <div className="text-sm text-gray-500 mb-1">Số dư hiện tại</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(Number(wallet.balance))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <div className="text-sm text-gray-500 mb-1">Tổng thu</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(Number(wallet.totalIncome))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <div className="text-sm text-gray-500 mb-1">Tổng chi</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(Number(wallet.totalExpense))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <div className="text-sm text-gray-500 mb-1">Tổng giao dịch</div>
              <div className="text-2xl font-bold text-gray-900">
                {transactions.length}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Lịch sử giao dịch
            </h2>
          </div>

          <div className="p-0">
            {loading && transactions.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E77731]"></div>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Thời gian
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Loại giao dịch
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Mô tả
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Số dư trước
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Số dư sau
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(transaction.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={`border-0 ${transaction.transactionType === "ADMIN_ADJUSTMENT" || transaction.transactionType === "DEPOSIT"
                                ? "bg-green-100 text-green-800"
                                : transaction.transactionType === "WITHDRAW" || transaction.transactionType === "WITHDRAWAL"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                                }`}
                            >
                              {translateWalletTransactionType(transaction.transactionType)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex flex-col gap-1">
                              <span>{transaction.description}</span>
                              {transaction.campaignId && campaignTitles[transaction.campaignId] && (
                                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded w-fit">
                                  Chiến dịch: {campaignTitles[transaction.campaignId]}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                            <span
                              className={
                                transaction.transactionType === "ADMIN_ADJUSTMENT" || transaction.transactionType === "DEPOSIT"
                                  ? "text-green-600"
                                  : transaction.transactionType === "WITHDRAW" || transaction.transactionType === "WITHDRAWAL"
                                    ? "text-red-600"
                                    : "text-gray-900"
                              }
                            >
                              {transaction.transactionType === "ADMIN_ADJUSTMENT" || transaction.transactionType === "DEPOSIT" ? "+" : transaction.transactionType === "WITHDRAW" || transaction.transactionType === "WITHDRAWAL" ? "-" : ""}
                              {formatCurrency(Number(transaction.amount))}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                            {formatCurrency(Number(transaction.balanceBefore))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                            {formatCurrency(Number(transaction.balanceAfter))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          className={`border-0 ${transaction.transactionType === "ADMIN_ADJUSTMENT" || transaction.transactionType === "DEPOSIT"
                            ? "bg-green-100 text-green-800"
                            : transaction.transactionType === "WITHDRAW" || transaction.transactionType === "WITHDRAWAL"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {translateWalletTransactionType(transaction.transactionType)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(transaction.created_at)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Mô tả:</p>
                          <div className="text-xs text-gray-900 flex flex-col gap-1">
                            <span>{transaction.description}</span>
                            {transaction.campaignId && campaignTitles[transaction.campaignId] && (
                              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded w-fit">
                                Chiến dịch: {campaignTitles[transaction.campaignId]}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Số tiền:</span>
                          <span
                            className={`font-semibold ${transaction.transactionType === "ADMIN_ADJUSTMENT" || transaction.transactionType === "DEPOSIT"
                              ? "text-green-600"
                              : transaction.transactionType === "WITHDRAW" || transaction.transactionType === "WITHDRAWAL"
                                ? "text-red-600"
                                : "text-gray-900"
                              }`}
                          >
                            {transaction.transactionType === "ADMIN_ADJUSTMENT" || transaction.transactionType === "DEPOSIT" ? "+" : transaction.transactionType === "WITHDRAW" || transaction.transactionType === "WITHDRAWAL" ? "-" : ""}
                            {formatCurrency(Number(transaction.amount))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Số dư trước:</span>
                          <span className="text-xs text-gray-900">
                            {formatCurrency(Number(transaction.balanceBefore))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Số dư sau:</span>
                          <span className="text-xs text-gray-900">
                            {formatCurrency(Number(transaction.balanceAfter))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Trang {transactionPage} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(Math.max(1, transactionPage - 1))}
                      disabled={transactionPage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(transactionPage + 1)}
                      disabled={transactionPage >= totalPages}
                    >
                      Tiếp
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Wallet className="w-12 h-12 mb-2 opacity-20" />
                <p>Chưa có giao dịch nào</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
