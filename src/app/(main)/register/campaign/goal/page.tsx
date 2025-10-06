"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateForm } from "@/store/slices/campaign-form-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CreateCampaignStepGoal() {
    const router = useRouter();
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => state.campaignForm);

    const [targetAmount, setTargetAmount] = useState(form.targetAmount || "");

    useEffect(() => {
        if (form.targetAmount) setTargetAmount(form.targetAmount);
    }, [form.targetAmount]);

    const handleNextStep = () => {
        if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
            toast.error("Vui lòng nhập số tiền hợp lệ.");
            return;
        }

        dispatch(updateForm({ targetAmount: targetAmount.toString() }));
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
                            Xác định số tiền bạn mong muốn quyên góp để giúp cộng đồng hiểu rõ
                            hơn về mục tiêu chiến dịch.
                        </p>
                    </div>

                    <div className="lg:col-span-2 space-y-10 pl-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-color">
                                Bạn muốn quyên góp bao nhiêu?
                            </h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Số tiền mục tiêu (VNĐ)
                                </label>
                                <Input
                                    type="number"
                                    min={1000}
                                    step={1000}
                                    placeholder="Nhập số tiền (ví dụ: 200000000)"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    className="h-12 text-lg font-medium"
                                />
                            </div>

                            {form.location && (
                                <p className="text-gray-500 text-sm mt-2">
                                    <span className="font-semibold text-gray-700">Địa điểm: </span>
                                    {form.location}
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
                                className={`h-12 px-8 text-base font-semibold w-full sm:w-auto ${!targetAmount
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "btn-color text-white"
                                    }`}
                                disabled={!targetAmount}
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
