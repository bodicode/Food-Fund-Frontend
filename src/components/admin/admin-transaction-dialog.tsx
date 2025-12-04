"use client";

import { useEffect, useState } from "react";
import { walletService, WalletTransaction } from "@/services/wallet.service";
import { formatCurrency } from "@/lib/utils/currency-utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AdminTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    walletId: string | null;
}

const TRANSACTION_TYPE_MAP: Record<string, string> = {
    INCOMING_TRANSFER: "Tiền chuyển đến",
    WITHDRAWAL: "Tiền chuyển ra",
    WITHDRAW: "Tiền chuyển ra",
    DEPOSIT: "Nạp tiền",
    TRANSFER: "Chuyển khoản",
    INCOME: "Thu nhập",
    EXPENSE: "Chi tiêu",
    ADMIN_ADJUSTMENT: "Điều chỉnh",
};

const getTransactionTypeLabel = (type: string) => {
    return TRANSACTION_TYPE_MAP[type] || type;
};

export function AdminTransactionDialog({
    open,
    onOpenChange,
    walletId,
}: AdminTransactionDialogProps) {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

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

    // Fetch Transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!walletId || !open) return;

            setLoading(true);
            try {
                const response = await walletService.getWalletTransactions({
                    walletId,
                    page,
                    limit,
                    query: debouncedQuery || null,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    minAmount: debouncedMinAmount ? Number(debouncedMinAmount) : null,
                    maxAmount: debouncedMaxAmount ? Number(debouncedMaxAmount) : null,
                    transactionType: transactionType === "ALL" ? null : transactionType,
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
        open,
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lịch sử giao dịch hệ thống</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Filters */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Mô tả giao dịch..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="pl-9 bg-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Loại giao dịch</label>
                                <Select value={transactionType} onValueChange={setTransactionType}>
                                    <SelectTrigger className="bg-white">
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
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Sắp xếp</label>
                                <Select
                                    value={sortBy}
                                    onValueChange={(value) => setSortBy(value as "NEWEST" | "OLDEST" | "HIGHEST_AMOUNT" | "LOWEST_AMOUNT")}
                                >
                                    <SelectTrigger className="bg-white">
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
                                        className="bg-white"
                                    />
                                    <Input
                                        placeholder="Max"
                                        type="number"
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Từ ngày</label>
                                <DateInput
                                    value={startDate}
                                    onChange={setStartDate}
                                    placeholder="dd/MM/yyyy"
                                    className="bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Đến ngày</label>
                                <DateInput
                                    value={endDate}
                                    onChange={setEndDate}
                                    placeholder="dd/MM/yyyy"
                                    className="bg-white"
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    className="w-full bg-white"
                                    onClick={clearFilters}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
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
                        <div className="flex items-center justify-between">
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
            </DialogContent>
        </Dialog>
    );
}
