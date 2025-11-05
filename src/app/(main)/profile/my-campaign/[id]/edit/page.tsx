"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, Info, Plus, Trash2, MapPin } from "lucide-react";

import { campaignService } from "@/services/campaign.service";
import { categoryService } from "@/services/category.service";
import { uploadService } from "@/services/upload.service";
import { phaseService } from "@/services/phase.service";

import { Campaign, UpdateCampaignInput } from "@/types/api/campaign";
import { CreatePhaseInput, CampaignPhase } from "@/types/api/phase";
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
import LocationPicker from "@/components/shared/location-picker";
import { fromPercentInput, toPercentString } from "@/lib/utils/percent-utils";
import { formatCurrency, parseCurrency } from "@/lib/utils/currency-utils";
import { isoToLocalInput, localInputToIso } from "@/lib/utils/date-utils";
import { isoDateOnly } from "@/lib/utils/date-utils";

type CampaignCategory = Campaign["category"];

export default function EditCampaignPage() {
  const { id } = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [ingredientPct, setIngredientPct] = useState<string>("");
  const [cookingPct, setCookingPct] = useState<string>("");
  const [deliveryPct, setDeliveryPct] = useState<string>("");
  const [phases, setPhases] = useState<CreatePhaseInput[]>([]);
  const [existingPhases, setExistingPhases] = useState<CampaignPhase[]>([]);

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

        if (campaignData) {

          setIngredientPct(
            toPercentString(campaignData.ingredientBudgetPercentage)
          );
          setCookingPct(toPercentString(campaignData.cookingBudgetPercentage));
          setDeliveryPct(
            toPercentString(campaignData.deliveryBudgetPercentage)
          );

          // Try to load phases, fallback to default if not available
          try {
            if (campaignData.phases && Array.isArray(campaignData.phases) && campaignData.phases.length > 0) {
              const loadedPhases = campaignData.phases as CampaignPhase[];
              setExistingPhases(loadedPhases);
              setPhases(loadedPhases.map((phase) => ({
                phaseName: phase?.phaseName || "",
                location: phase?.location || "",
                ingredientPurchaseDate: phase?.ingredientPurchaseDate || "",
                cookingDate: phase?.cookingDate || "",
                deliveryDate: phase?.deliveryDate || "",
              })));
            } else {
              console.log("📋 No phases found, creating default");
              setExistingPhases([]);

              // Tạo default times cho phase mặc định
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);

              const purchaseTime = new Date(tomorrow);
              purchaseTime.setHours(8, 0, 0, 0); // 8:00 AM

              const cookingTime = new Date(tomorrow);
              cookingTime.setHours(10, 0, 0, 0); // 10:00 AM

              const deliveryTime = new Date(tomorrow);
              deliveryTime.setHours(14, 0, 0, 0); // 2:00 PM

              setPhases([{
                phaseName: "Giai đoạn 1",
                location: "",
                ingredientPurchaseDate: purchaseTime.toISOString(),
                cookingDate: cookingTime.toISOString(),
                deliveryDate: deliveryTime.toISOString(),
              }]);
            }
          } catch {
            setExistingPhases([]);

            // Tạo default times cho error fallback
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const purchaseTime = new Date(tomorrow);
            purchaseTime.setHours(8, 0, 0, 0); // 8:00 AM

            const cookingTime = new Date(tomorrow);
            cookingTime.setHours(10, 0, 0, 0); // 10:00 AM

            const deliveryTime = new Date(tomorrow);
            deliveryTime.setHours(14, 0, 0, 0); // 2:00 PM

            setPhases([{
              phaseName: "Giai đoạn 1",
              location: "",
              ingredientPurchaseDate: purchaseTime.toISOString(),
              cookingDate: cookingTime.toISOString(),
              deliveryDate: deliveryTime.toISOString(),
            }]);
          }
        }
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

  const updatePhase = (index: number, field: keyof CreatePhaseInput, value: string) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setPhases(newPhases);
  };

  const addPhase = () => {
    // Tạo default times cho phase mới
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Giờ mặc định
    const purchaseTime = new Date(tomorrow);
    purchaseTime.setHours(8, 0, 0, 0); // 8:00 AM

    const cookingTime = new Date(tomorrow);
    cookingTime.setHours(10, 0, 0, 0); // 10:00 AM

    const deliveryTime = new Date(tomorrow);
    deliveryTime.setHours(14, 0, 0, 0); // 2:00 PM

    setPhases([...phases, {
      phaseName: `Giai đoạn ${phases.length + 1}`,
      location: "",
      ingredientPurchaseDate: purchaseTime.toISOString(),
      cookingDate: cookingTime.toISOString(),
      deliveryDate: deliveryTime.toISOString(),
    }]);
  };

  const removePhase = (index: number) => {
    if (phases.length > 1) {
      setPhases(phases.filter((_, i) => i !== index));
    }
  };

  const toCampaignCategory = (cat: Category): CampaignCategory => ({
    id: cat.id,
    title: cat.title,
  });

  const targetAmountNumber = useMemo(() => {
    const raw = campaign?.targetAmount ?? "0";
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }, [campaign?.targetAmount]);

  const computedIngredientAmt = useMemo(() => {
    const server = Number(campaign?.ingredientFundsAmount || 0);
    if (server > 0) return server;
    const pct = fromPercentInput(ingredientPct);
    return Math.round((pct / 100) * targetAmountNumber);
  }, [campaign, ingredientPct, targetAmountNumber]);

  const computedCookingAmt = useMemo(() => {
    const server = Number(campaign?.cookingFundsAmount || 0);
    if (server > 0) return server;
    const pct = fromPercentInput(cookingPct);
    return Math.round((pct / 100) * targetAmountNumber);
  }, [campaign, cookingPct, targetAmountNumber]);

  const computedDeliveryAmt = useMemo(() => {
    const server = Number(campaign?.deliveryFundsAmount || 0);
    if (server > 0) return server;
    const pct = fromPercentInput(deliveryPct);
    return Math.round((pct / 100) * targetAmountNumber);
  }, [campaign, deliveryPct, targetAmountNumber]);

  const handlePhasesUpdate = async (campaignId: string) => {
    try {
      // For now, we'll handle phases as new additions
      // In a more complex scenario, you'd need to:
      // 1. Compare existing vs current phases
      // 2. Update existing phases
      // 3. Add new phases
      // 4. Delete removed phases

      // Simple approach: Delete all existing phases and add new ones
      if (existingPhases.length > 0) {
        const existingIds = existingPhases.map(p => p.id);
        await phaseService.deleteManyCampaignPhases(existingIds);
      }

      // Add all current phases as new
      for (const phase of phases) {
        const phaseInput: CreatePhaseInput = {
          phaseName: phase.phaseName,
          location: phase.location,
          ingredientPurchaseDate: phase.ingredientPurchaseDate ?
            new Date(phase.ingredientPurchaseDate).toISOString() : "",
          cookingDate: phase.cookingDate ?
            new Date(phase.cookingDate).toISOString() : "",
          deliveryDate: phase.deliveryDate ?
            new Date(phase.deliveryDate).toISOString() : "",
        };

        await phaseService.addCampaignPhase(campaignId, phaseInput);
      }
    } catch (error) {
      console.error("❌ Error updating phases:", error);
      throw error;
    }
  };

  const validateBeforeSave = () => {
    const s = campaign?.fundraisingStartDate
      ? new Date(campaign.fundraisingStartDate)
      : null;
    const e = campaign?.fundraisingEndDate
      ? new Date(campaign.fundraisingEndDate)
      : null;
    if (s && e && s > e) {
      toast.error("Ngày kết thúc phải sau (hoặc bằng) ngày bắt đầu.");
      return false;
    }

    const p1 = fromPercentInput(ingredientPct);
    const p2 = fromPercentInput(cookingPct);
    const p3 = fromPercentInput(deliveryPct);
    const total = p1 + p2 + p3;

    if (p1 >= 0 && p2 >= 0 && p3 >= 0) {
      // Cho phép sai số nhỏ khi gõ
      if (Math.abs(total - 100) > 0.01) {
        toast.error("Tổng phần trăm phân bổ phải bằng 100%.");
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!campaign) return;
    if (!validateBeforeSave()) return;

    setSaving(true);
    try {
      let fileKey: string | undefined;
      if (selectedFile) {
        const upload = await uploadService.uploadCampaignCover(selectedFile, {
          campaignId: campaign.id,
        });
        fileKey = upload.fileKey;
      }

      // Validate phases
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        if (!phase.phaseName?.trim()) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu tên giai đoạn`);
          setSaving(false);
          return;
        }
        if (!phase.location?.trim()) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu địa điểm`);
          setSaving(false);
          return;
        }
        if (!phase.ingredientPurchaseDate) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu ngày mua nguyên liệu`);
          setSaving(false);
          return;
        }
        if (!phase.cookingDate) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu ngày nấu ăn`);
          setSaving(false);
          return;
        }
        if (!phase.deliveryDate) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu ngày giao hàng`);
          setSaving(false);
          return;
        }
      }

      // 1. Update campaign info (without phases)
      const campaignInput: UpdateCampaignInput = {
        title: campaign.title,
        description: campaign.description,
        targetAmount: campaign.targetAmount?.toString(),
        categoryId: campaign.category.id,

        fundraisingStartDate: campaign.fundraisingStartDate
          ? new Date(campaign.fundraisingStartDate).toISOString()
          : undefined,
        fundraisingEndDate: campaign.fundraisingEndDate
          ? new Date(campaign.fundraisingEndDate).toISOString()
          : undefined,

        // % phân bổ (string theo schema)
        ingredientBudgetPercentage: ingredientPct?.trim()
          ? Number(fromPercentInput(ingredientPct)).toFixed(2)
          : undefined,
        cookingBudgetPercentage: cookingPct?.trim()
          ? Number(fromPercentInput(cookingPct)).toFixed(2)
          : undefined,
        deliveryBudgetPercentage: deliveryPct?.trim()
          ? Number(fromPercentInput(deliveryPct)).toFixed(2)
          : undefined,

        ...(fileKey && { coverImageFileKey: fileKey }),
      };

      const updated = await campaignService.updateCampaign(campaign.id, campaignInput);

      // 2. Handle phases separately
      await handlePhasesUpdate(campaign.id);

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
          {/* Cover */}
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

          {/* Basic fields */}
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
                  const cat = categories.find((c) => c.id === val);
                  if (!cat) return;
                  handleChange("category", toCampaignCategory(cat));
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

            {/* Timeline gây quỹ */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Ngày bắt đầu gây quỹ
              </label>
              <Input
                type="date"
                value={isoDateOnly(campaign.fundraisingStartDate)}
                onChange={(e) =>
                  handleChange(
                    "fundraisingStartDate",
                    new Date(e.target.value).toISOString()
                  )
                }
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Ngày kết thúc gây quỹ
              </label>
              <Input
                type="date"
                value={isoDateOnly(campaign.fundraisingEndDate)}
                onChange={(e) =>
                  handleChange(
                    "fundraisingEndDate",
                    new Date(e.target.value).toISOString()
                  )
                }
                className="mt-2"
              />
            </div>

            {/* Budget phân bổ */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Phân bổ ngân sách (%)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Nguyên liệu</label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={ingredientPct}
                    onChange={(e) => setIngredientPct(e.target.value)}
                    placeholder="vd: 60 hoặc 60.00"
                  />
                  <p className="text-xs text-gray-500">
                    ≈ {formatCurrency(computedIngredientAmt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Nấu ăn</label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={cookingPct}
                    onChange={(e) => setCookingPct(e.target.value)}
                    placeholder="vd: 25 hoặc 25.00"
                  />
                  <p className="text-xs text-gray-500">
                    ≈ {formatCurrency(computedCookingAmt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Vận chuyển</label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={deliveryPct}
                    onChange={(e) => setDeliveryPct(e.target.value)}
                    placeholder="vd: 15 hoặc 15.00"
                  />
                  <p className="text-xs text-gray-500">
                    ≈ {formatCurrency(computedDeliveryAmt)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tổng 3 khoản nên bằng <b>100%</b>. Nếu server đã có số tiền phân
                bổ, con số phía trên là số thực tế (chỉ đọc); còn lại là ước
                tính theo % × mục tiêu.
              </p>
            </div>

            {/* Phases */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Giai đoạn thực hiện
                </span>
              </div>

              {phases.map((phase, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Giai đoạn {index + 1}</h4>
                    {phases.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePhase(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">Tên giai đoạn</label>
                      <Input
                        value={phase.phaseName}
                        onChange={(e) => updatePhase(index, 'phaseName', e.target.value)}
                        placeholder="Ví dụ: Giai đoạn 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">Địa điểm</label>
                      <LocationPicker
                        value={phase.location}
                        onChange={(location) => updatePhase(index, 'location', location)}
                        placeholder="Chọn địa điểm thực hiện"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">Ngày & giờ mua nguyên liệu</label>
                      <Input
                        type="datetime-local"
                        value={isoToLocalInput(phase.ingredientPurchaseDate)}
                        onChange={(e) => updatePhase(index, 'ingredientPurchaseDate',
                          localInputToIso(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">Ngày & giờ nấu ăn</label>
                      <Input
                        type="datetime-local"
                        value={isoToLocalInput(phase.cookingDate)}
                        onChange={(e) => updatePhase(index, 'cookingDate',
                          localInputToIso(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">Ngày & giờ giao hàng</label>
                      <Input
                        type="datetime-local"
                        value={isoToLocalInput(phase.deliveryDate)}
                        onChange={(e) => updatePhase(index, 'deliveryDate',
                          localInputToIso(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={addPhase}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm giai đoạn {phases.length + 1}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Thêm giai đoạn mới nếu chiến dịch cần nhiều địa điểm thực hiện
                </p>
              </div>
            </div>

            {/* Description */}
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

          {/* Actions */}
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
