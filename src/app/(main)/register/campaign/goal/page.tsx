"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateForm } from "@/store/slices/campaign-form-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { toast } from "sonner";
import { formatCurrency, parseCurrency } from "@/lib/utils/currency-utils";
import {
  formatPercent,
  isValidPercentInput,
  normalizePercentOnBlur,
  parsePercent,
} from "@/lib/utils/percent-utils";
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
        },
      ]
  );

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
      },
    ]);
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

  const timelineAllFilled = !!fundStart && !!fundEnd;

  // Validate phases based on number of phases
  const phasesValid = (() => {
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
  })();

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

  // Detailed timeline validation (with hour and minute precision)
  const timelineValidation = (() => {
    if (!timelineAllFilled) {
      return { isValid: false, errors: [] };
    }

    const errors: string[] = [];
    const fundStartDate = parseLocalDateTime(fundStart);
    const fundEndDate = parseLocalDateTime(fundEnd);

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
      // Using strict less than (not <=) to allow same time
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
      // Ingredient purchase must be > fundraising end time (must be after, not same day)
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
          // Current phase must start after previous phase ends
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

  const timelineOrderOk = timelineValidation.isValid;

  const canContinue =
    isAmountValid &&
    timelineAllFilled &&
    phasesValid &&
    timelineOrderOk;

  // ===== Submit =====
  const handleNextStep = () => {
    if (!canContinue) {
      if (!isAmountValid) {
        toast.error("Vui lòng nhập số tiền hợp lệ.");
        return;
      }
      if (!timelineAllFilled) {
        toast.error("Vui lòng chọn đầy đủ thời gian gây quỹ.");
        return;
      }
      if (!phasesValid) {
        toast.error(
          "Vui lòng điền đầy đủ thông tin các giai đoạn và ngân sách mỗi giai đoạn phải bằng 100%."
        );
        return;
      }
      if (!timelineOrderOk) {
        timelineValidation.errors.forEach((error) => toast.error(error));
        return;
      }
    }

    dispatch(
      updateForm({
        targetAmount: amountNumeric,
        fundraisingStartDate: fundStart,
        fundraisingEndDate: fundEnd,
        phases: phases,
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
              Xác định số tiền, phân bổ ngân sách và các giai đoạn thực hiện
              chiến dịch.
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

            {/* Fundraising Timeline */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-color">
                Thời gian gây quỹ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Bắt đầu gây quỹ
                  </label>
                  <DateTimeInput value={fundStart} onChange={setFundStart} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Kết thúc gây quỹ
                  </label>
                  <DateTimeInput value={fundEnd} onChange={setFundEnd} />
                </div>
              </div>
            </div>

            {/* Phases */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-color mb-2">
                  Giai đoạn thực hiện
                </h2>
                <p className="text-sm text-gray-600">
                  {phases.length === 1
                    ? "Ngân sách của giai đoạn này phải bằng 100%"
                    : `Tổng ngân sách của ${phases.length} giai đoạn phải bằng 100%`}
                </p>
              </div>

              {phases.map((phase, index) => {
                const phaseBudgetSum =
                  parsePercent(phase.ingredientBudgetPercentage || "0") +
                  parsePercent(phase.cookingBudgetPercentage || "0") +
                  parsePercent(phase.deliveryBudgetPercentage || "0");
                const phaseBudgetValid = Math.abs(phaseBudgetSum - 100) <= 0.01;

                return (
                  <div
                    key={index}
                    className="p-6 border rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">
                        Giai đoạn {index + 1}
                      </h3>
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
                          onChange={(e) =>
                            updatePhase(index, "phaseName", e.target.value)
                          }
                          placeholder="Ví dụ: Khu Bắc Quận 1"
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
                          onChange={(location) =>
                            updatePhase(index, "location", location)
                          }
                          placeholder="Chọn địa điểm thực hiện"
                        />
                      </div>

                      {/* Budget Allocation for this Phase */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
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
                          className={`text-xs mt-1 ${Math.abs(phaseBudgetSum - 100) <= 0.5 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          Tổng giai đoạn này: {formatPercent(phaseBudgetSum)}%
                          {phases.length === 1 && Math.abs(phaseBudgetSum - 100) > 0.5 && " — Phải bằng 100%"}
                        </p>
                      </div>

                      {/* Timeline */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Mua nguyên liệu
                          </label>
                          <DateTimeInput
                            value={phase.ingredientPurchaseDate}
                            onChange={(value) =>
                              updatePhase(index, "ingredientPurchaseDate", value)
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Nấu ăn
                          </label>
                          <DateTimeInput
                            value={phase.cookingDate}
                            onChange={(value) =>
                              updatePhase(index, "cookingDate", value)
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
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
                    </div>
                  </div>
                );
              })}

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
                  Thêm giai đoạn mới nếu chiến dịch của bạn cần nhiều địa điểm
                  thực hiện
                </p>
              </div>
            </div>

            {/* Validation Status */}
            {!canContinue && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">
                  Cần hoàn thành:
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {!isAmountValid && <li>• Nhập số tiền mục tiêu hợp lệ</li>}
                  {!timelineAllFilled && (
                    <li>• Chọn thời gian bắt đầu và kết thúc gây quỹ</li>
                  )}
                  {!phasesValid && (
                    <li>
                      • Điền đầy đủ thông tin các giai đoạn và{" "}
                      {phases.length === 1
                        ? "ngân sách giai đoạn phải bằng 100%"
                        : `tổng ngân sách ${phases.length} giai đoạn phải bằng 100%`}
                    </li>
                  )}
                  {timelineAllFilled && !timelineOrderOk && (
                    <>
                      <li className="font-medium mt-2">Lỗi thời gian:</li>
                      {timelineValidation.errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </>
                  )}
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
                className={`h-12 px-8 text-base font-semibold w-full sm:w-auto ${!canContinue
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
