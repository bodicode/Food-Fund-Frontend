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
import { BookOpen, CalendarDays, Goal, MapPin, Tag, Utensils, Leaf } from "lucide-react";
import { CreateCampaignInput } from "@/types/api/campaign";
import { TermsConditionsDialog } from "@/components/campaign/terms-conditions-dialog";
import { translateError } from "@/lib/translator";

export default function CreateCampaignStepPreview() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.campaignForm);

  const [loading, setLoading] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  const fmtDateTime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };



  const handleCreateCampaign = () => {
    if (!termsAccepted) {
      setShowTermsDialog(true);
      return;
    }
    handleSubmit();
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (!form.title?.trim()) {
        toast.error("Thiếu tiêu đề chiến dịch");
        setLoading(false);
        return;
      }

      if (!form.description?.trim()) {
        toast.error("Thiếu mô tả chiến dịch");
        setLoading(false);
        return;
      }

      if (!form.coverImageFileKey?.trim()) {
        toast.error("Thiếu ảnh bìa");
        setLoading(false);
        return;
      }

      if (!form.targetAmount) {
        toast.error("Thiếu mục tiêu quyên góp");
        setLoading(false);
        return;
      }

      if (!form.categoryId?.trim()) {
        toast.error("Thiếu danh mục");
        setLoading(false);
        return;
      }

      if (!form.phases || form.phases.length === 0) {
        toast.error("Thiếu thông tin giai đoạn thực hiện");
        setLoading(false);
        return;
      }

      // Validate phases
      for (let i = 0; i < form.phases.length; i++) {
        const phase = form.phases[i];
        if (!phase.phaseName?.trim()) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu tên giai đoạn`);
          setLoading(false);
          return;
        }
        if (!phase.location?.trim()) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu địa điểm`);
          setLoading(false);
          return;
        }
        if (!phase.ingredientPurchaseDate) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu ngày mua nguyên liệu`);
          setLoading(false);
          return;
        }
        if (!phase.cookingDate) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu ngày nấu ăn`);
          setLoading(false);
          return;
        }
        if (!phase.deliveryDate) {
          toast.error(`Giai đoạn ${i + 1}: Thiếu ngày giao hàng`);
          setLoading(false);
          return;
        }
      }

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

      const startISO = form.fundraisingStartDate!;
      const endISO = form.fundraisingEndDate!;
      if (parseLocalDateTime(startISO) > parseLocalDateTime(endISO)) {
        toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
        setLoading(false);
        return;
      }

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

      // Add 7 hours to compensate for UTC conversion
      const phasesIso = form.phases!.map((p) => ({
        phaseName: p.phaseName,
        location: p.location,
        ingredientPurchaseDate: addSevenHours(p.ingredientPurchaseDate || ""),
        cookingDate: addSevenHours(p.cookingDate || ""),
        deliveryDate: addSevenHours(p.deliveryDate || ""),
        ingredientBudgetPercentage: p.ingredientBudgetPercentage,
        cookingBudgetPercentage: p.cookingBudgetPercentage,
        deliveryBudgetPercentage: p.deliveryBudgetPercentage,
        plannedMeals: p.plannedMeals,
        plannedIngredients: p.plannedIngredients,
      }));

      const input: CreateCampaignInput = {
        title: form.title!,
        description: form.description!,
        coverImageFileKey: form.coverImageFileKey!,
        targetAmount: String(form.targetAmount!),
        categoryId: form.categoryId!,
        fundraisingStartDate: addSevenHours(startISO),
        fundraisingEndDate: addSevenHours(endISO),
        phases: phasesIso,
      };

      try {
        const result = await campaignService.createCampaign(input);

        if (result) {
          toast.success("Chiến dịch đã được tạo thành công!");
          dispatch(resetForm());
          router.push("/profile?tab=campaigns");
        }
      } catch (error) {
        const errorMessage = translateError(error);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } catch {
      toast.error("Có lỗi không mong muốn xảy ra. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const milestones = [
    {
      key: "fundraisingStartDate",
      label: "Bắt đầu gây quỹ",
      datetime: fmtDateTime(form.fundraisingStartDate),
    },
    {
      key: "fundraisingEndDate",
      label: "Kết thúc gây quỹ",
      datetime: fmtDateTime(form.fundraisingEndDate),
    },
    ...(form.phases || []).flatMap((phase, index: number) => [
      {
        key: `phase-${index}-ingredient`,
        label: `${phase.phaseName || ""} - Mua nguyên liệu`,
        datetime: fmtDateTime(phase.ingredientPurchaseDate || ""),
      },
      {
        key: `phase-${index}-cooking`,
        label: `${phase.phaseName || ""} - Nấu ăn`,
        datetime: fmtDateTime(phase.cookingDate || ""),
      },
      {
        key: `phase-${index}-delivery`,
        label: `${phase.phaseName || ""} - Giao hàng`,
        datetime: fmtDateTime(phase.deliveryDate || ""),
      },
    ]),
  ].filter((m) => m.datetime);

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
                Số giai đoạn
              </p>
              <p className="font-medium">
                {form.phases?.length || 0} giai đoạn
              </p>
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
                Thời gian gây quỹ
              </p>
              <p className="font-medium">
                {(form.fundraisingStartDate &&
                  fmtDateTime(form.fundraisingStartDate)) ||
                  "—"}{" "}
                →{" "}
                {(form.fundraisingEndDate &&
                  fmtDateTime(form.fundraisingEndDate)) ||
                  "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Phases Section */}
        {form.phases && form.phases.length > 0 && (
          <div className="mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
              Giai đoạn thực hiện
            </h2>
            <div className="space-y-4">
              {form.phases.map((phase, index: number) => {
                const phaseBudgetSum =
                  parseFloat((phase.ingredientBudgetPercentage as string) || "0") +
                  parseFloat((phase.cookingBudgetPercentage as string) || "0") +
                  parseFloat((phase.deliveryBudgetPercentage as string) || "0");
                const phaseBudgetValid = Math.abs(phaseBudgetSum - 100) <= 0.01;

                return (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {(phase.phaseName as string) || ""}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Địa điểm:</span>
                        <p className="font-medium">{(phase.location as string) || "—"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Mua nguyên liệu:</span>
                        <p className="font-medium">
                          {fmtDateTime((phase.ingredientPurchaseDate as string) || "") || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Nấu ăn:</span>
                        <p className="font-medium">
                          {fmtDateTime((phase.cookingDate as string) || "") || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Giao hàng:</span>
                        <p className="font-medium">
                          {fmtDateTime(phase.deliveryDate) || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Phase Budget */}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Phân bổ ngân sách giai đoạn
                        </span>
                        <span
                          className={`text-xs ${phaseBudgetValid ? "text-gray-600" : "text-red-600"
                            }`}
                        >
                          Tổng: {phaseBudgetSum.toFixed(2)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white p-2 rounded border">
                          <div className="text-gray-500 mb-1">Nguyên liệu</div>
                          <div className="font-semibold text-gray-900">
                            {phase.ingredientBudgetPercentage || "0"}%
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <div className="text-gray-500 mb-1">Nấu ăn</div>
                          <div className="font-semibold text-gray-900">
                            {phase.cookingBudgetPercentage || "0"}%
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <div className="text-gray-500 mb-1">Giao hàng</div>
                          <div className="font-semibold text-gray-900">
                            {phase.deliveryBudgetPercentage || "0"}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Planned Meals */}
                    {phase.plannedMeals && phase.plannedMeals.length > 0 && (
                      <div className="border-t pt-3 mt-3">
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                          <Utensils className="w-4 h-4 text-orange-500" />
                          <span>Món ăn dự kiến</span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {phase.plannedMeals.map((meal, idx) => (
                            <li key={idx} className="bg-white px-3 py-2 rounded border border-gray-100 text-sm flex justify-between items-center">
                              <span className="font-medium text-gray-800">{meal.name}</span>
                              <span className="text-gray-500 bg-gray-50 px-2 py-0.5 rounded text-xs border">
                                x{meal.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Planned Ingredients */}
                    {phase.plannedIngredients && phase.plannedIngredients.length > 0 && (
                      <div className="border-t pt-3 mt-3">
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                          <Leaf className="w-4 h-4 text-green-500" />
                          <span>Nguyên liệu dự kiến</span>
                        </div>
                        <div className="bg-white rounded border p-3">
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {phase.plannedIngredients.map((ing, idx) => (
                              <li key={idx} className="flex items-center justify-between border-b last:border-0 border-gray-100 border-dashed pb-1">
                                <span className="text-gray-600 truncate mr-2" title={ing.name}>{ing.name}</span>
                                <span className="font-medium text-gray-900 whitespace-nowrap">
                                  {ing.quantity} {ing.unit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {milestones.length > 0 && (
          <div className="mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
              Lộ trình chiến dịch
            </h2>

            <div className="md:hidden space-y-4">
              {milestones.map((m) => (
                <div
                  key={m.key}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-sky-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {m.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {m.datetime}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="space-y-6">
                {milestones.map((m, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <div
                      key={m.key}
                      className="grid grid-cols-[1fr_32px_1fr] items-stretch gap-x-6"
                    >
                      <div
                        className={
                          isLeft ? "" : "opacity-0 pointer-events-none"
                        }
                      >
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarDays className="w-4 h-4 text-sky-500" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {m.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {m.datetime}
                          </p>
                        </div>
                      </div>

                      <div className="relative flex items-center">
                        <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-gray-200 dark:bg-gray-700" />

                        <span className="relative z-10 mx-auto w-3.5 h-3.5 rounded-full bg-sky-400 ring-4 ring-white dark:ring-slate-900 shadow" />
                      </div>

                      <div
                        className={
                          !isLeft ? "" : "opacity-0 pointer-events-none"
                        }
                      >
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarDays className="w-4 h-4 text-sky-500" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {m.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {m.datetime}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-2 text-gray-800 mt-8">
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

        <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4">
          <Button
            variant="outline"
            onClick={() => handleEdit("/register/campaign/story")}
            className="h-12 px-6 w-full sm:w-auto"
          >
            ← Chỉnh sửa
          </Button>

          <Button
            onClick={handleCreateCampaign}
            disabled={loading}
            className={`h-12 px-6 w-full sm:w-auto text-base font-semibold flex items-center justify-center gap-2 ${loading ? "bg-gray-300 text-gray-500" : "btn-color text-white"
              }`}
          >
            {loading && <Loader className="animate-spin w-5 h-5" />}
            {loading ? "Đang tạo..." : "Tạo chiến dịch"}
          </Button>
        </div>

        <TermsConditionsDialog
          open={showTermsDialog}
          onOpenChange={setShowTermsDialog}
          onAccept={handleTermsAccept}
        />
      </div>
    </div>
  );
}
