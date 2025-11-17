"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { walletService, FundraiserWallet, WalletTransaction } from "@/services/wallet.service";
import { translateRole } from "@/lib/translator";

export default function FundraiserWalletsPage() {
  const [fundraiserWallets, setFundraiserWallets] = useState<FundraiserWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [walletPage, setWalletPage] = useState(0);
  const [selectedWalletUserId, setSelectedWalletUserId] = useState<string | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [transactionPage, setTransactionPage] = useState(0);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const loadWallets = async () => {
    setLoading(true);
    try {
      const result = await walletService.getAllFundraiserWallets(walletPage * 10, 10);
      if (result?.getAllFundraiserWallets?.wallets) {
        setFundraiserWallets(result.getAllFundraiserWallets.wallets);
      }
    } catch (error) {
      console.error("Error loading wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWalletTransactions = async (userId: string) => {
    setLoadingTransactions(true);
    try {
      const result = await walletService.getFundraiserWalletWithTransactions(
        userId,
        transactionPage * 10,
        10
      );
      if (result?.getFundraiserWalletWithTransactions?.transactions) {
        setWalletTransactions(result.getFundraiserWalletWithTransactions.transactions);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    loadWallets();
  }, [walletPage]);

  useEffect(() => {
    if (selectedWalletUserId) {
      loadWalletTransactions(selectedWalletUserId);
    }
  }, [selectedWalletUserId, transactionPage]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="relative mt-6 sm:mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 p-5 sm:p-7 lg:p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Ví người gây quỹ
              </h1>
              <p className="text-purple-100 text-xs sm:text-sm md:text-base max-w-xl">
                Quản lý ví và giao dịch của người gây quỹ
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={loadWallets}
              disabled={loading}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="text-xs sm:text-sm">Làm mới</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Fundraiser Wallets Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Danh sách ví
              </CardTitle>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                Danh sách ví và số dư của người gây quỹ
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10 sm:py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : fundraiserWallets.length > 0 ? (
            <div className="space-y-3">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Người gây quỹ
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700">
                        Số dư
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Loại ví
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Ngày tạo
                      </th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundraiserWallets.map((wallet) => (
                      <tr
                        key={wallet.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {wallet.user.avatar_url && (
                              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                <Image
                                  src={wallet.user.avatar_url}
                                  alt={wallet.user.full_name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {wallet.user.full_name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                @{wallet.user.user_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-gray-600 truncate text-xs sm:text-sm">
                            {wallet.user.email}
                          </p>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(Number(wallet.balance))}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <Badge className="bg-blue-100 text-blue-800 border-0">
                            {translateRole(wallet.walletType)}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-500">
                          {new Date(wallet.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedWalletUserId(wallet.user.id)}
                          >
                            Xem giao dịch
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {fundraiserWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {wallet.user.avatar_url && (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={wallet.user.avatar_url}
                            alt={wallet.user.full_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {wallet.user.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          @{wallet.user.user_name}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Email:</span>
                        <span className="text-xs text-gray-900 truncate ml-2">
                          {wallet.user.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Số dư:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(Number(wallet.balance))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Loại ví:</span>
                        <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">
                          {wallet.walletType}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Ngày tạo:</span>
                        <span className="text-xs text-gray-500">
                          {new Date(wallet.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedWalletUserId(wallet.user.id)}
                    >
                      Xem giao dịch
                    </Button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-xs sm:text-sm text-gray-600">
                  Trang {walletPage + 1}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWalletPage(Math.max(0, walletPage - 1))}
                    disabled={walletPage === 0}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWalletPage(walletPage + 1)}
                    disabled={fundraiserWallets.length < 10}
                  >
                    Tiếp
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-gray-400">
              <Users className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">Chưa có ví người gây quỹ nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet Transactions */}
      {selectedWalletUserId && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  Giao dịch ví
                </CardTitle>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                  Danh sách giao dịch của người gây quỹ
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedWalletUserId(null);
                setWalletTransactions([]);
                setTransactionPage(0);
              }}
            >
              ✕
            </Button>
          </CardHeader>
          <CardContent>
            {loadingTransactions ? (
              <div className="flex items-center justify-center py-10">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : walletTransactions.length > 0 ? (
              <div className="space-y-3">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">
                          Ngày
                        </th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">
                          Loại giao dịch
                        </th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">
                          Mô tả
                        </th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-700">
                          Số tiền
                        </th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">
                          Gateway
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-3 text-xs text-gray-600">
                            {new Date(transaction.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              className={`border-0 ${transaction.transactionType === "DEPOSIT"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                              {transaction.transactionType}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-xs text-gray-600 truncate max-w-xs">
                            {transaction.description}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-gray-900">
                            <span
                              className={
                                transaction.transactionType === "DEPOSIT"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {transaction.transactionType === "DEPOSIT" ? "+" : "-"}
                              {formatCurrency(Number(transaction.amount))}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-xs text-gray-600">
                            {transaction.gateway}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {walletTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge
                          className={`border-0 ${transaction.transactionType === "DEPOSIT"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {transaction.transactionType}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Mô tả:</p>
                          <p className="text-xs text-gray-900 line-clamp-2">
                            {transaction.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Số tiền:</span>
                          <span
                            className={`font-semibold ${transaction.transactionType === "DEPOSIT"
                                ? "text-green-600"
                                : "text-red-600"
                              }`}
                          >
                            {transaction.transactionType === "DEPOSIT" ? "+" : "-"}
                            {formatCurrency(Number(transaction.amount))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Gateway:</span>
                          <span className="text-xs text-gray-900">
                            {transaction.gateway}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Trang {transactionPage + 1}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(Math.max(0, transactionPage - 1))}
                      disabled={transactionPage === 0}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionPage(transactionPage + 1)}
                      disabled={walletTransactions.length < 10}
                    >
                      Tiếp
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <DollarSign className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Chưa có giao dịch nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
