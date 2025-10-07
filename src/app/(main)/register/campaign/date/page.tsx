"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateForm } from "@/store/slices/campaign-form-slice";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { isBefore, startOfDay } from "date-fns";

export default function CreateCampaignStepDate() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.campaignForm);

  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [startDate, setStartDate] = useState<Date | undefined>(
    form.startDate ? new Date(form.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    form.endDate ? new Date(form.endDate) : undefined
  );

  const handleStartDateSelect = (date?: Date) => {
    if (!date) return;
    if (isBefore(date, tomorrow)) {
      toast.warning("Ngày bắt đầu phải sau hôm nay (từ ngày mai).");
      return;
    }
    setStartDate(date);
    if (endDate && isBefore(endDate, date)) {
      setEndDate(undefined);
    }
  };

  const handleEndDateSelect = (date?: Date) => {
    if (!startDate) {
      toast.warning("Vui lòng chọn ngày bắt đầu trước.");
      return;
    }
    if (!date) return;
    if (isBefore(date, startDate)) {
      toast.error("Ngày kết thúc không thể trước ngày bắt đầu.");
      return;
    }
    setEndDate(date);
  };

  const handleNext = () => {
    if (!startDate || !endDate) {
      toast.warning("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.");
      return;
    }

    dispatch(
      updateForm({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
    );

    toast.success("Lưu thành công! Xem lại chiến dịch của bạn trước khi gửi.");
    router.push("/register/campaign/preview");
  };

  return (
    <div className="min-h-screen pt-14 bg-gray-50">
      <div className="container mx-auto !max-w-7xl px-6 py-12 lg:py-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-20">
            <p className="text-sm text-gray-500 mb-3">Bước 5 / 6</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-snug">
              Chọn thời gian <br /> cho chiến dịch của bạn
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Hãy đặt lịch cho chiến dịch gây quỹ. Ngày bắt đầu phải từ ngày
              mai.
            </p>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Ngày bắt đầu
                </h2>
                <p className="text-gray-600 mb-4">
                  Vui lòng chọn ngày bắt đầu chiến dịch (sau hôm nay)
                </p>
                <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-center">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    disabled={(date) => isBefore(date, tomorrow)}
                  />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Ngày kết thúc
                </h2>
                <p className="text-gray-600 mb-4">
                  Ngày kết thúc không thể trước ngày bắt đầu.
                </p>
                <div className="bg-white border rounded-xl p-5 shadow-sm flex justify-center">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    disabled={(date) => !startDate || isBefore(date, startDate)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
              <Button
                variant="outline"
                className="h-12 px-6 w-full sm:w-auto"
                onClick={() => router.push("/register/campaign/story")}
              >
                ← Quay lại
              </Button>

              <Button
                className={`h-12 px-8 text-base font-semibold w-full sm:w-auto ${
                  !startDate || !endDate
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-color text-white"
                }`}
                disabled={!startDate || !endDate}
                onClick={handleNext}
              >
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
