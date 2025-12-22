"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart3, RefreshCw } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { formatCurrency } from "../../lib/utils/currency-utils";

interface CategoryFinancialDataItem {
    name: string;
    amount: number;
    avgPerCampaign: number;
}

interface FinancialComparisonChartProps {
    data: CategoryFinancialDataItem[];
    loading?: boolean;
}

export function FinancialComparisonChart({ data, loading }: FinancialComparisonChartProps) {
    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-800">
            <CardHeader className="pb-3 border-b border-gray-50 flex flex-row items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <BarChart3 className="h-4 w-4 text-indigo-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-gray-900">
                            So sánh hiệu quả tài chính
                        </CardTitle>
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-400 font-normal">
                        Phân tích dòng tiền thực tế so với trung bình các danh mục
                    </p>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="h-80 w-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            {data.length > 0 ? (
                                <AreaChart
                                    data={data}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fontWeight: 400, fill: '#94a3b8' }}
                                        angle={-20}
                                        textAnchor="end"
                                        height={60}
                                        interval={0}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        tick={{ fontSize: 10, fontWeight: 400, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => {
                                            const num = value as number;
                                            if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}tr`;
                                            if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
                                            return `${num}`;
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tick={{ fontSize: 10, fontWeight: 400, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => {
                                            const num = value as number;
                                            if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}tr`;
                                            if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
                                            return `${num}`;
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            if (name === "Gây quỹ trung bình") return [formatCurrency(value), name];
                                            return [formatCurrency(value), "Tổng tiền"];
                                        }}
                                        contentStyle={{
                                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                                            border: "none",
                                            borderRadius: "16px",
                                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                        }}
                                    />
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                        name="Tổng tiền gây quỹ"
                                        animationDuration={1500}
                                    />
                                    <Area
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="avgPerCampaign"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        strokeDasharray="5 5"
                                        fillOpacity={1}
                                        fill="url(#colorAvg)"
                                        name="Gây quỹ trung bình"
                                        animationDuration={2000}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        align="right"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{value}</span>}
                                    />
                                </AreaChart>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                    <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="font-medium">Chưa có dữ liệu phân tích</p>
                                </div>
                            )}
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
