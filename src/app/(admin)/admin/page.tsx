"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    Target,
    DollarSign,
    CheckCircle,
    Clock,
    RefreshCw,
    Eye,
    BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { translateCampaignStatus, getStatusColorClass } from "@/lib/utils/status-utils";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils/currency-utils";

// Mock data - thay thế bằng API calls thực tế
const mockDashboardData = {
    overview: {
        totalUsers: 1247,
        totalCampaigns: 89,
        totalDonations: 15420000,
        activeCampaigns: 23,
        pendingCampaigns: 8,
        completedCampaigns: 45,
    },
    recentCampaigns: [
        {
            id: "1",
            title: "Hỗ trợ trẻ em vùng cao",
            status: "ACTIVE",
            targetAmount: "50000000",
            receivedAmount: "32000000",
            donationCount: 156,
            creator: "Nguyễn Văn A",
            createdAt: "2024-11-01",
        },
        {
            id: "2",
            title: "Xây dựng trường học",
            status: "PENDING",
            targetAmount: "100000000",
            receivedAmount: "0",
            donationCount: 0,
            creator: "Trần Thị B",
            createdAt: "2024-11-03",
        },
        {
            id: "3",
            title: "Cứu trợ lũ lụt miền Trung",
            status: "COMPLETED",
            targetAmount: "75000000",
            receivedAmount: "78000000",
            donationCount: 234,
            creator: "Lê Văn C",
            createdAt: "2024-10-15",
        },
    ],
    userStats: {
        totalUsers: 1247,
        adminUsers: 5,
        donorUsers: 1180,
        kitchenUsers: 32,
        deliveryUsers: 30,
        newUsersThisMonth: 89,
    },
    categoryStats: [
        { name: "Giáo dục", campaignCount: 25, totalRaised: 450000000 },
        { name: "Y tế", campaignCount: 18, totalRaised: 320000000 },
        { name: "Thiên tai", campaignCount: 15, totalRaised: 280000000 },
        { name: "Trẻ em", campaignCount: 20, totalRaised: 380000000 },
        { name: "Người già", campaignCount: 11, totalRaised: 190000000 },
    ],
    monthlyData: [
        { month: "T6", campaigns: 12, donations: 85000000, users: 45 },
        { month: "T7", campaigns: 15, donations: 120000000, users: 67 },
        { month: "T8", campaigns: 18, donations: 95000000, users: 52 },
        { month: "T9", campaigns: 22, donations: 140000000, users: 78 },
        { month: "T10", campaigns: 16, donations: 110000000, users: 63 },
        { month: "T11", campaigns: 20, donations: 160000000, users: 89 },
    ],
    campaignStatusData: [
        { name: "Đang hoạt động", value: 23, color: "#10b981" },
        { name: "Chờ duyệt", value: 8, color: "#f59e0b" },
        { name: "Hoàn thành", value: 45, color: "#3b82f6" },
        { name: "Từ chối", value: 5, color: "#ef4444" },
        { name: "Đã hủy", value: 8, color: "#6b7280" },
    ],
};

