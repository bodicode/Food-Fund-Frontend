"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { resetForm } from "@/store/slices/campaign-form-slice";
import { campaignService } from "@/services/campaign.service";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { buildCoverUrl } from "@/lib/build-image";

export default function CreateCampaignStepPreview() {
    const router = useRouter();
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => state.campaignForm);

    const [loading, setLoading] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState<string>("");

    const coverUrl = useMemo(() => buildCoverUrl(form.coverImageFileKey), [form.coverImageFileKey]);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!form.categoryId) return;
            try {
                const category = await categoryService.getCategoryById(form.categoryId);
                if (category) setCategoryTitle(category.title);
            } catch (error) {
                console.error("❌ Error fetching category name:", error);
            }
        };
        fetchCategory();
    }, [form.categoryId]);

    const handleEdit = (stepOrPath: string) => {
        if (stepOrPath.startsWith("/")) {
            router.push(stepOrPath);
        } else {
            router.push(`/register/campaign/${stepOrPath}`);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const input = {
                title: form.title ?? "",
                description: form.description ?? "",
                coverImageFileKey: form.coverImageFileKey ?? "",
                location: form.location ?? "",
                targetAmount: form.targetAmount ?? "",
                startDate: form.startDate ?? "",
                endDate: form.endDate ?? "",
                categoryId: form.categoryId ?? "",
            };

            const missing = Object.entries(input).filter(([, v]) => !String(v).trim());
            if (missing.length) {
                toast.error("Thiếu thông tin. Vui lòng kiểm tra lại các bước trước.");
                setLoading(false);
                return;
            }

            await campaignService.createCampaign(input);

            toast.success("Chiến dịch đã được tạo thành công!");
            dispatch(resetForm());
            router.push("/profile?tab=campaigns");

        } catch (error: unknown) {
            console.error(error);
            toast.error("Tạo chiến dịch thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            <div className="container mx-auto max-w-5xl px-6 py-12">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">
                    Xem lại chiến dịch trước khi tạo
                </h1>

                <div className="mb-8">
                    {coverUrl ? (
                        <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-[16/9]">
                            <Image
                                unoptimized
                                width={800}
                                height={450}
                                src={coverUrl}
                                alt="Ảnh bìa chiến dịch"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center aspect-[16/9] w-full rounded-2xl bg-gray-100 text-gray-500">
                            Chưa có ảnh bìa
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 text-gray-800">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Tiêu đề</p>
                            <p className="text-lg font-semibold">{form.title || "—"}</p>
                        </div>
                        <Button variant="ghost" onClick={() => handleEdit("date")} className="text-sm">
                            Sửa
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Địa điểm</p>
                            <p className="font-medium">{form.location || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Danh mục</p>
                            <p className="font-medium">
                                {categoryTitle || form.categoryId || "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Mục tiêu quyên góp</p>
                            <p className="font-semibold text-color">
                                {form.targetAmount
                                    ? Number(form.targetAmount).toLocaleString("vi-VN") + " ₫"
                                    : "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Thời gian</p>
                            <p className="font-medium">
                                {(form.startDate && new Date(form.startDate).toLocaleDateString("vi-VN")) || "—"}{" "}
                                →{" "}
                                {(form.endDate && new Date(form.endDate).toLocaleDateString("vi-VN")) || "—"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <p className="text-sm text-gray-500">Câu chuyện</p>
                        <div
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: form.description || "<p>—</p>" }}
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-10">
                    <Button
                        variant="outline"
                        onClick={() => handleEdit("/register/campaign/date")}
                        className="h-12 px-8"
                    >
                        ← Chỉnh sửa
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`h-12 px-8 text-base font-semibold flex items-center gap-2 ${loading ? "bg-gray-300 text-gray-500" : "btn-color text-white"
                            }`}
                    >
                        {loading && <Loader className="animate-spin w-5 h-5" />}
                        {loading ? "Đang tạo..." : "Tạo chiến dịch"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
