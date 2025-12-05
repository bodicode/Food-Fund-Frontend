"use client";

import { useState, useEffect } from "react";
import { walletService, WalletTransaction } from "@/services/wallet.service";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

const TRANSACTION_TYPE_MAP: Record<string, string> = {
    INCOMING_TRANSFER: "Tiền chuyển đến",
    WITHDRAWAL: "Tiền chuyển ra",
    ADMIN_ADJUSTMENT: "Điều chỉnh",
};

const getTransactionTypeLabel = (type: string) => {
    return TRANSACTION_TYPE_MAP[type] || type;
};

export default function PlatformTransactionsPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [walletId, setWalletId] = useState<string | null>(null);

    // Filters
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [query, setQuery] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [minAmount, setMinAmount] = useState<string>("");
    const [maxAmount, setMaxAmount] = useState<string>("");
    const [transactionType, setTransactionType] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "HIGHEST_AMOUNT" | "LOWEST_AMOUNT">("NEWEST");

    const debouncedQuery = useDebounce(query, 500);
    const debouncedMinAmount = useDebounce(minAmount, 500);
    const debouncedMaxAmount = useDebounce(maxAmount, 500);

    // Fetch System Wallet ID
    useEffect(() => {
        const fetchSystemWallet = async () => {
            try {
                const wallet = await walletService.getSystemWallet();
                if (wallet) {
                    setWalletId(wallet.id);
                }
            } catch (error) {
                console.error("Failed to fetch system wallet:", error);
            }
        };
        fetchSystemWallet();
    }, []);

    // Fetch Transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!walletId) return;

            setLoading(true);
            try {
                const response = await walletService.getWalletTransactions({
                    walletId,
                    page,
                    limit,
                    query: debouncedQuery || null,
                    minAmount: debouncedMinAmount ? Number(debouncedMinAmount) : null,
                    maxAmount: debouncedMaxAmount ? Number(debouncedMaxAmount) : null,
                    sortBy,
                });

                if (response) {
                    setTransactions(response.items);
                    setTotal(response.total);
                    setTotalPages(response.totalPages);
                }
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [
        walletId,
        page,
        limit,
        debouncedQuery,
        startDate,
        endDate,
        debouncedMinAmount,
        debouncedMaxAmount,
        transactionType,
        sortBy,
    ]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const clearFilters = () => {
        setQuery("");
        setStartDate("");
        setEndDate("");
        setMinAmount("");
        setMaxAmount("");
        setTransactionType("ALL");
        setSortBy("NEWEST");
        setPage(1);
    };

    if (!walletId && !loading) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p className="text-red-500">Không tìm thấy ví hệ thống.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 mt-20">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">Giao dịch hệ thống</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Lịch sử giao dịch hệ thống</h1>
                <p className="text-gray-500 mt-2">
                    Theo dõi chi tiết các khoản thu chi của hệ thống Food Fund
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Mô tả giao dịch..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Loại giao dịch</label>
                        <Select value={transactionType} onValueChange={setTransactionType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả</SelectItem>
                                <SelectItem value="INCOME">Thu nhập</SelectItem>
                                <SelectItem value="EXPENSE">Chi tiêu</SelectItem>
                                <SelectItem value="DEPOSIT">Nạp tiền</SelectItem>
                                <SelectItem value="WITHDRAW">Rút tiền</SelectItem>
                                <SelectItem value="TRANSFER">Chuyển khoản</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Sắp xếp</label>
                        <Select
                            value={sortBy}
                            onValueChange={(value) => setSortBy(value as "NEWEST" | "OLDEST" | "HIGHEST_AMOUNT" | "LOWEST_AMOUNT")}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NEWEST">Mới nhất</SelectItem>
                                <SelectItem value="OLDEST">Cũ nhất</SelectItem>
                                <SelectItem value="HIGHEST_AMOUNT">Giá trị cao nhất</SelectItem>
                                <SelectItem value="LOWEST_AMOUNT">Giá trị thấp nhất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Khoảng tiền</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Min"
                                type="number"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                            />
                            <Input
                                placeholder="Max"
                                type="number"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Từ ngày</label>
                        <DateInput
                            value={startDate}
                            onChange={setStartDate}
                            placeholder="dd/MM/yyyy"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Đến ngày</label>
                        <DateInput
                            value={endDate}
                            onChange={setEndDate}
                            placeholder="dd/MM/yyyy"
                        />
                    </div> */}

                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={clearFilters}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Loại giao dịch</TableHead>
                            <TableHead className="text-right">Số tiền</TableHead>
                            <TableHead className="text-right">Số dư trước</TableHead>
                            <TableHead className="text-right">Số dư sau</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang tải dữ liệu...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    Không tìm thấy giao dịch nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        {new Date(tx.created_at).toLocaleDateString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </TableCell>
                                    <TableCell className="font-medium">{tx.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {getTransactionTypeLabel(tx.transactionType)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${tx.transactionType === "WITHDRAWAL" || tx.transactionType === "WITHDRAW"
                                        ? "text-red-600"
                                        : Number(tx.amount) > 0
                                            ? "text-emerald-600"
                                            : "text-gray-900"
                                        }`}>
                                        {formatCurrency(Number(tx.amount))}
                                    </TableCell>
                                    <TableCell className="text-right text-gray-500">
                                        {formatCurrency(Number(tx.balanceBefore))}
                                    </TableCell>
                                    <TableCell className="text-right text-gray-900">
                                        {formatCurrency(Number(tx.balanceAfter))}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-500">
                        Hiển thị {(page - 1) * limit + 1} đến {Math.min(page * limit, total)} trong số {total} giao dịch
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Trước
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            Sau
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
