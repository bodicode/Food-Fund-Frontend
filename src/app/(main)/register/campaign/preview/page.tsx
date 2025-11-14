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
import { CreateCampaignInput } from "@/types/api/campaign";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { TermsConditionsDialog } from "@/components/campaign/terms-conditions-dialog";

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

  // ===== Budget preview =====
  const target = Number(form.targetAmount ?? 0);
  const iPct = parseFloat(String(form.ingredientBudgetPercentage ?? "0"));
  const cPct = parseFloat(String(form.cookingBudgetPercentage ?? "0"));
  const dPct = parseFloat(String(form.deliveryBudgetPercentage ?? "0"));

  const iAmt = Math.round((target * (isFinite(iPct) ? iPct : 0)) / 100);
  const cAmt = Math.round((target * (isFinite(cPct) ? cPct : 0)) / 100);
  const dAmt = Math.round((target * (isFinite(dPct) ? dPct : 0)) / 100);

  const pctSum =
    (isFinite(iPct) ? iPct : 0) +
    (isFinite(cPct) ? cPct : 0) +
    (isFinite(dPct) ? dPct : 0);
  const pctOk = Math.abs(pctSum - 100) <= 0.01;

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

      const startISO = new Date(form.fundraisingStartDate!).toISOString();
      const endISO = new Date(form.fundraisingEndDate!).toISOString();
      if (new Date(startISO) > new Date(endISO)) {
        toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
        setLoading(false);
        return;
      }

      // Normalize phases' datetime values to ISO strings to avoid timezone drift
      const phasesIso = form.phases!.map((p) => ({
        ...p,
        ingredientPurchaseDate: p.ingredientPurchaseDate
          ? new Date(p.ingredientPurchaseDate).toISOString()
          : "",
        cookingDate: p.cookingDate ? new Date(p.cookingDate).toISOString() : "",
        deliveryDate: p.deliveryDate
          ? new Date(p.deliveryDate).toISOString()
          : "",
      }));

      const input: CreateCampaignInput = {
        title: form.title!,
        description: form.description!,
        coverImageFileKey: form.coverImageFileKey!,
        targetAmount: String(form.targetAmount!),
        categoryId: form.categoryId!,
        ingredientBudgetPercentage: form.ingredientBudgetPercentage!,
        cookingBudgetPercentage: form.cookingBudgetPercentage!,
        deliveryBudgetPercentage: form.deliveryBudgetPercentage!,
        fundraisingStartDate: startISO,
        fundraisingEndDate: endISO,
        phases: phasesIso,
      };

      const result = await campaignService.createCampaign(input);

      if (result) {
        toast.success("Chiến dịch đã được tạo thành công!");
        dispatch(resetForm());
        router.push("/profile?tab=campaigns");
      } else {
        console.error("Create campaign returned null");
        toast.error("Tạo chiến dịch thất bại. Server không trả về dữ liệu.");
      }
    } catch (err) {
      console.error("Create campaign error:", err);

      // Extract error message from GraphQL error or use default
      let errorMessage = "Tạo chiến dịch thất bại. Vui lòng thử lại!";

      if (err && typeof err === "object") {
        // Handle GraphQL errors
        if (
          "graphQLErrors" in err &&
          Array.isArray(
            (err as { graphQLErrors: Array<{ message?: string }> })
              .graphQLErrors
          ) &&
          (err as { graphQLErrors: Array<{ message?: string }> }).graphQLErrors
            .length > 0
        ) {
          errorMessage =
            (err as { graphQLErrors: Array<{ message?: string }> })
              .graphQLErrors[0].message || errorMessage;
        }
        // Handle network errors
        else if (
          "networkError" in err &&
          (err as { networkError: unknown }).networkError
        ) {
          errorMessage = "Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.";
        }
        // Handle other error formats
        else if ("message" in err) {
          errorMessage = (err as { message?: string }).message || errorMessage;
        }
      }

      toast.error(errorMessage);
    } finally {
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
    ...(form.phases || []).flatMap((phase, index) => [
      {
        key: `phase-${index}-ingredient`,
        label: `${phase.phaseName} - Mua nguyên liệu`,
        datetime: fmtDateTime(phase.ingredientPurchaseDate),
      },
      {
        key: `phase-${index}-cooking`,
        label: `${phase.phaseName} - Nấu ăn`,
        datetime: fmtDateTime(phase.cookingDate),
      },
      {
        key: `phase-${index}-delivery`,
        label: `${phase.phaseName} - Giao hàng`,
        datetime: fmtDateTime(phase.deliveryDate),
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

        {/* ===== Budget breakdown ===== */}
        <div className="mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Phân bổ ngân sách
            </h2>
            <span
              className={`text-sm ${
                pctOk ? "text-gray-600" : "text-red-600 font-medium"
              }`}
            >
              Tổng: {pctSum.toFixed(2)}% {!pctOk && "— Tổng phải bằng 100%"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nguyên liệu */}
            <div className="rounded-2xl border p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-800">Nguyên liệu</h4>
                <span className="text-sm text-gray-500">
                  {isFinite(iPct) ? iPct.toFixed(2) : "0.00"}%
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {formatCurrency(iAmt)}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-[#E77731]"
                  style={{ width: `${Math.max(0, Math.min(100, iPct || 0))}%` }}
                />
              </div>
            </div>

            {/* Nấu ăn */}
            <div className="rounded-2xl border p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-800">Nấu ăn</h4>
                <span className="text-sm text-gray-500">
                  {isFinite(cPct) ? cPct.toFixed(2) : "0.00"}%
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {formatCurrency(cAmt)}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-[#E77731]"
                  style={{ width: `${Math.max(0, Math.min(100, cPct || 0))}%` }}
                />
              </div>
            </div>

            {/* Giao hàng */}
            <div className="rounded-2xl border p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-800">Giao hàng</h4>
                <span className="text-sm text-gray-500">
                  {isFinite(dPct) ? dPct.toFixed(2) : "0.00"}%
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {formatCurrency(dAmt)}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-[#E77731]"
                  style={{ width: `${Math.max(0, Math.min(100, dPct || 0))}%` }}
                />
              </div>
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
              {form.phases.map((phase, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {phase.phaseName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Địa điểm:</span>
                      <p className="font-medium">{phase.location || "—"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Mua nguyên liệu:</span>
                      <p className="font-medium">
                        {fmtDateTime(phase.ingredientPurchaseDate) || "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Nấu ăn:</span>
                      <p className="font-medium">
                        {fmtDateTime(phase.cookingDate) || "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Giao hàng:</span>
                      <p className="font-medium">
                        {fmtDateTime(phase.deliveryDate) || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
            className={`h-12 px-6 w-full sm:w-auto text-base font-semibold flex items-center justify-center gap-2 ${
              loading ? "bg-gray-300 text-gray-500" : "btn-color text-white"
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
