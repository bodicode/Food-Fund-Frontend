"use client";

import { useState, useEffect } from "react";
import { campaignService } from "@/services/campaign.service";
import { Campaign, CampaignParams } from "@/types/api/campaign";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Clock, DollarSign, Users, MapPin } from "lucide-react";
import Image from "next/image";

const statusConfig = {
    PENDING: { label: "Chờ duyệt", variant: "secondary" as const, icon: Clock },
    APPROVED: { label: "Đã duyệt", variant: "default" as const, icon: CheckCircle },
    ACTIVE: { label: "Đang hoạt động", variant: "default" as const, icon: CheckCircle },
    REJECTED: { label: "Từ chối", variant: "destructive" as const, icon: XCircle },
    COMPLETED: { label: "Hoàn thành", variant: "outline" as const, icon: CheckCircle },
};

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<string>("NEWEST_FIRST");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const params: CampaignParams = {
                    search: searchTerm || undefined,
                    filter: statusFilter !== "ALL" ? { status: [statusFilter as Campaign["status"]] } : undefined,
                    sortBy: sortBy as CampaignParams["sortBy"],
                    limit: 50,
                    offset: 0,
                };

                const data = await campaignService.getCampaigns(params);
                setCampaigns(data || []);
            } catch (err) {
                setError("Không thể tải danh sách campaign");
                console.error("Error fetching campaigns:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTerm, statusFilter, sortBy]);

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(Number(amount));
    };

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

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Campaign</h1>
                    <p className="text-gray-600 mt-1 dark:text-white">Quản lý và theo dõi các chiến dịch gây quỹ</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm campaign..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                                <SelectItem value="REJECTED">Từ chối</SelectItem>
                                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NEWEST_FIRST">Mới nhất</SelectItem>
                                <SelectItem value="OLDEST_FIRST">Cũ nhất</SelectItem>
                                <SelectItem value="MOST_FUNDED">Gây quỹ nhiều nhất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Error State */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Campaigns Grid */}
            {campaigns.length === 0 && !loading ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Filter className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy campaign nào</h3>
                        <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm để xem kết quả khác.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                                <Image
                                    src={campaign.coverImage}
                                    alt={campaign.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    {getStatusBadge(campaign.status)}
                                </div>
                            </div>

                            <CardHeader className="px-2">
                                <CardTitle className="text-lg line-clamp-2 h-14 flex items-center justify-center text-center uppercase">
                                    {campaign.title}
                                </CardTitle>
                                <div className="h-10 text-center text-sm text-gray-400">
                                    <MapPin className="mr-1 w-4 h-4 inline-block" />
                                    {campaign.location}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-400 line-clamp-2">{campaign.description}</p>

                                {/* Progress */}
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
                                            style={{
                                                width: `${getProgressPercentage(campaign.receivedAmount, campaign.targetAmount)}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
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

                                <div className="text-sm text-gray-500">
                                    Mục tiêu: {formatCurrency(campaign.targetAmount)}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Xem chi tiết
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

            {/* Stats Summary */}
            {campaigns.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{campaigns.length}</div>
                                <div className="text-sm text-gray-600">Tổng Campaign</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {campaigns.filter(c => c.status === "ACTIVE").length}
                                </div>
                                <div className="text-sm text-gray-600">Đang hoạt động</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {campaigns.filter(c => c.status === "PENDING").length}
                                </div>
                                <div className="text-sm text-gray-600">Chờ duyệt</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        campaigns.reduce((sum, c) => sum + Number(c.receivedAmount), 0).toString()
                                    )}
                                </div>
                                <div className="text-sm text-gray-600">Tổng gây quỹ</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
