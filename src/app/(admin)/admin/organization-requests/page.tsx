"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  X,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { organizationService } from "@/services/organization.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Organization, OrganizationStatus } from "@/types/api/organization";
import { statusConfig } from "@/lib/translator";
import { cn } from "@/lib/utils/utils";

export default function OrganizationRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState<Organization[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrganizationStatus>("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (order: "asc" | "desc" = sortOrder) => {
      try {
        setLoading(true);
        const data = await organizationService.getAllOrganizationRequests(
          order
        );
        setRaw(data);
      } catch (e) {
        console.error(e);
        toast.error("Không tải được danh sách yêu cầu tổ chức.");
      } finally {
        setLoading(false);
      }
    },
    [sortOrder]
  );

  useEffect(() => {
    fetchData("asc");
  }, [fetchData]);

  const filtered = useMemo(() => {
    let list = [...raw];

    if (status !== "ALL") {
      list = list.filter((r) => r.status === status);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        const rep = r.representative;
        return (
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          (r.website || "").toLowerCase().includes(q) ||
          (rep?.full_name || "").toLowerCase().includes(q) ||
          (rep?.email || "").toLowerCase().includes(q) ||
          (rep?.user_name || "").toLowerCase().includes(q) ||
          (r.phone_number || "").toLowerCase().includes(q)
        );
      });
    }

    list.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return list;
  }, [raw, search, status, sortOrder]);

  const getStatusCfg = (s: string) => {
    const cfg = statusConfig[s as keyof typeof statusConfig];
    return (
      cfg ?? {
        label: s,
        icon: Clock,
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        variant: "secondary" as const,
      }
    );
  };

  const onApprove = async (id: string) => {
    try {
      const updated = await organizationService.approveOrganizationRequest(id);
      setRaw((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success("Đã phê duyệt yêu cầu.");
    } catch (e) {
      console.error(e);
      toast.error("Phê duyệt thất bại. Vui lòng thử lại!");
    }
  };

  const onReject = async (id: string) => {
    try {
      const updated = await organizationService.rejectOrganizationRequest(id);
      setRaw((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success("Đã từ chối yêu cầu.");
    } catch (e) {
      console.error(e);
      toast.error("Từ chối thất bại. Vui lòng thử lại!");
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData(sortOrder);
      toast.success("Đã làm mới danh sách.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Yêu cầu tạo Tổ chức
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên, email, địa chỉ..."
              className="pl-9 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => setStatus(v as OrganizationStatus)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING">Đang chờ</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(v) => {
              const order = v as "asc" | "desc";
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Cũ → Mới</SelectItem>
              <SelectItem value="desc">Mới → Cũ</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={onRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={cn("w-4 h-4", refreshing && "animate-spin")}
            />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                "ID",
                "Tổ chức",
                "Thông tin đại diện",
                "Liên hệ",
                "Địa chỉ",
                "Website",
                "Trạng thái",
                "Ngày tạo",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="sticky top-0 z-10 text-left text-gray-700 dark:text-gray-200 text-sm font-semibold whitespace-nowrap px-4 py-3 bg-gray-200 dark:bg-[#334155] shadow-sm"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-sm">
                  Đang tải...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  Không có yêu cầu nào phù hợp.
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => {
                const cfg = getStatusCfg(r.status);
                const Icon = cfg.icon;

                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800",
                      idx % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-gray-50/70 dark:bg-slate-800/40"
                    )}
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {r.id}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold text-nowrap">
                          {r.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {r.description}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="leading-tight">
                        <div className="font-medium">
                          {r.representative?.full_name || "Người đại diện"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {r.representative?.email || "Email"}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{r.phone_number || "-"}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          @{r.representative?.user_name || "username"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className="line-clamp-1" title={r.address}>
                        {r.address}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {r.website ? (
                        <a
                          href={
                            r.website.startsWith("http")
                              ? r.website
                              : `https://${r.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sky-600 hover:underline"
                        >
                          {r.website}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                          cfg.color
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("vi-VN")}
                    </td>

                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/org-requests/${r.id}`}>
                          <Button variant="outline" size="sm" className="h-8">
                            Xem
                          </Button>
                        </Link>

                        {r.status === "PENDING" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                className="text-green-600 focus:text-green-700"
                                onClick={() => onApprove(r.id)}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Duyệt
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700"
                                onClick={() => onReject(r.id)}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Từ chối
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(r.id);
                                  toast.success("Đã copy ID.");
                                }}
                              >
                                Sao chép ID
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        {loading
          ? "Đang tải..."
          : `Hiển thị ${filtered.length}/${raw.length} yêu cầu`}
      </div>
    </div>
  );
}
