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
import { BookOpen, CalendarDays, Goal, MapPin, Tag } from "lucide-react";

export default function CreateCampaignStepPreview() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.campaignForm);

  const [loading, setLoading] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState<string>("");

  const coverUrl = useMemo(
    () => buildCoverUrl(form.coverImageFileKey),
    [form.coverImageFileKey]
  );

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

      const missing = Object.entries(input).filter(
        ([, v]) => !String(v).trim()
      );
      if (missing.length) {
        toast.error("Thiếu thông tin. Vui lòng kiểm tra lại các bước trước.");
        setLoading(false);
        return;
      }

      await campaignService.createCampaign(input);
      toast.success("Chiến dịch đã được tạo thành công!");
      dispatch(resetForm());
      router.push("/profile?tab=campaigns");
    } catch (error) {
      console.error(error);
      toast.error("Tạo chiến dịch thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <h1 className="text-2xl sm:text-3xl text-center font-bold mb-8 text-gray-900">
          Xem lại chiến dịch trước khi tạo
        </h1>

        <div className="mb-8">
          {coverUrl ? (
            <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-gray-100 mx-auto max-w-2xl">
              <Image
                unoptimized
                fill
                src={coverUrl}
                alt="Ảnh bìa chiến dịch"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center aspect-[4/3] sm:aspect-square rounded-2xl bg-gray-100 text-gray-500 text-sm sm:text-base">
              Chưa có ảnh bìa
            </div>
          )}
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-6 text-gray-800">
          <div className="flex items-center gap-x-1">
            <p className="text-sm text-gray-500">Tiêu đề:</p>
            <p className="text-base sm:text-lg font-semibold break-words">
              {form.title || "—"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                <MapPin className="inline w-4 h-4 mr-1" />
                Địa điểm
              </p>
              <p className="font-medium break-words">{form.location || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                <Tag className="inline w-4 h-4 mr-1" />
                Danh mục
              </p>
              <p className="font-medium">
                {categoryTitle || form.categoryId || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                <Goal className="inline w-4 h-4 mr-1" />
                Mục tiêu quyên góp
              </p>
              <p className="font-semibold text-color">
                {form.targetAmount
                  ? Number(form.targetAmount).toLocaleString("vi-VN") + " ₫"
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                <CalendarDays className="inline w-4 h-4 mr-1" />
                Thời gian
              </p>
              <p className="font-medium">
                {(form.startDate &&
                  new Date(form.startDate).toLocaleDateString("vi-VN")) ||
                  "—"}{" "}
                →{" "}
                {(form.endDate &&
                  new Date(form.endDate).toLocaleDateString("vi-VN")) ||
                  "—"}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-sm text-gray-500">
              <BookOpen className="inline w-4 h-4 mr-1" />
              Câu chuyện
            </p>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: form.description || "<p>—</p>",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4">
          <Button
            variant="outline"
            onClick={() => handleEdit("/register/campaign/date")}
            className="h-12 px-6 w-full sm:w-auto"
          >
            ← Chỉnh sửa
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-12 px-6 w-full sm:w-auto text-base font-semibold flex items-center justify-center gap-2 ${
              loading ? "bg-gray-300 text-gray-500" : "btn-color text-white"
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
