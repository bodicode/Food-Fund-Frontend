"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud } from "lucide-react"; // ✅ Thêm icon cho khu vực upload
import { campaignService } from "@/services/campaign.service";
import { categoryService } from "@/services/category.service";
import { uploadService } from "@/services/upload.service";
import { Campaign, UpdateCampaignInput } from "@/types/api/campaign";
import { Category } from "@/types/api/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader } from "@/components/animate-ui/icons/loader";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { formatCurrency, parseCurrency } from "@/lib/utils";

export default function EditCampaignPage() {
  const { id } = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [campaignData, categoryData] = await Promise.all([
          campaignService.getCampaignById(id as string),
          categoryService.getCategories(),
        ]);
        setCampaign(campaignData);
        setCategories(categoryData);
        setPreviewImage(campaignData?.coverImage || "");
      } catch (err) {
        console.error("Error fetching campaign:", err);
        toast.error("Không thể tải thông tin chiến dịch.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp ảnh hợp lệ.");
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleChange = <K extends keyof Campaign>(
    field: K,
    value: Campaign[K]
  ) => {
    setCampaign((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!campaign) return;
    setSaving(true);

    try {
      let fileKey: string | undefined;

      if (selectedFile) {
        const upload = await uploadService.uploadCampaignCover(selectedFile, {
          campaignId: campaign.id,
        });
        fileKey = upload.fileKey;
      }

      const input: UpdateCampaignInput = {
        title: campaign.title,
        description: campaign.description,
        targetAmount: campaign.targetAmount?.toString(),
        categoryId: campaign.category?.id,
        location: campaign.location,
        startDate: campaign.startDate
          ? new Date(campaign.startDate).toISOString()
          : undefined,
        endDate: campaign.endDate
          ? new Date(campaign.endDate).toISOString()
          : undefined,
        ...(fileKey && { coverImageFileKey: fileKey }),
      };

      const updated = await campaignService.updateCampaign(campaign.id, input);

      if (updated) {
        toast.success("Cập nhật chiến dịch thành công!");
        router.push(`/profile/my-campaign/${updated.id}`);
      } else {
        toast.error("Không thể cập nhật chiến dịch.");
      }
    } catch (err) {
      console.error("❌ Error updating campaign:", err);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );

  if (!campaign)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Không tìm thấy chiến dịch.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 pb-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">
          Chỉnh sửa chiến dịch
        </h1>

        <div className="space-y-8 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Ảnh bìa chiến dịch
            </label>
            <div className="w-full max-w-lg mx-auto">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4 border">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Cover Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Chưa có ảnh
                  </div>
                )}
              </div>
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-[#ad4e28] hover:text-[#9c4624] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#ad4e28] text-center block border-2 border-dashed py-6"
              >
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <span>Nhấn để chọn hoặc kéo thả ảnh vào đây</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-6 border-t">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Tiêu đề
              </label>
              <Input
                value={campaign.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="VD: Gây quỹ xây trường cho trẻ em vùng cao"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Danh mục
              </label>
              <Select
                value={campaign.category?.id || ""}
                onValueChange={(val) => {
                  const selectedCategory = categories.find((c) => c.id === val);
                  handleChange("category", selectedCategory);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Mục tiêu (VNĐ)
              </label>
              <Input
                type="text"
                inputMode="numeric"
                value={formatCurrency(campaign.targetAmount)}
                onChange={(e) => {
                  const raw = parseCurrency(e.target.value);
                  handleChange("targetAmount", raw);
                }}
                placeholder="VD: 50,000,000"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Địa điểm
              </label>
              <Input
                value={campaign.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="VD: Hà Giang, Việt Nam"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Ngày bắt đầu
              </label>
              <Input
                type="date"
                value={
                  campaign.startDate
                    ? new Date(campaign.startDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleChange(
                    "startDate",
                    new Date(e.target.value).toISOString()
                  )
                }
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Ngày kết thúc
              </label>
              <Input
                type="date"
                value={
                  campaign.endDate
                    ? new Date(campaign.endDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleChange(
                    "endDate",
                    new Date(e.target.value).toISOString()
                  )
                }
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Mô tả chi tiết
              </label>
              <RichTextEditor
                value={campaign.description || ""}
                onChange={(val) => handleChange("description", val)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#ad4e28] text-white hover:bg-[#9c4624]"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
