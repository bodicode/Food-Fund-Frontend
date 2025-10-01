"use client";

import { useState, useEffect } from "react";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/api/category";
import { Campaign } from "@/types/api/campaign";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Users,
    MapPin,
} from "lucide-react";
import Image from "next/image";
import { useCampaigns } from "@/hooks/use-campaign";

const statusConfig = {
    PENDING: { label: "Chờ duyệt", variant: "secondary" as const, icon: Clock },
    APPROVED: { label: "Đã duyệt", variant: "default" as const, icon: CheckCircle },
    ACTIVE: { label: "Đang hoạt động", variant: "default" as const, icon: CheckCircle },
    REJECTED: { label: "Từ chối", variant: "destructive" as const, icon: XCircle },
    COMPLETED: { label: "Hoàn thành", variant: "outline" as const, icon: CheckCircle },
    CANCELLED: { label: "Đã hủy", variant: "destructive" as const, icon: XCircle },
};

export default function AdminCampaignsPage() {
    const [categories, setCategories] = useState<Category[]>([]);

    const {
        campaigns,
        loading,
        error,
        params,
        setParams,
        fetchCampaigns,
    } = useCampaigns({ limit: 50, offset: 0 });

    useEffect(() => {
        categoryService.getCategories().then(setCategories);
    }, []);

    const formatCurrency = (amount: string) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));

    const getStatusBadge = (status: Campaign["status"]) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const getProgressPercentage = (received: string, target: string) => {
        const receivedNum = Number(received);
        const targetNum = Number(target);
        return Math.min((receivedNum / targetNum) * 100, 100);
    };

    return (
        <div className="lg:container mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Chiến dịch</h1>
                    <p className="text-gray-600 mt-1 dark:text-white">Quản lý và theo dõi các chiến dịch gây quỹ</p>
                </div>
            </div>


            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">

                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm chiến dịch..."
                                value={params.search || ""}
                                onChange={(e) => {
                                    setParams((prev) => ({ ...prev, search: e.target.value }));
                                    fetchCampaigns({ search: e.target.value });
                                }}
                                className="pl-10"
                            />
                        </div>


                        <Select
                            value={params.filter?.status?.[0] || "ALL"}
                            onValueChange={(val) => {
                                setParams((prev) => ({
                                    ...prev,
                                    filter: { ...prev.filter, status: val === "ALL" ? undefined : [val as Campaign["status"]] },
                                }));
                                fetchCampaigns({ filter: { ...params.filter, status: val === "ALL" ? undefined : [val as Campaign["status"]] } });
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                                <SelectItem value="REJECTED">Từ chối</SelectItem>
                                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                            </SelectContent>
                        </Select>


                        <Select
                            value={params.filter?.categoryId || "ALL"}
                            onValueChange={(val) => {
                                setParams((prev) => ({
                                    ...prev,
                                    filter: { ...prev.filter, categoryId: val === "ALL" ? undefined : val },
                                }));
                                fetchCampaigns({ filter: { ...params.filter, categoryId: val === "ALL" ? undefined : val } });
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>


            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6 text-red-600">{error}</CardContent>
                </Card>
            )}


            {loading ? (
                <div className="flex items-center justify-center h-64">Loading...</div>
            ) : campaigns.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Filter className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy chiến dịch nào</h3>
                        <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm để xem kết quả khác.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                                <Image
                                    src={campaign.coverImage || ""}
                                    alt={campaign.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">{getStatusBadge(campaign.status)}</div>
                            </div>
                            <CardHeader className="px-2">
                                <CardTitle className="text-lg line-clamp-2 h-14 text-center uppercase">{campaign.title}</CardTitle>
                                <div className="h-10 text-center text-sm text-gray-400">
                                    <MapPin className="mr-1 w-4 h-4 inline-block" />
                                    {campaign.location}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-400 line-clamp-2">{campaign.description}</p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Tiến độ</span>
                                        <span className="font-medium">
                                            {getProgressPercentage(campaign.receivedAmount, campaign.targetAmount).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${getProgressPercentage(campaign.receivedAmount, campaign.targetAmount)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <div>
                                            <div className="font-medium">{formatCurrency(campaign.receivedAmount)}</div>
                                            <div className="text-gray-500">Đã gây quỹ</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <div className="font-medium">{campaign.donationCount}</div>
                                            <div className="text-gray-500">Lượt quyên góp</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">Mục tiêu: {formatCurrency(campaign.targetAmount)}</div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Eye className="w-4 h-4 mr-2" /> Xem chi tiết
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
