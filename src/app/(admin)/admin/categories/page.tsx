"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Pencil, RefreshCw, FolderTree, Info, Sparkles, AlertCircle } from "lucide-react";
import { useCategories } from "../../../../hooks/use-category";
import { CategoryStats } from "../../../../types/api/category";
import { Loader } from "../../../../components/animate-ui/icons/loader";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../../components/ui/dialog";
import { toast } from "sonner";
import { categoryService } from "../../../../services/category.service";
import { Trash2Icon } from "../../../../components/animate-ui/icons/trash-2";
import { PlusIcon } from "../../../../components/animate-ui/icons/plus";

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
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors relative pt-12">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Quản lý Danh mục
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl font-normal leading-relaxed">
                            Cấu trúc và định hướng cho các chiến dịch quyên góp thông qua hệ thống phân loại chuyên nghiệp.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            onClick={refreshData}
                            disabled={loading}
                            className="border-slate-200 dark:border-slate-800 rounded-2xl h-14 px-6 font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                            <RefreshCw className={`w-5 h-5 mr-3 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 px-8 font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                        >
                            <PlusIcon className="w-5 h-5 mr-3" />
                            Thêm danh mục
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-24 relative z-20">
                {error && (
                    <div className="mb-8 p-6 rounded-[2rem] bg-red-50/80 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 backdrop-blur-xl flex items-center gap-4 animate-fadeIn">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-red-500 shadow-sm">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-red-900 dark:text-red-100">Đã xảy ra lỗi</h4>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80">{error}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm animate-fadeIn">
                        <div className="text-center space-y-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto">
                                    <Loader animate="spin" className="w-8 h-8 text-indigo-600" />
                                </div>
                            </div>
                            <p className="text-gray-500 font-medium">Đang tải danh sách...</p>
                        </div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm text-center animate-fadeIn">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800/80 rounded-[2.5rem] flex items-center justify-center mb-6">
                            <FolderTree className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Chưa có danh mục</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            Hệ thống hiện chưa có danh mục nào. Hãy bắt đầu bằng việc tạo một danh mục mới.
                        </p>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-semibold transition-all"
                        >
                            <PlusIcon className="w-5 h-5 mr-3" />
                            Tạo danh mục đầu tiên
                        </Button>
                    </div>
                ) : (
                    <Card className="border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 transition-colors">
                                            <th className="px-8 py-6 text-left text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Tên danh mục</th>
                                            <th className="px-8 py-6 text-left text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Mô tả chi tiết</th>
                                            <th className="px-8 py-6 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Chiến dịch</th>
                                            <th className="px-8 py-6 text-right text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/20 dark:divide-white/5">
                                        {categories.map((c) => (
                                            <tr
                                                key={c.id}
                                                className="group hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                            <FolderTree className="w-5 h-5" />
                                                        </div>
                                                        <span className="font-semibold text-gray-900 dark:text-white text-base">
                                                            {c.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 max-w-md">
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                                        {c.description || "Không có mô tả chi tiết."}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                            {getCampaignCount(c.id)}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Dự án</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => openEditDialog(c.id, c.title, c.description || "")}
                                                            className="h-10 w-10 rounded-xl bg-blue-50/50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                                                        >
                                                            <Pencil className="w-4.5 h-4.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => openDeleteDialog(c.id)}
                                                            className="h-10 w-10 rounded-xl bg-red-50/50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                                                        >
                                                            <Trash2Icon className="w-4.5 h-4.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="w-24 h-24" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-semibold">
                                {editingCategoryId ? "Cập nhật danh mục" : "Tạo danh mục mới"}
                            </DialogTitle>
                            <DialogDescription className="text-indigo-100/80 text-base font-normal mt-2 leading-relaxed">
                                {editingCategoryId
                                    ? "Tinh chỉnh thông tin danh mục để phù hợp hơn với các chiến dịch hiện tại."
                                    : "Bổ sung một phân loại mới giúp người dùng dễ dàng tìm kiếm dự án ý nghĩa."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white dark:bg-slate-900">
                        {formError && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 animate-pulse">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                    {formError}
                                </span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="title" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Tên danh mục <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FolderTree className="w-4 h-4" />
                                </div>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="ví dụ: Cứu trợ thiên tai..."
                                    className="h-14 pl-12 rounded-2xl bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Mô tả chi tiết <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-4 text-gray-400">
                                    <Info className="w-4 h-4" />
                                </div>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Nội dung mô tả ngắn gọn về danh mục này..."
                                    className="min-h-[140px] pl-12 pt-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-medium leading-relaxed"
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-3 sm:gap-0 mt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleCloseDialog}
                                disabled={isSubmitting}
                                className="h-14 flex-1 rounded-2xl text-gray-500 hover:bg-gray-100 font-semibold"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-14 flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-500/20"
                            >
                                {isSubmitting ? (
                                    <Loader animate="spin" className="w-5 h-5" />
                                ) : editingCategoryId ? (
                                    "Lưu cập nhật"
                                ) : (
                                    "Tạo danh mục"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl">
                    <div className="p-10 text-center space-y-6">
                        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-500 animate-bounce">
                            <Trash2Icon className="w-10 h-10" />
                        </div>
                        <div className="space-y-3">
                            <DialogTitle className="text-3xl font-semibold text-gray-900 dark:text-white">
                                Xác nhận xóa
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                                Bạn có chắc muốn xóa danh mục này? Mọi liên kết với các chiến dịch có thể bị ảnh hưởng. <br />
                                <span className="text-red-500 font-semibold">Hành động này không thể hoàn tác.</span>
                            </DialogDescription>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isSubmitting}
                                className="h-14 flex-1 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-semibold"
                            >
                                Quay lại
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="h-14 flex-1 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-lg shadow-red-500/20"
                            >
                                {isSubmitting ? <Loader animate="spin" className="w-5 h-5 mx-auto" /> : "Xác nhận xóa"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
