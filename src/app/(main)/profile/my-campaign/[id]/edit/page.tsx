"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, Plus, Trash2, MapPin } from "lucide-react";

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
import { DateTimeInput } from "@/components/ui/date-time-input";
import {
  formatPercent,
  isValidPercentInput,
  normalizePercentOnBlur,
  parsePercent,
} from "@/lib/utils/percent-utils";
import { formatCurrency, parseCurrency } from "@/lib/utils/currency-utils";
import { getCampaignIdFromSlug, createCampaignSlug } from "@/lib/utils/slug-utils";

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

  const [phases, setPhases] = useState<CreatePhaseInput[]>([]);
  const [existingPhases, setExistingPhases] = useState<CampaignPhase[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Get actual campaign ID from sessionStorage
        const slug = id as string;
        const campaignId = getCampaignIdFromSlug(slug);
        
        if (!campaignId) {
          setLoading(false);
          return;
        }
        
        const [campaignData, categoryData] = await Promise.all([
          campaignService.getCampaignById(campaignId),
          categoryService.getCategories(),
        ]);
        setCampaign(campaignData);
        setCategories(categoryData);
        setPreviewImage(campaignData?.coverImage || "");

        if (campaignData) {
          // Try to load phases, fallback to default if not available
          try {
            if (
              campaignData.phases &&
              Array.isArray(campaignData.phases) &&
              campaignData.phases.length > 0
            ) {
              const loadedPhases = campaignData.phases as CampaignPhase[];
              setExistingPhases(loadedPhases);
              setPhases(
                loadedPhases.map((phase) => ({
                  phaseName: phase?.phaseName || "",
                  location: phase?.location || "",
                  ingredientPurchaseDate: phase?.ingredientPurchaseDate || "",
                  cookingDate: phase?.cookingDate || "",
                  deliveryDate: phase?.deliveryDate || "",
                  ingredientBudgetPercentage: phase?.ingredientBudgetPercentage || "",
                  cookingBudgetPercentage: phase?.cookingBudgetPercentage || "",
                  deliveryBudgetPercentage: phase?.deliveryBudgetPercentage || "",
                }))
              );
            } else {
              setExistingPhases([]);

              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);

              const purchaseTime = new Date(tomorrow);
              purchaseTime.setHours(8, 0, 0, 0); // 8:00 AM

              const cookingTime = new Date(tomorrow);
              cookingTime.setHours(10, 0, 0, 0); // 10:00 AM

              const deliveryTime = new Date(tomorrow);
              deliveryTime.setHours(14, 0, 0, 0); // 2:00 PM

              setPhases([
                {
                  phaseName: "Giai đoạn 1",
                  location: "",
                  ingredientPurchaseDate: purchaseTime.toISOString(),
                  cookingDate: cookingTime.toISOString(),
                  deliveryDate: deliveryTime.toISOString(),
                  ingredientBudgetPercentage: "0",
                  cookingBudgetPercentage: "0",
                  deliveryBudgetPercentage: "0",
                },
              ]);
            }
          } catch {
            setExistingPhases([]);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const purchaseTime = new Date(tomorrow);
            purchaseTime.setHours(8, 0, 0, 0); // 8:00 AM

            const cookingTime = new Date(tomorrow);
            cookingTime.setHours(10, 0, 0, 0); // 10:00 AM

            const deliveryTime = new Date(tomorrow);
            deliveryTime.setHours(14, 0, 0, 0); // 2:00 PM

            setPhases([
              {
                phaseName: "Giai đoạn 1",
                location: "",
                ingredientPurchaseDate: purchaseTime.toISOString(),
                cookingDate: cookingTime.toISOString(),
                deliveryDate: deliveryTime.toISOString(),
                ingredientBudgetPercentage: "0",
                cookingBudgetPercentage: "0",
                deliveryBudgetPercentage: "0",
              },
            ]);
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

  const updatePhase = (
    index: number,
    field: keyof CreatePhaseInput,
    value: string
  ) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setPhases(newPhases);
  };

  const addPhase = () => {
    // Validate existing phases before adding new one
    if (!validatePhases()) {
      toast.error("Vui lòng hoàn thành các giai đoạn hiện tại trước khi thêm giai đoạn mới.");
      return;
    }

    // Calculate default times for new phase based on last phase
    let baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1);

    if (phases.length > 0) {
      const lastPhase = phases[phases.length - 1];
      if (lastPhase.deliveryDate) {
        // Start new phase 1 day after last phase delivery
        baseDate = new Date(lastPhase.deliveryDate);
        baseDate.setDate(baseDate.getDate() + 1);
      }
    }

    // Set default times
    const purchaseTime = new Date(baseDate);
    purchaseTime.setHours(8, 0, 0, 0); // 8:00 AM

    const cookingTime = new Date(baseDate);
    cookingTime.setHours(10, 0, 0, 0); // 10:00 AM

    const deliveryTime = new Date(baseDate);
    deliveryTime.setHours(14, 0, 0, 0); // 2:00 PM

    setPhases([
      ...phases,
      {
        phaseName: `Giai đoạn ${phases.length + 1}`,
        location: "",
        ingredientPurchaseDate: purchaseTime.toISOString(),
        cookingDate: cookingTime.toISOString(),
        deliveryDate: deliveryTime.toISOString(),
        ingredientBudgetPercentage: "0",
        cookingBudgetPercentage: "0",
        deliveryBudgetPercentage: "0",
      },
    ]);
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



  // Parse ISO strings without timezone conversion
  const parseLocalDateTime = (isoString: string): Date => {
    const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) {
      return new Date(
        parseInt(match[1]),
        parseInt(match[2]) - 1,
        parseInt(match[3]),
        parseInt(match[4]),
        parseInt(match[5])
      );
    }
    return new Date(isoString);
  };

  // Get validation errors for a specific phase's dates
  const getPhaseTimelineErrors = (phaseIndex: number): string[] => {
    const errors: string[] = [];
    const phase = phases[phaseIndex];
    const fundEnd = campaign?.fundraisingEndDate;

    if (!phase.ingredientPurchaseDate || !phase.cookingDate || !phase.deliveryDate) {
      return errors;
    }

    const ingDate = parseLocalDateTime(phase.ingredientPurchaseDate);
    const cookDate = parseLocalDateTime(phase.cookingDate);
    const deliveryDate = parseLocalDateTime(phase.deliveryDate);

    // Validate dates are valid
    if (isNaN(ingDate.getTime()) || isNaN(cookDate.getTime()) || isNaN(deliveryDate.getTime())) {
      return errors;
    }

    // Check phase timeline order
    if (cookDate <= ingDate) {
      errors.push("Thời gian nấu ăn phải sau thời gian mua nguyên liệu");
    }
    if (deliveryDate <= cookDate) {
      errors.push("Thời gian giao hàng phải sau thời gian nấu ăn");
    }

    // Check phase cannot start before fundraising ends
    if (fundEnd) {
      const fundEndDate = parseLocalDateTime(fundEnd);
      if (ingDate <= fundEndDate) {
        errors.push("Thời gian thực hiện phải sau ngày kết thúc gây quỹ (không thể cùng ngày)");
      }
    }

    // Check against previous phases
    if (phaseIndex > 0) {
      const prevPhase = phases[phaseIndex - 1];
      if (prevPhase.deliveryDate) {
        const prevDeliveryDate = parseLocalDateTime(prevPhase.deliveryDate);
        if (isNaN(prevDeliveryDate.getTime())) {
          return errors;
        }

        if (ingDate < prevDeliveryDate) {
          errors.push(`Giai đoạn này phải bắt đầu sau Giai đoạn ${phaseIndex}`);
        }
      }
    }

    return errors;
  };



  const handlePhasesUpdate = async (campaignId: string) => {
    try {
      // Helper to add 7 hours to ISO string to compensate for UTC conversion
      const addSevenHours = (isoString: string): string => {
        if (!isoString) return "";
        const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
        if (!match) return isoString;
        
        const date = new Date(
          parseInt(match[1]),
          parseInt(match[2]) - 1,
          parseInt(match[3]),
          parseInt(match[4]),
          parseInt(match[5])
        );
        date.setHours(date.getHours() + 7);
        return date.toISOString();
      };

      // Sync phases - backend will handle create/update/delete
      const syncPhases = phases.map((phase, index) => ({
        id: existingPhases[index]?.id, // Include ID if updating existing phase
        phaseName: phase.phaseName,
        location: phase.location,
        ingredientPurchaseDate: addSevenHours(phase.ingredientPurchaseDate),
        cookingDate: addSevenHours(phase.cookingDate),
        deliveryDate: addSevenHours(phase.deliveryDate),
        ingredientBudgetPercentage: phase.ingredientBudgetPercentage || "0",
        cookingBudgetPercentage: phase.cookingBudgetPercentage || "0",
        deliveryBudgetPercentage: phase.deliveryBudgetPercentage || "0",
      }));

      await phaseService.syncCampaignPhases(campaignId, syncPhases);
      
    } catch (error) {
      console.error("❌ Error syncing phases:", error);
      throw error;
    }
  };

  const validatePhases = () => {
    // Check all phases have required fields
    const allFieldsFilled = phases.every((phase) => {
      return (
        phase.phaseName?.trim() &&
        phase.location?.trim() &&
        phase.ingredientPurchaseDate?.trim() &&
        phase.cookingDate?.trim() &&
        phase.deliveryDate?.trim() &&
        (phase.ingredientBudgetPercentage !== undefined && phase.ingredientBudgetPercentage !== "") &&
        (phase.cookingBudgetPercentage !== undefined && phase.cookingBudgetPercentage !== "") &&
        (phase.deliveryBudgetPercentage !== undefined && phase.deliveryBudgetPercentage !== "")
      );
    });

    if (!allFieldsFilled) return false;

    if (phases.length === 1) {
      // Single phase: its budget must equal 100%
      const phaseBudgetSum =
        parsePercent(phases[0].ingredientBudgetPercentage || "0") +
        parsePercent(phases[0].cookingBudgetPercentage || "0") +
        parsePercent(phases[0].deliveryBudgetPercentage || "0");
      return Math.abs(phaseBudgetSum - 100) <= 0.5;
    } else {
      // Multiple phases: total budget of all phases must equal 100%
      const totalBudget = phases.reduce((sum, phase) => {
        return (
          sum +
          parsePercent(phase.ingredientBudgetPercentage || "0") +
          parsePercent(phase.cookingBudgetPercentage || "0") +
          parsePercent(phase.deliveryBudgetPercentage || "0")
        );
      }, 0);
      return Math.abs(totalBudget - 100) <= 0.5;
    }
  };

  const timelineValidation = (() => {
    const fundStart = campaign?.fundraisingStartDate;
    const fundEnd = campaign?.fundraisingEndDate;

    if (!fundStart || !fundEnd) {
      return { isValid: false, errors: [] };
    }

    const errors: string[] = [];
    
    // Parse ISO strings without timezone conversion
    const parseLocalDateTime = (isoString: string): Date => {
      const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (match) {
        return new Date(
          parseInt(match[1]),
          parseInt(match[2]) - 1,
          parseInt(match[3]),
          parseInt(match[4]),
          parseInt(match[5])
        );
      }
      return new Date(isoString);
    };

    const fundStartDate = parseLocalDateTime(fundStart);
    const fundEndDate = parseLocalDateTime(fundEnd);
    const now = new Date();
    
    // Set now to start of today for comparison
    now.setHours(0, 0, 0, 0);
    const fundStartDateOnly = new Date(fundStartDate);
    fundStartDateOnly.setHours(0, 0, 0, 0);

    // Check 0: Start date must be in the future (not today or past)
    if (fundStartDateOnly <= now) {
      errors.push("Thời gian bắt đầu gây quỹ phải là ngày trong tương lai");
    }

    // Check 1: Start < End (with hour and minute precision)
    if (fundEndDate <= fundStartDate) {
      errors.push("Thời gian kết thúc gây quỹ phải sau thời gian bắt đầu");
    }

    // Check phases - only validate if all dates are filled
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      if (
        !phase.ingredientPurchaseDate ||
        !phase.cookingDate ||
        !phase.deliveryDate
      ) {
        continue;
      }

      const ingDate = parseLocalDateTime(phase.ingredientPurchaseDate);
      const cookDate = parseLocalDateTime(phase.cookingDate);
      const deliveryDate = parseLocalDateTime(phase.deliveryDate);

      // Validate dates are valid
      if (isNaN(ingDate.getTime()) || isNaN(cookDate.getTime()) || isNaN(deliveryDate.getTime())) {
        continue;
      }

      // Check 2: Phase timeline order (ingredient < cooking < delivery)
      if (cookDate <= ingDate) {
        errors.push(
          `Giai đoạn ${i + 1}: Thời gian nấu ăn phải sau thời gian mua nguyên liệu`
        );
      }
      if (deliveryDate <= cookDate) {
        errors.push(
          `Giai đoạn ${i + 1}: Thời gian giao hàng phải sau thời gian nấu ăn`
        );
      }

      // Check 3: Phase cannot start before fundraising ends
      if (ingDate <= fundEndDate) {
        errors.push(
          `Giai đoạn ${i + 1}: Thời gian thực hiện phải sau ngày kết thúc gây quỹ (không thể cùng ngày)`
        );
      }

      // Check 4: Compare with previous phases
      if (i > 0) {
        const prevPhase = phases[i - 1];
        if (
          prevPhase.ingredientPurchaseDate &&
          prevPhase.cookingDate &&
          prevPhase.deliveryDate
        ) {
          const prevIngDate = parseLocalDateTime(prevPhase.ingredientPurchaseDate);
          const prevCookDate = parseLocalDateTime(prevPhase.cookingDate);
          const prevDeliveryDate = parseLocalDateTime(prevPhase.deliveryDate);

          // Validate previous dates are valid
          if (isNaN(prevIngDate.getTime()) || isNaN(prevCookDate.getTime()) || isNaN(prevDeliveryDate.getTime())) {
            continue;
          }

          // Check 5: Phases cannot overlap
          if (ingDate < prevDeliveryDate) {
            errors.push(
              `Giai đoạn ${i + 1} và Giai đoạn ${i} không được trùng ngày`
            );
          }

          // Check 6: Later phase cannot start before earlier phase
          if (ingDate < prevIngDate) {
            errors.push(
              `Giai đoạn ${i + 1} không thể sớm hơn Giai đoạn ${i}`
            );
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  })();

  const validateBeforeSave = () => {
    if (!validatePhases()) {
      toast.error(
        "Vui lòng điền đầy đủ thông tin các giai đoạn và ngân sách mỗi giai đoạn phải bằng 100%."
      );
      return false;
    }

    if (!timelineValidation.isValid) {
      timelineValidation.errors.forEach((error) => toast.error(error));
      return false;
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

      // 1. Update campaign info (without phases and budget percentages)
      const campaignInput: UpdateCampaignInput = {
        title: campaign.title,
        description: campaign.description,
        targetAmount: campaign.targetAmount?.toString(),
        categoryId: campaign.category.id,

        fundraisingStartDate: campaign.fundraisingStartDate,
        fundraisingEndDate: campaign.fundraisingEndDate,

        ...(fileKey && { coverImageFileKey: fileKey }),
      };

      const updated = await campaignService.updateCampaign(
        campaign.id,
        campaignInput
      );

      if (!updated) {
        toast.error("Không thể cập nhật chiến dịch.");
        setSaving(false);
        return;
      }

      // 2. Handle phases separately
      await handlePhasesUpdate(campaign.id);

      toast.success("Cập nhật chiến dịch thành công!");
      const slug = createCampaignSlug(updated.title, updated.id);
      router.push(`/profile/my-campaign/${slug}`);
    } catch (err) {
      console.error("❌ Error updating campaign:", err);
      const errorMessage = err instanceof Error ? err.message : "Cập nhật thất bại. Vui lòng thử lại!";
      toast.error(errorMessage);
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
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Bắt đầu gây quỹ
              </label>
              <DateTimeInput
                value={campaign.fundraisingStartDate || ""}
                onChange={(value) =>
                  handleChange("fundraisingStartDate", value)
                }
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Kết thúc gây quỹ
              </label>
              <DateTimeInput
                value={campaign.fundraisingEndDate || ""}
                onChange={(value) =>
                  handleChange("fundraisingEndDate", value)
                }
              />
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
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      Giai đoạn {index + 1}
                    </h4>
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
                      <label className="text-xs text-gray-600">
                        Tên giai đoạn
                      </label>
                      <Input
                        value={phase.phaseName}
                        onChange={(e) =>
                          updatePhase(index, "phaseName", e.target.value)
                        }
                        placeholder="Ví dụ: Giai đoạn 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">Địa điểm</label>
                      <LocationPicker
                        value={phase.location}
                        onChange={(location) =>
                          updatePhase(index, "location", location)
                        }
                        placeholder="Chọn địa điểm thực hiện"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">
                        Mua nguyên liệu
                      </label>
                      <DateTimeInput
                        value={phase.ingredientPurchaseDate}
                        onChange={(value) =>
                          updatePhase(index, "ingredientPurchaseDate", value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">
                        Nấu ăn
                      </label>
                      <DateTimeInput
                        value={phase.cookingDate}
                        onChange={(value) =>
                          updatePhase(index, "cookingDate", value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600">
                        Giao hàng
                      </label>
                      <DateTimeInput
                        value={phase.deliveryDate}
                        onChange={(value) =>
                          updatePhase(index, "deliveryDate", value)
                        }
                      />
                    </div>
                  </div>

                  {/* Timeline validation errors */}
                  {getPhaseTimelineErrors(index).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-red-800 mb-1">Lỗi thời gian:</p>
                      <ul className="text-xs text-red-700 space-y-1">
                        {getPhaseTimelineErrors(index).map((error, idx) => (
                          <li key={idx}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Phân bổ ngân sách giai đoạn này (%)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-600">
                          Nguyên liệu
                        </label>
                        <Input
                          inputMode="decimal"
                          placeholder="%"
                          value={phase.ingredientBudgetPercentage}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (isValidPercentInput(raw)) {
                              updatePhase(
                                index,
                                "ingredientBudgetPercentage",
                                raw
                              );
                            }
                          }}
                          onBlur={() => {
                            updatePhase(
                              index,
                              "ingredientBudgetPercentage",
                              normalizePercentOnBlur(
                                phase.ingredientBudgetPercentage
                              )
                            );
                          }}
                          className="h-10 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">
                          Nấu ăn
                        </label>
                        <Input
                          inputMode="decimal"
                          placeholder="%"
                          value={phase.cookingBudgetPercentage}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (isValidPercentInput(raw)) {
                              updatePhase(
                                index,
                                "cookingBudgetPercentage",
                                raw
                              );
                            }
                          }}
                          onBlur={() => {
                            updatePhase(
                              index,
                              "cookingBudgetPercentage",
                              normalizePercentOnBlur(
                                phase.cookingBudgetPercentage
                              )
                            );
                          }}
                          className="h-10 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">
                          Giao hàng
                        </label>
                        <Input
                          inputMode="decimal"
                          placeholder="%"
                          value={phase.deliveryBudgetPercentage}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (isValidPercentInput(raw)) {
                              updatePhase(
                                index,
                                "deliveryBudgetPercentage",
                                raw
                              );
                            }
                          }}
                          onBlur={() => {
                            updatePhase(
                              index,
                              "deliveryBudgetPercentage",
                              normalizePercentOnBlur(
                                phase.deliveryBudgetPercentage
                              )
                            );
                          }}
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        Math.abs(
                          parsePercent(phase.ingredientBudgetPercentage || "0") +
                          parsePercent(phase.cookingBudgetPercentage || "0") +
                          parsePercent(phase.deliveryBudgetPercentage || "0") -
                          100
                        ) <= 0.5
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Tổng giai đoạn này: {formatPercent(
                        parsePercent(phase.ingredientBudgetPercentage || "0") +
                        parsePercent(phase.cookingBudgetPercentage || "0") +
                        parsePercent(phase.deliveryBudgetPercentage || "0")
                      )}%
                      {phases.length === 1 &&
                        Math.abs(
                          parsePercent(phase.ingredientBudgetPercentage || "0") +
                          parsePercent(phase.cookingBudgetPercentage || "0") +
                          parsePercent(phase.deliveryBudgetPercentage || "0") -
                          100
                        ) > 0.5 && " — Phải bằng 100%"}
                    </p>
                  </div>
                </div>
              ))}

              {/* Total Budget Summary for Multiple Phases */}
              {phases.length > 1 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Tổng ngân sách của tất cả giai đoạn:
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPercent(
                        phases.reduce((sum, phase) => {
                          return (
                            sum +
                            parsePercent(phase.ingredientBudgetPercentage || "0") +
                            parsePercent(phase.cookingBudgetPercentage || "0") +
                            parsePercent(phase.deliveryBudgetPercentage || "0")
                          );
                        }, 0)
                      )}
                      %
                    </span>
                    <span className={`text-sm ${Math.abs(
                        phases.reduce((sum, phase) => {
                          return (
                            sum +
                            parsePercent(phase.ingredientBudgetPercentage || "0") +
                            parsePercent(phase.cookingBudgetPercentage || "0") +
                            parsePercent(phase.deliveryBudgetPercentage || "0")
                          );
                        }, 0) - 100
                      ) <= 0.5
                        ? "text-green-700"
                        : "text-red-700"}`}
                    >
                      {Math.abs(
                        phases.reduce((sum, phase) => {
                          return (
                            sum +
                            parsePercent(phase.ingredientBudgetPercentage || "0") +
                            parsePercent(phase.cookingBudgetPercentage || "0") +
                            parsePercent(phase.deliveryBudgetPercentage || "0")
                          );
                        }, 0) - 100
                      ) <= 0.5
                        ? "✓ Hợp lệ"
                        : "✗ Chưa đúng"}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={addPhase}
                  className="flex items-center gap-2 mx-auto"
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
