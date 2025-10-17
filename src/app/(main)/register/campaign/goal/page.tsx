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
    formatPercent(form.ingredientBudgetPercentage ?? "00.00")
  );
  const [cookingPct, setCookingPct] = useState(
    formatPercent(form.cookingBudgetPercentage ?? "00.00")
  );
  const [deliveryPct, setDeliveryPct] = useState(
    formatPercent(form.deliveryBudgetPercentage ?? "00.00")
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

  // ===== TImeline =====
  const [fundStart, setFundStart] = useState(
    isoToLocalInput(form.fundraisingStartDate)
  );
  const [fundEnd, setFundEnd] = useState(
    isoToLocalInput(form.fundraisingEndDate)
  );
  const [ingPurchase, setIngPurchase] = useState(
    isoToLocalInput(form.ingredientPurchaseDate)
  );
  const [cookDate, setCookDate] = useState(isoToLocalInput(form.cookingDate));
  const [deliverDate, setDeliverDate] = useState(
    isoToLocalInput(form.deliveryDate)
  );

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

  const timelineAllFilled =
    !!fundStart && !!fundEnd && !!ingPurchase && !!cookDate && !!deliverDate;

  const timelineOrderOk =
    timelineAllFilled &&
    new Date(fundEnd) >= new Date(fundStart) &&
    new Date(ingPurchase) >= new Date(fundEnd) &&
    new Date(cookDate) >= new Date(ingPurchase) &&
    new Date(deliverDate) >= new Date(cookDate);

  const canContinue =
    isAmountValid && percentsValid && timelineAllFilled && timelineOrderOk;

  // ===== Submit =====
  const handleNextStep = () => {
    // Double-check
    if (!canContinue) {
      if (!isAmountValid) {
        toast.error("Vui lòng nhập số tiền hợp lệ.");
        return;
      }
      if (!percentsValid) {
        toast.error(
          "Tổng tỷ lệ ngân sách phải bằng 100% và mỗi mục trong 0–100%."
        );
        return;
      }
      if (!timelineAllFilled) {
        toast.error("Vui lòng chọn đầy đủ các mốc thời gian.");
        return;
      }
      if (!timelineOrderOk) {
        toast.error("Thứ tự mốc chưa hợp lý (Kết thúc ≤ Mua NL ≤ Nấu ≤ Giao).");
        return;
      }
    }

    const isoFundStart = localInputToIso(fundStart);
    const isoFundEnd = localInputToIso(fundEnd);
    const isoIng = localInputToIso(ingPurchase);
    const isoCook = localInputToIso(cookDate);
    const isoDeliver = localInputToIso(deliverDate);

    dispatch(
      updateForm({
        targetAmount: amountNumeric,
        ingredientBudgetPercentage: formatPercent(iPctNum),
        cookingBudgetPercentage: formatPercent(cPctNum),
        deliveryBudgetPercentage: formatPercent(dPctNum),
        fundraisingStartDate: isoFundStart,
        fundraisingEndDate: isoFundEnd,
        ingredientPurchaseDate: isoIng,
        cookingDate: isoCook,
        deliveryDate: isoDeliver,
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
              Xác định số tiền và cách phân bổ, kèm các mốc thời gian chi tiết
              cho chiến dịch.
            </p>
          </div>

          <div className="lg:col-span-2 space-y-10 pl-0 lg:pl-8">
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
              {form.location && (
                <p className="text-gray-500 text-sm mt-2">
                  <span className="font-semibold text-gray-700">
                    Địa điểm:{" "}
                  </span>
                  {form.location}
                </p>
              )}
            </div>

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
                    onBlur={onPercentBlur(
                      () => ingredientPct,
                      setIngredientPct
                    )}
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
              {!percentEachInRange && (
                <p className="text-sm text-red-600">
                  Mỗi tỷ lệ ngân sách phải trong khoảng 0–100%.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-color">
                Mốc thời gian
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
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ngày mua nguyên liệu
                  </label>
                  <Input
                    type="datetime-local"
                    value={ingPurchase}
                    onChange={(e) => setIngPurchase(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ngày nấu
                  </label>
                  <Input
                    type="datetime-local"
                    value={cookDate}
                    onChange={(e) => setCookDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ngày giao
                  </label>
                  <Input
                    type="datetime-local"
                    value={deliverDate}
                    onChange={(e) => setDeliverDate(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              {timelineAllFilled && !timelineOrderOk && (
                <p className="text-sm text-red-600">
                  Thứ tự mốc thời gian chưa hợp lý (Kết thúc ≤ Mua NL ≤ Nấu ≤
                  Giao).
                </p>
              )}
            </div>

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
