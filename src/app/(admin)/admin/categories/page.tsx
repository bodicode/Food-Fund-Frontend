"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, RefreshCw } from "lucide-react";
import { useCategories } from "@/hooks/use-category";
import { CategoryStats } from "@/types/api/category";
import { Loader } from "@/components/animate-ui/icons/loader";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { categoryService } from "@/services/category.service";
import { Trash2Icon } from "@/components/animate-ui/icons/trash-2";
import { PlusIcon } from "@/components/animate-ui/icons/plus";
import { X } from "@/components/animate-ui/icons/x";

export default function CategoryPage() {
    const { categories, loading, error, fetchCategories } = useCategories();
    const [categoriesStats, setCategoriesStats] = useState<CategoryStats[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ title: "", description: "" });
    const [formError, setFormError] = useState("");

    // Fetch categories stats
    const fetchCategoriesStats = async () => {
        try {
            const stats = await categoryService.getCampaignCategoriesStats();
            setCategoriesStats(stats);
        } catch (err) {
            console.error("Error fetching categories stats:", err);
        }
    };

    // Fetch both categories and stats
    const refreshData = async () => {
        await Promise.all([fetchCategories(), fetchCategoriesStats()]);
    };

    // Initial load of stats
    useEffect(() => {
        fetchCategoriesStats();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (formError) setFormError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        setIsSubmitting(true);

        try {
            let result = null;

            if (editingCategoryId) {
                result = await categoryService.updateCategory(editingCategoryId, {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                });

                if (result) {
                    toast.success("Cập nhật danh mục thành công!", {
                        description: `Danh mục "${result.title}" đã được cập nhật.`,
                    });
                }
            } else {
                result = await categoryService.createCategory({
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                });

                if (result) {
                    toast.success("Tạo danh mục thành công!", {
                        description: `Danh mục "${result.title}" đã được tạo.`,
                    });
                }
            }

            if (result) {
                setFormData({ title: "", description: "" });
                setIsDialogOpen(false);
                setEditingCategoryId(null);
                await refreshData();
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra. Vui lòng thử lại.";

            setFormError(errorMessage);
            toast.error(editingCategoryId ? "Cập nhật thất bại!" : "Tạo thất bại!", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingCategoryId) return;
        setIsSubmitting(true);
        try {
            const success = await categoryService.deleteCategory(deletingCategoryId);
            if (success) {
                toast.success("Xóa danh mục thành công!");
                await refreshData();
            } else {
                toast.error("Xóa thất bại!", {
                    description: "Không thể xóa danh mục, vui lòng thử lại.",
                });
            }
        } catch (err) {
            toast.error("Xóa thất bại!", {
                description: err instanceof Error ? err.message : "Có lỗi xảy ra.",
            });
        } finally {
            setIsSubmitting(false);
            setIsDeleteDialogOpen(false);
            setDeletingCategoryId(null);
        }
    };

    const openEditDialog = (id: string, title: string, description: string) => {
        setEditingCategoryId(id);
        setFormData({ title, description: description || "" });
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (id: string) => {
        setDeletingCategoryId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDialog = () => {
        if (!isSubmitting) {
            setIsDialogOpen(false);
            setFormData({ title: "", description: "" });
            setFormError("");
            setEditingCategoryId(null);
        }
    };

    // Helper function to get campaign count for a category
    const getCampaignCount = (categoryId: string): number => {
        const stats = categoriesStats.find(stat => stat.id === categoryId);
        return stats?.campaignCount || 0;
    };

    return (
        <div className="lg:container mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Quản lý Danh mục
                    </h1>
                    <p className="text-gray-600 mt-1 dark:text-gray-300">
                        Danh sách các danh mục chiến dịch gây quỹ
                    </p>
                </div>
                <div className="flex items-center gap-2">
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
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <PlusIcon animate animateOnHover animateOnView animateOnTap className="w-4 h-4" />
                        Thêm Danh mục
                    </Button>
                </div>
            </div>

            {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                    <CardContent className="p-6 flex items-center gap-2 text-red-600">
                        <X animate animateOnHover animateOnTap animateOnView className="w-5 h-5" />
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
                                            <th className="px-4 py-3 text-center text-nowrap">Số chiến dịch</th>
                                            <th className="px-4 py-3"></th>
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
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {getCampaignCount(c.id)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => openEditDialog(c.id, c.title, c.description || "")}
                                                    >
                                                        <Pencil className="w-4 h-4 mr-1" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => openDeleteDialog(c.id)}
                                                    >
                                                        <Trash2Icon animate animateOnTap animateOnView className="w-4 h-4 mr-1" />
                                                    </Button>
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

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {editingCategoryId ? "Cập nhật Danh mục" : "Tạo Danh mục Mới"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategoryId
                                ? "Chỉnh sửa thông tin danh mục."
                                : "Điền thông tin để tạo danh mục mới."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {formError && (
                            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                                <X animate animateOnHover animateOnTap animateOnView className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-red-600 dark:text-red-400">
                                    {formError}
                                </span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label
                                htmlFor="title"
                                className="text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Tên danh mục <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="description"
                                className="text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Mô tả <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDialog}
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-primary hover:bg-primary/90"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader animate loop className="w-4 h-4 mr-2" />
                                    </>
                                ) : (
                                    <>
                                        {editingCategoryId ? (
                                            <>
                                                <Pencil className="w-4 h-4 mr-2" /> Cập nhật
                                            </>
                                        ) : (
                                            <>
                                                <PlusIcon animate animateOnHover animateOnView animateOnTap className="w-4 h-4 mr-2" /> Thêm
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-red-600">
                            Xác nhận xóa
                        </DialogTitle>
                        <DialogDescription className="dark:text-white">
                            Bạn có chắc muốn xóa danh mục này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader animate loop className="w-4 h-4 mr-2" />
                                </>
                            ) : (
                                <>
                                    <Trash2Icon animate animateOnTap animateOnView className="w-4 h-4 mr-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
