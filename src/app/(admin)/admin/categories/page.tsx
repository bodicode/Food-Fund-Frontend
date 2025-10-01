"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, XCircle } from "lucide-react";
import { useCategories } from "@/hooks/use-category";
import { Loader } from "@/components/animate-ui/icons/loader";

export default function CategoryPage() {
    const { categories, loading, error, fetchCategories } = useCategories();

    return (
        <div className="lg:container mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Quản lý Danh mục
                    </h1>
                    <p className="text-gray-600 mt-1 dark:text-gray-300">
                        Danh sách các danh mục chiến dịch gây quỹ
                    </p>
                </div>
                <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={fetchCategories}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Danh mục
                </Button>
            </div>

            {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                    <CardContent className="p-6 flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader animate animateOnView loop className="w-5 h-5" />
                </div>
            ) : (
                <Card className="overflow-hidden bg-white dark:bg-[#1e293b]">
                    <CardHeader>
                        <CardTitle>Danh mục chiến dịch</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                Chưa có danh mục nào.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200 dark:bg-[#334155] text-left text-gray-700 dark:text-gray-200">
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">Tên danh mục</th>
                                            <th className="px-4 py-3">Mô tả</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((c) => (
                                            <tr
                                                key={c.id}
                                                className="border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-sm"
                                            >
                                                <td className="px-4 py-3">{c.id}</td>
                                                <td className="px-4 py-3 font-medium">{c.title}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                    {c.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
