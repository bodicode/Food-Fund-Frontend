"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateForm } from "@/store/slices/campaign-form-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatCurrency, parseCurrency } from "@/lib/utils/currency-utils";
import {
  formatPercent,
  isValidPercentInput,
  normalizePercentOnBlur,
  parsePercent,
} from "@/lib/utils/percent-utils";
import { isoToLocalInput, localInputToIso } from "@/lib/utils/date-utils";
import { CreatePhaseInput } from "@/types/api/phase";
import { Plus, MapPin, Trash2 } from "lucide-react";
import LocationPicker from "@/components/shared/location-picker";



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
    const raw = parseCurrency(e.target.value);
    setTargetAmount(formatCurrency(raw));
  };

  // ===== Budget =====
  const [ingredientPct, setIngredientPct] = useState(
    formatPercent(form.ingredientBudgetPercentage ?? "60.00")
  );
  const [cookingPct, setCookingPct] = useState(
    formatPercent(form.cookingBudgetPercentage ?? "25.00")
  );
  const [deliveryPct, setDeliveryPct] = useState(
    formatPercent(form.deliveryBudgetPercentage ?? "15.00")
  );

  const onPercentChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (isValidPercentInput(raw)) setter(raw);
    };

  const onPercentBlur =
    (getter: () => string, setter: (v: string) => void) => () => {
      setter(normalizePercentOnBlur(getter()));
    };

  const totalPct =
    parsePercent(ingredientPct) +
    parsePercent(cookingPct) +
    parsePercent(deliveryPct);

  // ===== Timeline =====
  const [fundStart, setFundStart] = useState(
    isoToLocalInput(form.fundraisingStartDate)
  );
  const [fundEnd, setFundEnd] = useState(
    isoToLocalInput(form.fundraisingEndDate)
  );

  // ===== Phases =====
  const [phases, setPhases] = useState<CreatePhaseInput[]>(form.phases || [
    {
      phaseName: "Giai đoạn 1",
      location: "",
      ingredientPurchaseDate: "",
      cookingDate: "",
      deliveryDate: "",
    },
  ]);

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



  // ====== Derived validations  ======
  const amountNumeric = parseCurrency(targetAmount);
  const isAmountValid =
    !!amountNumeric &&
    !isNaN(Number(amountNumeric)) &&
    Number(amountNumeric) > 0;

  const iPctNum = parsePercent(ingredientPct);
  const cPctNum = parsePercent(cookingPct);
  const dPctNum = parsePercent(deliveryPct);

  const percentFieldsFilled =
    ingredientPct !== "" && cookingPct !== "" && deliveryPct !== "";
  const percentEachInRange = [iPctNum, cPctNum, dPctNum].every(
    (n) => n >= 0 && n <= 100
  );
  const percentSumOk = Math.abs(iPctNum + cPctNum + dPctNum - 100) <= 0.01;
  const percentsValid =
    percentFieldsFilled && percentEachInRange && percentSumOk;

  const timelineAllFilled = !!fundStart && !!fundEnd;

  const phasesValid = phases.every(phase => 
    phase.phaseName?.trim() && 
    phase.location?.trim() && 
    phase.ingredientPurchaseDate && 
    phase.cookingDate && 
    phase.deliveryDate
  );

  const timelineOrderOk = timelineAllFilled && (() => {
    const fundEndDate = new Date(fundEnd);
    const fundStartDate = new Date(fundStart);
    
    if (fundEndDate < fundStartDate) return false;
    
    return phases.every(phase => {
      if (!phase.ingredientPurchaseDate || !phase.cookingDate || !phase.deliveryDate) {
        return false;
      }
      
      const ingDate = new Date(phase.ingredientPurchaseDate);
      const cookDate = new Date(phase.cookingDate);
      const deliveryDate = new Date(phase.deliveryDate);
      
      return ingDate >= fundEndDate && 
             cookDate >= ingDate && 
             deliveryDate >= cookDate;
    });
  })();

  const canContinue = isAmountValid && percentsValid && timelineAllFilled && phasesValid && timelineOrderOk;

  // Debug validation states
  console.log('Validation Debug:', {
    isAmountValid,
    percentsValid,
    timelineAllFilled,
    phasesValid,
    timelineOrderOk,
    canContinue,
    targetAmount,
    fundStart,
    fundEnd,
    phases: phases.map(p => ({
      phaseName: p.phaseName,
      location: p.location,
      ingredientPurchaseDate: p.ingredientPurchaseDate,
      cookingDate: p.cookingDate,
      deliveryDate: p.deliveryDate
    }))
  });

  // ===== Submit =====
  const handleNextStep = () => {
    if (!canContinue) {
      if (!isAmountValid) {
        toast.error("Vui lòng nhập số tiền hợp lệ.");
        return;
      }
      if (!percentsValid) {
        toast.error("Tổng tỷ lệ ngân sách phải bằng 100% và mỗi mục trong 0–100%.");
        return;
      }
      if (!timelineAllFilled) {
        toast.error("Vui lòng chọn đầy đủ thời gian gây quỹ.");
        return;
      }
      if (!phasesValid) {
        toast.error("Vui lòng điền đầy đủ thông tin các giai đoạn.");
        return;
      }
      if (!timelineOrderOk) {
        toast.error("Thứ tự thời gian chưa hợp lý.");
        return;
      }
    }

    const isoFundStart = localInputToIso(fundStart);
    const isoFundEnd = localInputToIso(fundEnd);
    
    const updatedPhases = phases.map(phase => ({
      ...phase,
      ingredientPurchaseDate: phase.ingredientPurchaseDate,
      cookingDate: phase.cookingDate,
      deliveryDate: phase.deliveryDate,
    }));

    dispatch(
      updateForm({
        targetAmount: amountNumeric,
        ingredientBudgetPercentage: formatPercent(iPctNum),
        cookingBudgetPercentage: formatPercent(cPctNum),
        deliveryBudgetPercentage: formatPercent(dPctNum),
        fundraisingStartDate: isoFundStart,
        fundraisingEndDate: isoFundEnd,
        phases: updatedPhases,
      })
    );

    router.push("/register/campaign/media");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start lg:divide-x lg:divide-gray-200">
          <div className="lg:col-span-1 lg:sticky lg:top-20 pr-8">
            <p className="text-sm text-gray-500 mb-3">Bước 2</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-snug">
              Đặt mục tiêu <br /> gây quỹ của bạn
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Xác định số tiền, phân bổ ngân sách và các giai đoạn thực hiện chiến dịch.
            </p>
          </div>

          <div className="lg:col-span-2 space-y-10 pl-0 lg:pl-8">
            {/* Target Amount */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-color">
                Bạn muốn quyên góp bao nhiêu?
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Số tiền mục tiêu (VNĐ)
                </label>
                <Input
                  inputMode="numeric"
                  placeholder="Nhập số tiền (ví dụ: 200.000.000)"
                  value={targetAmount}
                  onChange={handleChangeAmount}
                  className="h-12 text-lg font-medium"
                />
              </div>
              {!isAmountValid && (
                <p className="text-sm text-red-600">Số tiền chưa hợp lệ.</p>
              )}
            </div>

            {/* Budget Allocation */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-color">
                Phân bổ ngân sách (%)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nguyên liệu (%)
                  </label>
                  <Input
                    inputMode="decimal"
                    placeholder="60.00"
                    value={ingredientPct}
                    onChange={onPercentChange(setIngredientPct)}
                    onBlur={onPercentBlur(() => ingredientPct, setIngredientPct)}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nấu ăn (%)
                  </label>
                  <Input
                    inputMode="decimal"
                    placeholder="25.00"
                    value={cookingPct}
                    onChange={onPercentChange(setCookingPct)}
                    onBlur={onPercentBlur(() => cookingPct, setCookingPct)}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Giao hàng (%)
                  </label>
                  <Input
                    inputMode="decimal"
                    placeholder="15.00"
                    value={deliveryPct}
                    onChange={onPercentChange(setDeliveryPct)}
                    onBlur={onPercentBlur(() => deliveryPct, setDeliveryPct)}
                    className="h-11"
                  />
                </div>
              </div>

              <p
                className={`text-sm ${
                  percentSumOk ? "text-gray-600" : "text-red-600"
                }`}
              >
                Tổng:{" "}
                <span className="font-semibold">
                  {formatPercent(totalPct)}%
                </span>{" "}
                {!percentSumOk && "— Tổng tỷ lệ ngân sách phải bằng 100%."}
              </p>
            </div>

            {/* Fundraising Timeline */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-color">
                Thời gian gây quỹ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Bắt đầu gây quỹ
                  </label>
                  <Input
                    type="datetime-local"
                    value={fundStart}
                    onChange={(e) => setFundStart(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Kết thúc gây quỹ
                  </label>
                  <Input
                    type="datetime-local"
                    value={fundEnd}
                    onChange={(e) => setFundEnd(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Phases */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-color">
                Giai đoạn thực hiện
              </h2>
              
              {phases.map((phase, index) => (
                <div key={index} className="p-6 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Giai đoạn {index + 1}</h3>
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

                  <div className="space-y-4">
                    {/* Phase Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Tên giai đoạn
                      </label>
                      <Input
                        value={phase.phaseName}
                        onChange={(e) => updatePhase(index, 'phaseName', e.target.value)}
                        placeholder="Ví dụ: Giai đoạn 1"
                        className="h-11"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Địa điểm thực hiện
                      </label>
                      
                      <LocationPicker
                        value={phase.location}
                        onChange={(location) => updatePhase(index, 'location', location)}
                        placeholder="Chọn địa điểm thực hiện"
                      />
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Ngày & giờ mua nguyên liệu
                        </label>
                        <Input
                          type="datetime-local"
                          value={isoToLocalInput(phase.ingredientPurchaseDate)}
                          onChange={(e) => updatePhase(index, 'ingredientPurchaseDate', localInputToIso(e.target.value))}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Ngày & giờ nấu ăn
                        </label>
                        <Input
                          type="datetime-local"
                          value={isoToLocalInput(phase.cookingDate)}
                          onChange={(e) => updatePhase(index, 'cookingDate', localInputToIso(e.target.value))}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Ngày & giờ giao hàng
                        </label>
                        <Input
                          type="datetime-local"
                          value={isoToLocalInput(phase.deliveryDate)}
                          onChange={(e) => updatePhase(index, 'deliveryDate', localInputToIso(e.target.value))}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Phase Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={addPhase}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Thêm giai đoạn {phases.length + 1}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Thêm giai đoạn mới nếu chiến dịch của bạn cần nhiều địa điểm thực hiện
                </p>
              </div>
            </div>

            {/* Validation Status */}
            {!canContinue && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Cần hoàn thành:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {!isAmountValid && <li>• Nhập số tiền mục tiêu hợp lệ</li>}
                  {!percentsValid && <li>• Phân bổ ngân sách phải tổng cộng 100%</li>}
                  {!timelineAllFilled && <li>• Chọn thời gian bắt đầu và kết thúc gây quỹ</li>}
                  {!phasesValid && <li>• Điền đầy đủ thông tin các giai đoạn (tên, địa điểm, thời gian)</li>}
                  {timelineAllFilled && !timelineOrderOk && <li>• Thời gian các giai đoạn phải sau khi kết thúc gây quỹ</li>}
                </ul>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
              <Button
                variant="outline"
                className="h-12 px-6 w-full sm:w-auto"
                onClick={() => router.push("/register/campaign/type")}
              >
                ← Quay lại
              </Button>

              <Button
                className={`h-12 px-8 text-base font-semibold w-full sm:w-auto ${
                  !canContinue
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-color text-white"
                }`}
                disabled={!canContinue}
                onClick={handleNextStep}
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}