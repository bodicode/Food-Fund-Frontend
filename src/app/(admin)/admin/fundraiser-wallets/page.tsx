"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  RefreshCw,
  ArrowUp,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Search,
  History,
  Info,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { formatCurrency } from "../../../../lib/utils/currency-utils";
import { walletService, FundraiserWallet, WalletTransaction } from "../../../../services/wallet.service";
import { translateRole, translateWalletTransactionType } from "../../../../lib/translator";
import { cn } from "../../../../lib/utils/utils";

export default function FundraiserWalletsPage() {
  const [fundraiserWallets, setFundraiserWallets] = useState<FundraiserWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [walletPage, setWalletPage] = useState(0);
  const [selectedWalletUserId, setSelectedWalletUserId] = useState<string | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [transactionPage, setTransactionPage] = useState(0);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const transactionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewTransactions = (userId: string) => {
    setSelectedWalletUserId(userId);
    setTransactionPage(0);
    setTimeout(() => {
      transactionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const loadWallets = useCallback(async () => {
    setLoading(true);
    try {
      const result = await walletService.getAllFundraiserWallets(walletPage * 10, 10);
      if (result?.getAllFundraiserWallets?.wallets) {
        setFundraiserWallets(result.getAllFundraiserWallets.wallets);
      }
    } catch (error) {
      console.error("Error loading wallets:", error);
      toast.error("Không thể tải danh sách ví");
    } finally {
      setLoading(false);
    }
  }, [walletPage]);

  const loadWalletTransactions = useCallback(async (userId: string) => {
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
      toast.error("Không thể tải lịch sử giao dịch");
    } finally {
      setLoadingTransactions(false);
    }
  }, [transactionPage]);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  useEffect(() => {
    if (selectedWalletUserId) {
      loadWalletTransactions(selectedWalletUserId);
    }
  }, [selectedWalletUserId, loadWalletTransactions]);

  const filteredWallets = useMemo(() => {
    if (!searchQuery.trim()) return fundraiserWallets;
    const q = searchQuery.toLowerCase();
    return fundraiserWallets.filter(w =>
      w.user.full_name.toLowerCase().includes(q) ||
      w.user.email.toLowerCase().includes(q) ||
      w.user.user_name.toLowerCase().includes(q)
    );
  }, [fundraiserWallets, searchQuery]);

  const selectedWallet = useMemo(() => {
    return fundraiserWallets.find(w => w.user.id === selectedWalletUserId);
  }, [fundraiserWallets, selectedWalletUserId]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#f8fafc]">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[150px]" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10 px-1">
        <div className="space-y-2 mt-8">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 px-4 py-1.5 rounded-full font-semibold shadow-sm">
            <Wallet className="w-3.5 h-3.5 mr-2" />
            Quản trị tài chính
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Ví <span className="text-indigo-600">Gây Quỹ</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl text-lg">
            Quản lý số dư, theo dõi biến động tài chính và kiểm soát lịch sử giao dịch của người gây quỹ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={loadWallets}
            disabled={loading}
            className="rounded-2xl h-14 px-6 font-semibold border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm bg-white"
          >
            <RefreshCw className={cn("w-5 h-5 mr-3", loading && "animate-spin")} />
            Làm mới danh sách
          </Button>
        </div>
      </div>


      {/* Table Section */}
      <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-xl rounded-[40px] overflow-hidden">
        <CardHeader className="p-8 pb-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">Danh sách ví</CardTitle>
              <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                Dữ liệu cập nhật thời gian thực
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group w-full sm:w-80">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input
                placeholder="Tìm theo tên hoặc email..."
                className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-indigo-100 focus:border-indigo-600 font-medium text-slate-900 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 font-semibold text-xs text-slate-400 uppercase tracking-widest">Người sở hữu</th>
                  <th className="px-8 py-6 font-semibold text-xs text-slate-400 uppercase tracking-widest">Loại ví</th>
                  <th className="px-8 py-6 font-semibold text-xs text-slate-400 uppercase tracking-widest text-right">Số dư</th>
                  <th className="px-8 py-6 font-semibold text-xs text-slate-400 uppercase tracking-widest text-right">Thu/Chi</th>
                  <th className="px-8 py-6 font-semibold text-xs text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="w-12 h-12 text-indigo-400 animate-spin" />
                        <p className="text-slate-400 font-medium uppercase tracking-tighter">Đang trích xuất dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredWallets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                          <Search className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-xl font-semibold text-slate-400">Không tìm thấy ví nào</h4>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWallets.map((wallet) => (
                    <motion.tr
                      key={wallet.id}
                      className={cn(
                        "hover:bg-slate-50/80 transition-all duration-300 group",
                        selectedWalletUserId === wallet.user.id && "bg-indigo-50/50"
                      )}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                            {wallet.user.avatar_url ? (
                              <Image src={wallet.user.avatar_url} alt={wallet.user.full_name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                {wallet.user.full_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{wallet.user.full_name}</span>
                            <span className="text-xs text-slate-400">{wallet.user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-slate-100 text-slate-600 font-semibold border-none rounded-lg px-2.5 shadow-none text-[10px]">
                          {translateRole(wallet.walletType)}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-lg font-semibold text-slate-900 font-mono">
                          {formatCurrency(Number(wallet.balance))}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-emerald-600 font-semibold text-xs">
                            +{formatCurrency(Number(wallet.totalIncome || 0))}
                          </span>
                          <span className="text-rose-500 font-semibold text-xs">
                            -{formatCurrency(Number(wallet.totalExpense || 0))}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleViewTransactions(wallet.user.id)}
                          className={cn(
                            "rounded-xl font-semibold text-xs transition-all active:scale-95",
                            selectedWalletUserId === wallet.user.id
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 shadow-none px-4"
                          )}
                        >
                          LỊCH SỬ
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>

        <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-400">
            Trang <span className="text-indigo-600 font-semibold">{walletPage + 1}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWalletPage(Math.max(0, walletPage - 1))}
              disabled={walletPage === 0}
              className="h-10 px-4 rounded-xl border-slate-200 font-semibold active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWalletPage(walletPage + 1)}
              disabled={fundraiserWallets.length < 10}
              className="h-10 px-4 rounded-xl border-slate-200 font-semibold active:scale-95"
            >
              Tiếp <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Transaction History */}
      <AnimatePresence>
        {selectedWalletUserId && (
          <motion.div
            ref={transactionsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="pt-10"
          >
            <Card className="border-none shadow-2xl bg-white rounded-[40px] overflow-hidden">
              <CardHeader className="p-10 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                    <History className="w-7 h-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Sao kê chi tiết</CardTitle>
                    <p className="text-slate-500 font-medium text-sm">
                      Chủ sở hữu: <span className="text-indigo-600 font-semibold">{selectedWallet?.user.full_name}</span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-slate-100 text-slate-400"
                  onClick={() => {
                    setSelectedWalletUserId(null);
                    setWalletTransactions([]);
                  }}
                >
                  <X className="w-6 h-6" />
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:divide-x divide-slate-100">
                  <div className="p-10 space-y-10">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tóm tắt ví</p>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-xs text-slate-500">Số dư</span>
                          <span className="text-sm font-bold text-indigo-600">{formatCurrency(Number(selectedWallet?.balance))}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-emerald-50/50 rounded-xl">
                          <span className="text-xs text-emerald-600">Tổng thu</span>
                          <span className="text-sm font-bold text-emerald-700">+{formatCurrency(Number(selectedWallet?.totalIncome))}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-rose-50/50 rounded-xl">
                          <span className="text-xs text-rose-500">Tổng chi</span>
                          <span className="text-sm font-bold text-rose-700">-{formatCurrency(Number(selectedWallet?.totalExpense))}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50">
                            <th className="px-8 py-4 font-semibold text-[10px] text-slate-400 uppercase tracking-widest">Thời gian</th>
                            <th className="px-8 py-4 font-semibold text-[10px] text-slate-400 uppercase tracking-widest">Loại</th>
                            <th className="px-8 py-4 font-semibold text-[10px] text-slate-400 uppercase tracking-widest">Mô tả</th>
                            <th className="px-8 py-4 font-semibold text-[10px] text-slate-400 uppercase tracking-widest text-right">Số tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {loadingTransactions ? (
                            <tr>
                              <td colSpan={4} className="py-20 text-center text-slate-400">Đang tải...</td>
                            </tr>
                          ) : walletTransactions.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-20 text-center text-slate-400">Không có giao dịch</td>
                            </tr>
                          ) : (
                            walletTransactions.map((tx) => (
                              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-4 text-xs font-medium text-slate-600">
                                  {new Date(tx.created_at).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' })}
                                </td>
                                <td className="px-8 py-4">
                                  <Badge className={cn(
                                    "px-2 py-0.5 rounded-lg border-none text-[10px] uppercase font-semibold",
                                    tx.transactionType === "INCOMING_TRANSFER" || tx.transactionType === "SURPLUS_TRANSFER" || tx.transactionType === "ADMIN_ADJUSTMENT" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                  )}>
                                    {translateWalletTransactionType(tx.transactionType)}
                                  </Badge>
                                </td>
                                <td className="px-8 py-4 text-xs font-medium text-slate-600">
                                  {tx.description}
                                </td>
                                <td className="px-8 py-4 text-right">
                                  <span className={cn(
                                    "text-sm font-bold font-mono",
                                    tx.transactionType === "INCOMING_TRANSFER" || tx.transactionType === "SURPLUS_TRANSFER" || tx.transactionType === "ADMIN_ADJUSTMENT" ? "text-emerald-600" : "text-rose-600"
                                  )}>
                                    {tx.transactionType === "INCOMING_TRANSFER" || tx.transactionType === "SURPLUS_TRANSFER" || tx.transactionType === "ADMIN_ADJUSTMENT" ? "+" : "-"}
                                    {formatCurrency(Number(tx.amount))}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTransactionPage(p => Math.max(0, p - 1))}
                        disabled={transactionPage === 0}
                        className="h-9 px-3"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTransactionPage(p => p + 1)}
                        disabled={walletTransactions.length < 10}
                        className="h-9 px-3"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Scroll Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-10 right-10 z-50"
          >
            <Button
              className="w-14 h-14 rounded-2xl shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-90"
              onClick={scrollToTop}
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
