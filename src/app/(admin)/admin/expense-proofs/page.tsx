"use client";

import React, { useState, useEffect } from "react";
import { expenseProofService } from "@/services/expense-proof.service";
import { ExpenseProof, ExpenseProofStatus } from "@/types/api/expense-proof";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Filter,
} from "lucide-react";
import { AdminExpenseProofDetailDialog } from "@/components/admin";

const statusConfig: Record<
  ExpenseProofStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  APPROVED: {
    label: "Đã duyệt",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Từ chối",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const ITEMS_PER_PAGE = 10;

export default function AdminExpenseProofsPage() {
  const [expenseProofs, setExpenseProofs] = useState<ExpenseProof[]>([]);
  const [allExpenseProofs, setAllExpenseProofs] = useState<ExpenseProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ExpenseProofStatus | "ALL">("ALL");
  const [selectedProofId, setSelectedProofId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalProofs: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await expenseProofService.getExpenseProofStats();
      if (data) setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchAllExpenseProofs = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseProofService.getExpenseProofs({
        filter: {
          campaignId: "",
          status: statusFilter === "ALL" ? null : statusFilter,
        },
        limit: 1000,
        offset: 0,
      });
      setAllExpenseProofs(data);
    } catch (error) {
      console.error("Error fetching expense proofs:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const paginateExpenseProofs = React.useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setExpenseProofs(allExpenseProofs.slice(startIndex, endIndex));
  }, [allExpenseProofs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchAllExpenseProofs();
  }, [fetchAllExpenseProofs]);

  useEffect(() => {
    paginateExpenseProofs();
  }, [paginateExpenseProofs]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchStats();
    fetchAllExpenseProofs();
  };

  const handleProofUpdated = () => {
    fetchStats();
    fetchAllExpenseProofs();
  };

  return (
    <div className="lg:container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý xét duyệt hóa đơn
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Duyệt và quản lý các hóa đơn từ bếp
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Filter className="w-3 h-3 mr-1" />
            {allExpenseProofs.length} chứng từ
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số yêu cầu</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalProofs}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">
                  {stats.pendingCount}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
                  {stats.approvedCount}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Từ chối</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-500 mt-1">
                  {stats.rejectedCount}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Lọc theo trạng thái:</span>
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val as typeof statusFilter)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expense Proof List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-12 h-12 animate-spin text-[#ad4e28]" />
        </div>
      ) : expenseProofs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Không có chứng từ nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {expenseProofs.map((proof) => {
            const status = statusConfig[proof.status];
            const StatusIcon = status.icon;

            return (
              <Card key={proof.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Mã yêu cầu: {proof.requestId}
                        </span>
                        <Badge className={`${status.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {formatDateTime(proof.created_at)}
                      </div>
                      <div className="text-xl font-bold text-[#ad4e28] dark:text-orange-500">
                        {formatCurrency(proof.amount)}
                      </div>
                      {proof.media && proof.media.length > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          📎 {proof.media.length} hình ảnh đính kèm
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProofId(proof.id)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Xem & Duyệt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {allExpenseProofs.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={allExpenseProofs.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {/* Detail Dialog */}
      {selectedProofId && (
        <AdminExpenseProofDetailDialog
          isOpen={!!selectedProofId}
          onClose={() => setSelectedProofId(null)}
          expenseProofId={selectedProofId}
          onUpdated={handleProofUpdated}
        />
      )}
    </div>
  );
}
