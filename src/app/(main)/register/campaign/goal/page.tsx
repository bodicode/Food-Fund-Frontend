"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "../../../../../store";
import { updateForm } from "../../../../../store/slices/campaign-form-slice";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { DateTimeInput } from "../../../../../components/ui/date-time-input";
import { toast } from "sonner";
import { formatCurrency, parseCurrency } from "../../../../../lib/utils/currency-utils";
import {
  formatPercent,
  isValidPercentInput,
  normalizePercentOnBlur,
  parsePercent,
} from "../../../../../lib/utils/percent-utils";
import { CreatePhaseInput, PlannedMeal, PlannedIngredient } from "../../../../../types/api/phase";
import {
  Plus,
  Trash2,
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import LocationPicker from "../../../../../components/shared/location-picker";

const STEPS = [
  { id: 1, title: "Loại", active: false },
  { id: 2, title: "Mục tiêu", active: true },
  { id: 3, title: "Câu chuyện", active: false },
  { id: 4, title: "Media", active: false },
  { id: 5, title: "Xem trước", active: false },
];

const UNIT_GROUPS = [
  {
    label: "Trọng lượng",
    units: ["kg", "g", "mg", "tấn", "tạ", "yến"]
  },
  {
    label: "Thể tích",
    units: ["lít", "ml", "cc"]
  },
  {
    label: "Đơn vị đếm",
    units: ["cái", "chiếc", "quả", "trái", "củ", "hạt", "bó", "mớ", "cây", "nhánh", "tép", "lát", "khúc"]
  },
  {
    label: "Quy cách đóng gói",
    units: ["hộp", "thùng", "gói", "bao", "túi", "chai", "lọ", "hũ", "lon", "bình", "can", "vỉ", "khay"]
  },
  {
    label: "Khác",
    units: ["suất", "phần", "bộ", "cặp", "tá"]
  }
];

export default function CreateCampaignStepGoal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.campaignForm);

  // ===== Goal =====
  const [targetAmount, setTargetAmount] = useState(form.targetAmount || "");
  useEffect(() => {
    if (form.targetAmount) setTargetAmount(formatCurrency(form.targetAmount));
  }, [form.targetAmount]);

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    const selectionStart = input.selectionStart || 0;
    const digitsBeforeCursor = value.slice(0, selectionStart).replace(/\D/g, "");
    const raw = parseCurrency(value);
    const currentRaw = parseCurrency(targetAmount);

    if (raw === currentRaw && value.length < targetAmount.length) {
      const newRaw = raw.slice(0, Math.max(0, digitsBeforeCursor.length - 1)) + raw.slice(digitsBeforeCursor.length);
      setTargetAmount(formatCurrency(newRaw));
      return;
    }

    const formatted = formatCurrency(raw);
    setTargetAmount(formatted);
  };

  // ===== Timeline =====
  const [fundStart, setFundStart] = useState(form.fundraisingStartDate || "");
  const [fundEnd, setFundEnd] = useState(form.fundraisingEndDate || "");

  // ===== Phases =====
  const [phases, setPhases] = useState<CreatePhaseInput[]>(
    form.phases && form.phases.length > 0
      ? form.phases.map((p: CreatePhaseInput) => ({
        ...p,
        ingredientBudgetPercentage: p.ingredientBudgetPercentage || "",
        cookingBudgetPercentage: p.cookingBudgetPercentage || "",
        deliveryBudgetPercentage: p.deliveryBudgetPercentage || "",
        plannedMeals: (p.plannedMeals || []).map((m: PlannedMeal) => ({ ...m, name: m.name || "", quantity: m.quantity || 0 })),
        plannedIngredients: (p.plannedIngredients || []).map((i: PlannedIngredient) => ({ ...i, name: i.name || "", quantity: i.quantity || "", unit: i.unit || "" })),
      }))
      : [
        {
          phaseName: "Giai đoạn 1",
          location: "",
          ingredientPurchaseDate: "",
          cookingDate: "",
          deliveryDate: "",
          ingredientBudgetPercentage: "",
          cookingBudgetPercentage: "",
          deliveryBudgetPercentage: "",
          plannedMeals: [],
          plannedIngredients: [],
        },
      ]
  );

  const updatePhase = (index: number, field: keyof CreatePhaseInput, value: string) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], [field]: value };
    setPhases(newPhases);
  };

  const addPhase = () => {
    setPhases([
      ...phases,
      {
        phaseName: `Giai đoạn ${phases.length + 1}`,
        location: "",
        ingredientPurchaseDate: "",
        cookingDate: "",
        deliveryDate: "",
        ingredientBudgetPercentage: "",
        cookingBudgetPercentage: "",
        deliveryBudgetPercentage: "",
        plannedMeals: [],
        plannedIngredients: [],
      },
    ]);
  };

  const removePhase = (index: number) => {
    if (phases.length > 1) {
      setPhases(phases.filter((_, i) => i !== index));
    }
  };

  const addMeal = (phaseIndex: number) => {
    const newPhases = [...phases];
    newPhases[phaseIndex] = {
      ...newPhases[phaseIndex],
      plannedMeals: [
        ...(newPhases[phaseIndex].plannedMeals || []),
        { name: "", quantity: 0 },
      ],
    };
    setPhases(newPhases);
  };

  const removeMeal = (phaseIndex: number, mealIndex: number) => {
    const newPhases = [...phases];
    const meals = [...(newPhases[phaseIndex].plannedMeals || [])];
    meals.splice(mealIndex, 1);
    newPhases[phaseIndex] = { ...newPhases[phaseIndex], plannedMeals: meals };
    setPhases(newPhases);
  };

  const updateMeal = (phaseIndex: number, mealIndex: number, field: keyof PlannedMeal, value: string | number) => {
    const newPhases = [...phases];
    const meals = [...(newPhases[phaseIndex].plannedMeals || [])];
    meals[mealIndex] = { ...meals[mealIndex], [field]: value };
    newPhases[phaseIndex] = { ...newPhases[phaseIndex], plannedMeals: meals };
    setPhases(newPhases);
  };

  const addIngredient = (phaseIndex: number) => {
    const newPhases = [...phases];
    newPhases[phaseIndex] = {
      ...newPhases[phaseIndex],
      plannedIngredients: [
        ...(newPhases[phaseIndex].plannedIngredients || []),
        { name: "", quantity: "", unit: "" },
      ],
    };
    setPhases(newPhases);
  };

  const removeIngredient = (phaseIndex: number, ingredientIndex: number) => {
    const newPhases = [...phases];
    const ingredients = [...(newPhases[phaseIndex].plannedIngredients || [])];
    ingredients.splice(ingredientIndex, 1);
    newPhases[phaseIndex] = {
      ...newPhases[phaseIndex],
      plannedIngredients: ingredients,
    };
    setPhases(newPhases);
  };

  const updateIngredient = (phaseIndex: number, ingredientIndex: number, field: keyof PlannedIngredient, value: string) => {
    const newPhases = [...phases];
    const ingredients = [...(newPhases[phaseIndex].plannedIngredients || [])];
    ingredients[ingredientIndex] = {
      ...ingredients[ingredientIndex],
      [field]: value,
    };
    newPhases[phaseIndex] = {
      ...newPhases[phaseIndex],
      plannedIngredients: ingredients,
    };
    setPhases(newPhases);
  };

  // ====== Validations ======
  const amountNumeric = parseCurrency(targetAmount);
  const isAmountValid = !!amountNumeric && !isNaN(Number(amountNumeric)) && Number(amountNumeric) > 0;
  const timelineAllFilled = !!fundStart && !!fundEnd;

  const phasesValid = (() => {
    const allFieldsFilled = phases.every((phase) => {
      return (
        phase.phaseName?.trim() &&
        phase.location?.trim() &&
        phase.ingredientPurchaseDate?.trim() &&
        phase.cookingDate?.trim() &&
        phase.deliveryDate?.trim() &&
        phase.ingredientBudgetPercentage !== undefined && phase.ingredientBudgetPercentage !== "" &&
        phase.cookingBudgetPercentage !== undefined && phase.cookingBudgetPercentage !== "" &&
        phase.deliveryBudgetPercentage !== undefined && phase.deliveryBudgetPercentage !== "" &&
        phase.plannedMeals?.length > 0 &&
        phase.plannedMeals.every((m: PlannedMeal) => m.name.trim() && m.quantity > 0) &&
        phase.plannedIngredients?.length > 0 &&
        phase.plannedIngredients.every((i: PlannedIngredient) => i.name.trim() && i.quantity.trim() && i.unit.trim())
      );
    });

    if (!allFieldsFilled) return false;

    const totalBudget = phases.reduce((sum, phase) => {
      return (
        sum +
        parsePercent(phase.ingredientBudgetPercentage || "0") +
        parsePercent(phase.cookingBudgetPercentage || "0") +
        parsePercent(phase.deliveryBudgetPercentage || "0")
      );
    }, 0);
    return Math.abs(totalBudget - 100) <= 0.5;
  })();

  const parseLocalDateTime = (isoString: string): Date => {
    const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) {
      return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), parseInt(match[4]), parseInt(match[5]));
    }
    return new Date(isoString);
  };

  const timelineValidation = (() => {
    if (!timelineAllFilled) return { isValid: false, errors: [] };
    const errors: string[] = [];
    const fundStartDate = parseLocalDateTime(fundStart);
    const fundEndDate = parseLocalDateTime(fundEnd);

    if (fundEndDate <= fundStartDate) errors.push("Thời gian kết thúc gây quỹ phải sau thời gian bắt đầu");

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      if (!phase.ingredientPurchaseDate || !phase.cookingDate || !phase.deliveryDate) continue;

      const ingDate = parseLocalDateTime(phase.ingredientPurchaseDate);
      const cookDate = parseLocalDateTime(phase.cookingDate);
      const deliveryDate = parseLocalDateTime(phase.deliveryDate);

      if (isNaN(ingDate.getTime()) || isNaN(cookDate.getTime()) || isNaN(deliveryDate.getTime())) continue;

      if (cookDate <= ingDate) errors.push(`Giai đoạn ${i + 1}: Thời gian nấu ăn phải sau thời gian mua nguyên liệu`);
      if (deliveryDate <= cookDate) errors.push(`Giai đoạn ${i + 1}: Thời gian giao hàng phải sau thời gian nấu ăn`);
      if (ingDate <= fundEndDate) errors.push(`Giai đoạn ${i + 1}: Thời gian thực hiện phải sau ngày kết thúc gây quỹ`);

      if (i > 0) {
        const prevPhase = phases[i - 1];
        if (prevPhase.deliveryDate) {
          const prevDeliveryDate = parseLocalDateTime(prevPhase.deliveryDate);
          if (ingDate < prevDeliveryDate) errors.push(`Giai đoạn ${i + 1} và Giai đoạn ${i} không được trùng ngày hoặc bị đè lên nhau`);
        }
      }
    }
    return { isValid: errors.length === 0, errors };
  })();

  const timelineOrderOk = timelineValidation.isValid;
  const canContinue = isAmountValid && timelineAllFilled && phasesValid && timelineOrderOk;

  const handleNextStep = () => {
    if (!canContinue) {
      if (!isAmountValid) return toast.error("Vui lòng nhập số tiền hợp lệ.");
      if (!timelineAllFilled) return toast.error("Vui lòng chọn đầy đủ thời gian gây quỹ.");
      if (!phasesValid) return toast.error("Vui lòng điền đầy đủ thông tin các giai đoạn và tổng ngân sách phải bằng 100%.");
      if (!timelineOrderOk) return timelineValidation.errors.forEach((e) => toast.error(e));
    }

    dispatch(updateForm({
      targetAmount: amountNumeric,
      fundraisingStartDate: fundStart,
      fundraisingEndDate: fundEnd,
      phases: phases,
    }));
    router.push("/register/campaign/media");
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Step Indicator */}
        <div className="mb-14">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0" />
            {STEPS.map((step) => {
              const isActive = step.id === 2;
              const isCompleted = step.id < 2;
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
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Kế hoạch chiến dịch</h1>
            <p className="text-gray-500 max-w-lg mx-auto font-medium">Xác định các mục tiêu và lộ trình thực hiện chi tiết cho chiến dịch của bạn.</p>
          </div>

          <div className="space-y-8">
            {/* Section 1: Goal & Fundraising Timeline */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
              <h2 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-50 flex items-center gap-2">
                1. Mục tiêu tài chính & Thời hạn
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5 space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Số tiền mục tiêu (VNĐ)</label>
                  <div className="relative group">
                    <Input
                      inputMode="numeric"
                      placeholder="Nhập số tiền..."
                      value={targetAmount}
                      onChange={handleChangeAmount}
                      className="h-14 text-xl font-bold pl-12 rounded-xl border-gray-100 bg-gray-50/30 transition-all focus:border-[#ad4e28]/30 focus:bg-white focus:ring-0"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#ad4e28] text-lg">₫</div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Giai đoạn gây quỹ</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Bắt đầu</span>
                      <DateTimeInput value={fundStart} onChange={setFundStart} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">Kết thúc</span>
                      <DateTimeInput value={fundEnd} onChange={setFundEnd} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Detailed Phases */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-gray-900">2. Chi tiết các giai đoạn</h2>
                <Button
                  onClick={addPhase}
                  variant="outline"
                  className="rounded-xl border-gray-100 text-[#ad4e28] hover:bg-[#ad4e28] hover:text-white transition-all font-bold h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm giai đoạn
                </Button>
              </div>

              <AnimatePresence mode="popLayout">
                {phases.map((phase, index) => {
                  const phaseBudgetSum = parsePercent(phase.ingredientBudgetPercentage || "0") + parsePercent(phase.cookingBudgetPercentage || "0") + parsePercent(phase.deliveryBudgetPercentage || "0");
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      layout
                      className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] relative group"
                    >
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center font-bold text-[#ad4e28] text-xs">
                            {index + 1}
                          </div>
                          <Input
                            value={phase.phaseName}
                            onChange={(e) => updatePhase(index, "phaseName", e.target.value)}
                            className="text-lg font-bold border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:text-gray-200 flex-1"
                            placeholder="Tên giai đoạn (vd: Giai đoạn Quận 1)..."
                          />
                        </div>
                        {phases.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removePhase(index)} className="text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                        {/* Phase Core Info */}
                        <div className="space-y-8">
                          <div className="space-y-3">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Địa điểm triển khai</label>
                            <LocationPicker value={phase.location} onChange={(loc) => updatePhase(index, "location", loc)} />
                          </div>

                          <div className="space-y-3">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lịch trình chi tiết</label>
                            <div className="grid grid-cols-1 gap-4 bg-gray-50/30 p-4 rounded-xl">
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase w-28">Nguyên liệu:</span>
                                <div className="flex-1"><DateTimeInput value={phase.ingredientPurchaseDate} onChange={(v) => updatePhase(index, "ingredientPurchaseDate", v)} /></div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase w-28">Nấu ăn:</span>
                                <div className="flex-1"><DateTimeInput value={phase.cookingDate} onChange={(v) => updatePhase(index, "cookingDate", v)} /></div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase w-28">Giao hàng:</span>
                                <div className="flex-1"><DateTimeInput value={phase.deliveryDate} onChange={(v) => updatePhase(index, "deliveryDate", v)} /></div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center ml-1">
                              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Phân bổ ngân sách</label>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${Math.abs(phaseBudgetSum - 100) <= 0.5 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-400"}`}>
                                Tổng: {formatPercent(phaseBudgetSum)}%
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {["ingredient", "cooking", "delivery"].map((field) => (
                                <div key={field} className="space-y-1.5">
                                  <span className="text-[9px] font-bold text-gray-300 uppercase ml-1">
                                    {field === "ingredient" ? "M.Liệu" : field === "cooking" ? "Nấu" : "Giao"}
                                  </span>
                                  <Input
                                    inputMode="decimal" placeholder="%"
                                    value={(phase as CreatePhaseInput)[`${field}BudgetPercentage` as keyof CreatePhaseInput] as string}
                                    onChange={(e) => isValidPercentInput(e.target.value) && updatePhase(index, `${field}BudgetPercentage` as keyof CreatePhaseInput, e.target.value)}
                                    onBlur={() => updatePhase(index, `${field}BudgetPercentage` as keyof CreatePhaseInput, normalizePercentOnBlur((phase as CreatePhaseInput)[`${field}BudgetPercentage` as keyof CreatePhaseInput] as string))}
                                    className="h-10 text-center font-bold text-sm bg-gray-50/30 border-none"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Phase Content (Meals/Ingredients) */}
                        <div className="bg-gray-50/20 rounded-2xl p-6 space-y-8 border border-gray-50/50">
                          {/* Meals List */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Món ăn</h4>
                              <Button variant="ghost" size="sm" onClick={() => addMeal(index)} className="h-7 text-[10px] font-bold uppercase text-[#ad4e28] hover:bg-white bg-white/50 px-2 rounded-lg">
                                <Plus className="w-3 h-3 mr-1" /> Thêm
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {phase.plannedMeals?.length === 0 ? (
                                <p className="text-[10px] text-gray-300 text-center py-4 italic">Chưa có món ăn</p>
                              ) : (
                                phase.plannedMeals?.map((meal, mIdx) => (
                                  <div key={mIdx} className="flex gap-2 items-center group/item">
                                    <Input placeholder="Tên món" value={meal.name} onChange={(e) => updateMeal(index, mIdx, "name", e.target.value)} className="h-9 text-xs bg-white flex-[3] border-gray-100" />
                                    <Input type="number" placeholder="SL" value={meal.quantity || ""} onChange={(e) => updateMeal(index, mIdx, "quantity", parseInt(e.target.value) || 0)} className="h-9 text-xs bg-white flex-1 min-w-[60px] border-gray-100" />
                                    <Button variant="ghost" size="icon" onClick={() => removeMeal(index, mIdx)} className="h-7 w-7 text-gray-200 hover:text-red-400"><X className="w-3 h-3" /></Button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Ingredients List */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nguyên liệu</h4>
                              <Button variant="ghost" size="sm" onClick={() => addIngredient(index)} className="h-7 text-[10px] font-bold uppercase text-[#ad4e28] hover:bg-white bg-white/50 px-2 rounded-lg">
                                <Plus className="w-3 h-3 mr-1" /> Thêm
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {phase.plannedIngredients?.length === 0 ? (
                                <p className="text-[10px] text-gray-300 text-center py-4 italic">Chưa có nguyên liệu</p>
                              ) : (
                                phase.plannedIngredients?.map((ing, iIdx) => (
                                  <div key={iIdx} className="grid grid-cols-[2fr_1fr_80px_auto] gap-2 items-center">
                                    <Input placeholder="Tên" value={ing.name || ""} onChange={(e) => updateIngredient(index, iIdx, "name", e.target.value)} className="h-9 text-xs bg-white border-gray-100" />
                                    <Input placeholder="SL" value={ing.quantity || ""} onChange={(e) => updateIngredient(index, iIdx, "quantity", e.target.value)} className="h-9 text-xs bg-white border-gray-100" />
                                    <Select value={ing.unit || ""} onValueChange={(v) => updateIngredient(index, iIdx, "unit", v)}>
                                      <SelectTrigger className="h-9 text-[10px] bg-white border-gray-100"><SelectValue placeholder="ĐV" /></SelectTrigger>
                                      <SelectContent>
                                        {UNIT_GROUPS.map((g) => (
                                          <SelectGroup key={g.label}><SelectLabel className="text-[10px] opacity-40">{g.label}</SelectLabel>{g.units.map((u) => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}</SelectGroup>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" onClick={() => removeIngredient(index, iIdx)} className="h-7 w-7 text-gray-200 hover:text-red-400"><X className="w-3 h-3" /></Button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Multiphase Summary */}
              {phases.length > 1 && (
                <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-between bg-white">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng phân bổ đa giai đoạn</h3>
                    <p className="text-sm text-gray-600 font-medium">Đảm bảo tổng tất cả giai đoạn là 100%</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-4xl font-black ${Math.abs(phases.reduce((s, p) => s + parsePercent(p.ingredientBudgetPercentage || "0") + parsePercent(p.cookingBudgetPercentage || "0") + parsePercent(p.deliveryBudgetPercentage || "0"), 0) - 100) <= 0.5 ? "text-[#ad4e28]" : "text-red-300"}`}>
                      {formatPercent(phases.reduce((s, p) => s + parsePercent(p.ingredientBudgetPercentage || "0") + parsePercent(p.cookingBudgetPercentage || "0") + parsePercent(p.deliveryBudgetPercentage || "0"), 0))}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error States */}
            <AnimatePresence>
              {!canContinue && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 bg-red-50/30 rounded-2xl border border-red-50">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2">Thông tin chưa hoàn thiện</h4>
                      <ul className="text-xs text-red-700/70 space-y-1 font-medium">
                        {!isAmountValid && <li>• Số tiền mục tiêu chưa hợp lệ</li>}
                        {!timelineAllFilled && <li>• Thời gian gây quỹ chưa đầy đủ</li>}
                        {!phasesValid && <li>• Kiểm tra lại thông tin các giai đoạn & phân bổ ngân sách</li>}
                        {timelineAllFilled && !timelineOrderOk && timelineValidation.errors.map((e, idx) => <li key={idx}>• {e}</li>)}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="flex items-center justify-between pt-10 border-t border-gray-50">
              <Button
                variant="ghost"
                onClick={() => router.push("/register/campaign/type")}
                className="h-12 px-6 rounded-xl font-bold text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Quay lại
              </Button>
              <Button
                size="lg"
                onClick={handleNextStep}
                disabled={!canContinue}
                className={`h-14 px-10 rounded-2xl font-bold transition-all duration-300 ${!canContinue ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none" : "btn-color shadow-xl shadow-orange-200/50 hover:-translate-y-1"
                  }`}
              >
                Tiếp tục
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