export default function AdminDashboard() {
    const router = useRouter();
    const [data] = useState(mockDashboardData);
    const [loading, setLoading] = useState(false);



    const getStatusBadge = (status: string) => {
        const label = translateCampaignStatus(status);
        const colorClass = getStatusColorClass(status);
        return (
            <Badge className={`${colorClass} border-0`}>
                {label}
            </Badge>
        );
    };

    const getProgressPercentage = (received: string, target: string) => {
        const receivedNum = Number(received);
        const targetNum = Number(target);
        return Math.min((receivedNum / targetNum) * 100, 100);
    };

    const refreshData = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="lg:container mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1 dark:text-gray-300">
                        Tổng quan hệ thống gây quỹ từ thiện
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Làm mới
                </Button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +{data.userStats.newUsersThisMonth} người dùng mới tháng này
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng chiến dịch</CardTitle>
                        <Target className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalCampaigns}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.overview.activeCampaigns} đang hoạt động, {data.overview.pendingCampaigns} chờ duyệt
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng quyên góp</CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.overview.totalDonations)}</div>
                        <p className="text-xs text-muted-foreground">
                            Từ tất cả các chiến dịch
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.completedCampaigns}</div>
                        <p className="text-xs text-muted-foreground">
                            Chiến dịch đã hoàn thành
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Campaigns */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Chiến dịch gần đây</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/admin/campaigns")}
                            className="flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Xem tất cả
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.recentCampaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-medium truncate">{campaign.title}</h4>
                                        {getStatusBadge(campaign.status)}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Tạo bởi: {campaign.creator} • {new Date(campaign.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                        <span className="text-green-600 font-medium">
                                            {formatCurrency(campaign.receivedAmount)}
                                        </span>
                                        <span className="text-gray-500">
                                            / {formatCurrency(campaign.targetAmount)}
                                        </span>
                                        <span className="text-blue-600">
                                            {campaign.donationCount} lượt đóng góp
                                        </span>
                                    </div>
                                    {campaign.status === "ACTIVE" && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${getProgressPercentage(campaign.receivedAmount, campaign.targetAmount)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* User Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Thống kê người dùng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Admin</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {data.userStats.adminUsers}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Nhà tài trợ</span>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {data.userStats.donorUsers}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Bếp ăn</span>
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                    {data.userStats.kitchenUsers}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Giao hàng</span>
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    {data.userStats.deliveryUsers}
                                </Badge>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push("/admin/users")}
                                className="w-full"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Quản lý người dùng
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Category Statistics */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Thống kê theo danh mục</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/admin/categories")}
                        className="flex items-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4" />
                        Quản lý danh mục
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {data.categoryStats.map((category, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
                                    {category.name}
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {category.campaignCount}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Chiến dịch
                                        </div>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                                                {formatCurrency(category.totalRaised)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Tổng gây quỹ
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section */}
            {/* Campaign Status Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Phân bố trạng thái chiến dịch
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <div className="flex justify-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data.campaignStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        stroke="#fff"
                                        strokeWidth={2}
                                    >
                                        {data.campaignStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number | string, name: string) => [
                                            `${value} chiến dịch`,
                                            name
                                        ]}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend & Statistics */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Chi tiết trạng thái
                            </h4>
                            <div className="space-y-3">
                                {data.campaignStatusData.map((item, index) => {
                                    const total = data.campaignStatusData.reduce((sum, item) => sum + item.value, 0);
                                    const percentage = ((item.value / total) * 100).toFixed(1);

                                    return (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {item.value}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {percentage}%
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                                        Tổng quan
                                    </span>
                                </div>
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                    <div className="flex justify-between mb-1">
                                        <span>Tổng chiến dịch:</span>
                                        <span className="font-semibold">
                                            {data.campaignStatusData.reduce((sum, item) => sum + item.value, 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tỷ lệ thành công:</span>
                                        <span className="font-semibold text-green-600">
                                            {(((data.campaignStatusData.find(item => item.name === "Hoàn thành")?.value || 0) /
                                                data.campaignStatusData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Category Performance Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        Hiệu suất theo danh mục
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data.categoryStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip
                                formatter={(value: number | string, name: string) => [
                                    name === 'totalRaised' ? formatCurrency(value) : value,
                                    name === 'campaignCount' ? 'Số chiến dịch' : 'Tổng gây quỹ'
                                ]}
                            />
                            <Bar yAxisId="left" dataKey="campaignCount" fill="#3b82f6" name="campaignCount" />
                            <Bar yAxisId="right" dataKey="totalRaised" fill="#10b981" name="totalRaised" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        Tăng trưởng người dùng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value: number | string) => [value, 'Người dùng mới']}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#6366f1"
                                strokeWidth={3}
                                dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/campaigns?status=PENDING")}
                            className="flex items-center gap-2 h-auto p-4"
                        >
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <div className="text-left">
                                <div className="font-medium">Duyệt chiến dịch</div>
                                <div className="text-sm text-gray-500">{data.overview.pendingCampaigns} chờ duyệt</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/users")}
                            className="flex items-center gap-2 h-auto p-4"
                        >
                            <Users className="w-5 h-5 text-blue-600" />
                            <div className="text-left">
                                <div className="font-medium">Quản lý người dùng</div>
                                <div className="text-sm text-gray-500">{data.overview.totalUsers} người dùng</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/categories")}
                            className="flex items-center gap-2 h-auto p-4"
                        >
                            <BarChart3 className="w-5 h-5 text-green-600" />
                            <div className="text-left">
                                <div className="font-medium">Quản lý danh mục</div>
                                <div className="text-sm text-gray-500">{data.categoryStats.length} danh mục</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/campaigns")}
                            className="flex items-center gap-2 h-auto p-4"
                        >
                            <Target className="w-5 h-5 text-purple-600" />
                            <div className="text-left">
                                <div className="font-medium">Tất cả chiến dịch</div>
                                <div className="text-sm text-gray-500">{data.overview.totalCampaigns} chiến dịch</div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}