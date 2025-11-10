"use client";

import React, { useState, useEffect } from "react";
import { ingredientRequestService } from "@/services/ingredient-request.service";
import { IngredientRequest, IngredientRequestStatus } from "@/types/api/ingredient-request";
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
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Filter,
  User,
  Calendar,
} from "lucide-react";
import { AdminIngredientRequestDetailDialog } from "@/components/admin";

const statusConfig: Record<
  IngredientRequestStatus,
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

export default function AdminIngredientRequestsPage() {
  const [requests, setRequests] = useState<IngredientRequest[]>([]);
  const [allRequests, setAllRequests] = useState<IngredientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<IngredientRequestStatus | "ALL">("ALL");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const fetchAllRequests = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await ingredientRequestService.getIngredientRequests({
        filter: {
          status: statusFilter === "ALL" ? null : statusFilter,
        },
        limit: 1000,
        offset: 0,
      });
      setAllRequests(data);
    } catch (error) {
      console.error("Error fetching ingredient requests:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const paginateRequests = React.useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setRequests(allRequests.slice(startIndex, endIndex));
  }, [allRequests, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  useEffect(() => {
    paginateRequests();
  }, [paginateRequests]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchAllRequests();
  };

  const handleRequestUpdated = () => {
    fetchAllRequests();
  };

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter((r) => r.status === "PENDING").length,
    approved: allRequests.filter((r) => r.status === "APPROVED").length,
    rejected: allRequests.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="lg:container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý Yêu cầu Nguyên liệu
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Duyệt và quản lý các yêu cầu mua nguyên liệu từ người bếp
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Filter className="w-3 h-3 mr-1" />
            {allRequests.length} yêu cầu
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
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                  {stats.pending}
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
                  {stats.approved}
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
                  {stats.rejected}
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

      {/* Request List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-12 h-12 animate-spin text-[#ad4e28]" />
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Không có yêu cầu nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;

            return (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className={`${status.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(request.created_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Người bếp</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {request.kitchenStaff.full_name}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Giai đoạn</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {request.campaignPhase.phaseName}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Tổng chi phí</div>
                          <div className="text-lg font-bold text-[#ad4e28] dark:text-orange-500">
                            {formatCurrency(request.totalCost)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequestId(request.id)}
                      className="gap-2 ml-4"
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
      {allRequests.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={allRequests.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      {/* Detail Dialog */}
      {selectedRequestId && (
        <AdminIngredientRequestDetailDialog
          isOpen={!!selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          requestId={selectedRequestId}
          onUpdated={handleRequestUpdated}
        />
      )}
    </div>
  );
}
