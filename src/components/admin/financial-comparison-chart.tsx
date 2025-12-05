"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, RefreshCw } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils/currency-utils";

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
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <CardTitle className="text-sm font-semibold">
                        So sánh tài chính theo danh mục
                    </CardTitle>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500">
                    Tổng số tiền và trung bình mỗi chiến dịch theo danh mục
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-80 w-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            {data.length > 0 ? (
                                <LineChart
                                    data={data}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11 }}
                                        angle={-35}
                                        textAnchor="end"
                                        height={90}
                                        interval={0}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => {
                                            const num = value as number;
                                            if (num >= 1_000_000) {
                                                return `${(num / 1_000_000).toFixed(0)}tr`;
                                            } else if (num >= 1_000) {
                                                return `${(num / 1_000).toFixed(0)}k`;
                                            }
                                            return `${num}`;
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => {
                                            const num = value as number;
                                            if (num >= 1_000_000) {
                                                return `${(num / 1_000_000).toFixed(0)}tr`;
                                            } else if (num >= 1_000) {
                                                return `${(num / 1_000).toFixed(0)}k`;
                                            }
                                            return `${num}`;
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            const label = name === "amount" ? "Tổng tiền" : "TB/chiến dịch";
                                            return [formatCurrency(value), label];
                                        }}
                                        contentStyle={{
                                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                                            border: "none",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: "#6366f1" }}
                                        name="amount"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="avgPerCampaign"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: "#f59e0b" }}
                                        name="avgPerCampaign"
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        formatter={(value) => {
                                            const labels: Record<string, string> = {
                                                amount: "Tổng tiền gây quỹ",
                                                avgPerCampaign: "TB mỗi chiến dịch"
                                            };
                                            return <span className="text-xs text-gray-600">{labels[value] || value}</span>;
                                        }}
                                    />
                                </LineChart>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                                    <p className="text-sm">Chưa có dữ liệu</p>
                                </div>
                            )}
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
