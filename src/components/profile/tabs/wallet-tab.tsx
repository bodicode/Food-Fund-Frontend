"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { walletService, MyWallet, MyWalletStats, WalletTransaction } from "@/services/wallet.service";
import { translateRole } from "@/lib/translator";

export function WalletTab() {
    const [wallet, setWallet] = useState<MyWallet | null>(null);
    const [stats, setStats] = useState<MyWalletStats | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [transactionPage, setTransactionPage] = useState(0);

    const loadData = async () => {
        setLoading(true);
        try {
            const [walletData, statsData, transactionsData] = await Promise.all([
                walletService.getMyWallet(),
                walletService.getMyWalletStats(),
                walletService.getMyWalletTransactions(transactionPage * 10, 10),
            ]);

            if (walletData) setWallet(walletData);
            if (statsData) setStats(statsData);
            if (transactionsData?.getMyWalletTransactions?.transactions) {
                setTransactions(transactionsData.getMyWalletTransactions.transactions);
            }
        } catch (error) {
            console.error("Error loading wallet data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionPage]);

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ví của tôi</h2>
                    <p className="text-sm text-gray-600 mt-1">Quản lý ví và xem lịch sử giao dịch</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={loadData}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Làm mới</span>
                </Button>
            </div>

            {/* Wallet Stats */}
            <div className="space-y-4">
                {/* Top 3 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                                    Số dư khả dụng
                                </CardTitle>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Wallet className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                                {loading ? "..." : stats ? formatCurrency(Number(stats.availableBalance)) : "--"}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                                    Tổng nhận được
                                </CardTitle>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold text-green-600">
                                {loading ? "..." : stats ? formatCurrency(Number(stats.totalReceived)) : "--"}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                                    Tháng này
                                </CardTitle>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <DollarSign className="h-4 w-4 text-purple-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold text-purple-600">
                                {loading ? "..." : stats ? formatCurrency(Number(stats.thisMonthReceived)) : "--"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom 2 Cards - Centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:max-w-2xl lg:mx-auto">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                                    Đã rút
                                </CardTitle>
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold text-red-600">
                                {loading ? "..." : stats ? formatCurrency(Number(stats.totalWithdrawn)) : "--"}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                                    Số lần ủng hộ
                                </CardTitle>
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <DollarSign className="h-4 w-4 text-orange-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold text-orange-600">
                                {loading ? "..." : stats ? stats.totalDonations : "--"}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Wallet Info */}
            {wallet && (
                <Card className="border-0 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Thông tin ví</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Loại ví</p>
                                <Badge className="bg-blue-100 text-blue-800 border-0">
                                    {translateRole(wallet.walletType)}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Số dư hiện tại</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatCurrency(Number(wallet.balance))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                                <p className="text-sm text-gray-900">
                                    {new Date(wallet.createdAt).toLocaleDateString("vi-VN")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Cập nhật lần cuối</p>
                                <p className="text-sm text-gray-900">
                                    {new Date(wallet.updatedAt).toLocaleDateString("vi-VN")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Transactions */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Lịch sử giao dịch</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : transactions.length > 0 ? (
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
                                                Loại
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
                                        {transactions.map((transaction) => (
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
                                {transactions.map((transaction) => (
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

                                        <div className="space-y-2">
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
                                        disabled={transactions.length < 10}
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
        </div>
    );
}
