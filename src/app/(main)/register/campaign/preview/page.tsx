"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "../../../../../store";
import { resetForm } from "../../../../../store/slices/campaign-form-slice";
import { campaignService } from "../../../../../services/campaign.service";
import { categoryService } from "../../../../../services/category.service";
import { toast } from "sonner";

import { Button } from "../../../../../components/ui/button";
import { Loader } from "../../../../../components/animate-ui/icons/loader";
import { buildCoverUrl } from "../../../../../lib/build-image";
import {
  BookOpen,
  CalendarDays,
  Goal,
  MapPin,
  Tag,
  Utensils,
  Leaf,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { CreateCampaignInput } from "../../../../../types/api/campaign";
import { CreatePhaseInput, PlannedMeal, PlannedIngredient } from "../../../../../types/api/phase";
import { TermsConditionsDialog } from "../../../../../components/campaign/terms-conditions-dialog";
import { translateError } from "../../../../../lib/translator";

const STEPS = [
  { id: 1, title: "Loại", active: false },
  { id: 2, title: "Mục tiêu", active: false },
  { id: 3, title: "Media", active: false },
  { id: 4, title: "Câu chuyện", active: false },
  { id: 5, title: "Xem trước", active: true },
];

export default function CreateCampaignStepPreview() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.campaignForm);

  const [loading, setLoading] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const coverUrl = useMemo(
    () => form.coverImageFileKey ? buildCoverUrl(form.coverImageFileKey) : "",
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

  const fmtDateTime = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
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
    setShowTermsDialog(false);
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Strict validations
      if (!form.title?.trim() || !form.description?.trim() || !form.coverImageFileKey || !form.targetAmount || !form.categoryId || !form.fundraisingStartDate || !form.fundraisingEndDate || !form.phases) {
        toast.error("Vui lòng hoàn thiện tất cả các bước trước đó.");
        setLoading(false);
        return;
      }

      const addSevenHours = (isoString: string): string => {
        if (!isoString) return "";
        const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
        if (!match) return isoString;
        const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), parseInt(match[4]), parseInt(match[5]));
        date.setHours(date.getHours() + 7);
        return date.toISOString();
      };

      const phasesIso: CreatePhaseInput[] = form.phases.map((p: CreatePhaseInput) => ({
        phaseName: p.phaseName || "",
        location: p.location || "",
        ingredientPurchaseDate: addSevenHours(p.ingredientPurchaseDate || ""),
        cookingDate: addSevenHours(p.cookingDate || ""),
        deliveryDate: addSevenHours(p.deliveryDate || ""),
        ingredientBudgetPercentage: p.ingredientBudgetPercentage || "0",
        cookingBudgetPercentage: p.cookingBudgetPercentage || "0",
        deliveryBudgetPercentage: p.deliveryBudgetPercentage || "0",
        plannedMeals: (p.plannedMeals || []).map((m: PlannedMeal) => ({ name: m.name || "", quantity: m.quantity || 0 })),
        plannedIngredients: (p.plannedIngredients || []).map((ing: PlannedIngredient) => ({ name: ing.name || "", quantity: ing.quantity || "", unit: ing.unit || "" }))
      }));

      const input: CreateCampaignInput = {
        title: form.title!,
        description: form.description!,
        coverImageFileKey: form.coverImageFileKey!,
        targetAmount: String(form.targetAmount!),
        categoryId: form.categoryId!,
        fundraisingStartDate: addSevenHours(form.fundraisingStartDate!),
        fundraisingEndDate: addSevenHours(form.fundraisingEndDate!),
        phases: phasesIso,
      };

      const result = await campaignService.createCampaign(input);
      if (result) {
        toast.success("Chiến dịch đã được gửi đi và đang chờ phê duyệt!");
        dispatch(resetForm());
        router.push("/profile?tab=campaigns");
      }
    } catch (error) {
      toast.error(translateError(error));
    } finally {
      setLoading(false);
    }
  };

  const milestones = useMemo(() => {
    const list = [
      { label: "Bắt đầu gây quỹ", date: form.fundraisingStartDate },
      { label: "Kết thúc gây quỹ", date: form.fundraisingEndDate },
      ...(form.phases || []).flatMap((p: CreatePhaseInput) => [
        { label: `${p.phaseName} - Mua nguyên liệu`, date: p.ingredientPurchaseDate },
        { label: `${p.phaseName} - Thực hiện nấu ăn`, date: p.cookingDate },
        { label: `${p.phaseName} - Giao hàng`, date: p.deliveryDate }
      ])
    ].filter(m => !!m.date);

    return list.sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
  }, [form.fundraisingStartDate, form.fundraisingEndDate, form.phases]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Step Indicator */}
        <div className="mb-14">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0" />
            {STEPS.map((step) => {
              const isActive = step.id === 5;
              const isCompleted = step.id < 5;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive
                      ? "bg-[#ad4e28] border-[#ad4e28] text-white shadow-lg scale-110"
                      : isCompleted
                        ? "bg-[#ad4e28] border-[#ad4e28] text-white"
                        : "bg-white border-gray-200 text-gray-300"
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-[13px] font-bold">{step.id}</span>}
                  </div>
                  <span className={`text-[11px] mt-2 font-bold uppercase tracking-wider ${isActive ? "text-[#ad4e28]" : "text-gray-400"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Kiểm tra thông tin</h1>
              <p className="text-gray-500 max-w-lg mx-auto font-medium">
                Vui lòng xem lại tất cả chi tiết chiến dịch lần cuối trước khi gửi phê duyệt.
              </p>
            </motion.div>
          </div>

          {/* Cover Image & Primary Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-50 group">
              {coverUrl ? (
                <Image unoptimized fill src={coverUrl} alt="Cover" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-sm">Chưa có ảnh bìa</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-8 right-8">
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{form.title || "Chưa đặt tiêu đề"}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Mục tiêu quyên góp", value: form.targetAmount ? Number(form.targetAmount).toLocaleString("vi-VN") + " ₫" : "—", icon: Goal, color: "text-[#ad4e28]" },
                { label: "Danh mục", value: categoryTitle || "—", icon: Tag, color: "text-blue-500" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:border-[#ad4e28]/20">
                  <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                    <p className="text-lg font-black text-gray-900 leading-none">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Fundraising Period */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <CalendarDays className="w-4 h-4 text-[#ad4e28]" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thời gian gây quỹ</h3>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex items-center justify-center gap-10">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Bắt đầu</p>
                <p className="text-base font-black text-gray-900">{fmtDateTime(form.fundraisingStartDate)}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-200 shrink-0" />
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Kết thúc</p>
                <p className="text-base font-black text-gray-900">{fmtDateTime(form.fundraisingEndDate)}</p>
              </div>
            </div>
          </section>

          {/* Story */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <BookOpen className="w-4 h-4 text-[#ad4e28]" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Câu chuyện gây quỹ</h3>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:border-[#ad4e28]/20 prose prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: form.description || "<p>Chưa có nội dung mô tả.</p>" }} />
            </div>
          </section>

          {/* Phases */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ad4e28]" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Giai đoạn thực hiện ({form.phases?.length || 0})</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {form.phases?.map((phase: CreatePhaseInput, idx: number) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * idx }} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 flex flex-col hover:border-[#ad4e28]/20 transition-all group">
                  <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ad4e28] flex items-center justify-center font-black text-sm">{idx + 1}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{phase.phaseName}</h4>
                      <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {phase.location}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "M.Liệu", val: phase.ingredientBudgetPercentage },
                        { label: "Nấu ăn", val: phase.cookingBudgetPercentage },
                        { label: "Giao", val: phase.deliveryBudgetPercentage }
                      ].map((b, bi) => (
                        <div key={bi} className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-50 group-hover:bg-white transition-colors">
                          <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">{b.label}</p>
                          <p className="text-sm font-black text-gray-900 leading-none">{b.val || 0}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-3">
                      <Utensils className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Món ăn dự kiến</p>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.plannedMeals?.map((m: PlannedMeal, mi: number) => (
                            <span key={mi} className="text-[10px] font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{m.name} <span className="text-[#ad4e28]">x{m.quantity}</span></span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 border-t border-gray-50 pt-4">
                      <Leaf className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Nguyên liệu dự kiến</p>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.plannedIngredients?.map((ing: PlannedIngredient, ii: number) => (
                            <span key={ii} className="text-[10px] font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{ing.name} <span className="text-blue-500">{ing.quantity} {ing.unit}</span></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Clock className="w-4 h-4 text-[#ad4e28]" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dòng thời gian dự kiến</h3>
            </div>
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-orange-200 before:to-gray-100">
              {milestones.map((m, mi) => (
                <div key={mi} className="relative group">
                  <div className="absolute -left-[24px] top-1 w-4 h-4 rounded-full bg-white border-4 border-orange-400 z-10 shadow-sm transition-transform group-hover:scale-125" />
                  <div>
                    <p className="text-xs font-black text-gray-900 leading-none mb-1 group-hover:text-[#ad4e28] transition-colors">{m.label}</p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider leading-none">{fmtDateTime(m.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Warning Card */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight mb-1">Xác nhận thông tin</h4>
              <p className="text-xs text-blue-700/70 font-medium italic">Bằng cách nhấn &quot;Tạo chiến dịch&quot;, bạn đồng ý rằng tất cả thông tin trên là chính xác và tuân thủ các điều khoản hoạt động.</p>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-gray-100 gap-4">
            <Button variant="ghost" size="lg" onClick={() => router.push("/register/campaign/story")} className="group h-14 px-8 rounded-2xl font-bold text-gray-400 hover:text-gray-900 transition-all w-full sm:w-auto">
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Chỉnh sửa lại
            </Button>
            <Button size="lg" onClick={handleCreateCampaign} disabled={loading} className={`group min-w-[240px] h-14 text-lg font-bold rounded-2xl transition-all duration-300 w-full sm:w-auto ${loading ? "bg-gray-100 text-gray-400" : "btn-color shadow-xl shadow-orange-200/50 hover:-translate-y-1"}`}>
              {loading && <Loader className="animate-spin w-5 h-5 mr-3" />}
              {loading ? "Đang xử lý..." : "Gửi yêu cầu tạo chiến dịch"}
              {!loading && <CheckCircle2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />}
            </Button>
          </div>
        </div>
      </div>

      <TermsConditionsDialog open={showTermsDialog} onOpenChange={setShowTermsDialog} onAccept={handleTermsAccept} />
    </div>
  );
}
