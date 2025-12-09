"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { systemConfigService } from "@/services/system-config.service";

interface DonationTermsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DonationTermsDialog({
    isOpen,
    onClose,
    onConfirm,
}: DonationTermsDialogProps) {
    const [minFundingPercentage, setMinFundingPercentage] = useState<string>("50");

    useEffect(() => {
        if (isOpen) {
            systemConfigService.getSystemConfig("MIN_FUNDING_PERCENTAGE").then((config) => {
                if (config) {
                    setMinFundingPercentage(config.value);
                }
            });
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-color">
                        <ShieldCheck className="w-6 h-6 text-[#E77731]" />
                        Quy định về sử dụng quỹ
                    </DialogTitle>
                    <DialogDescription>
                        Vui lòng đọc kỹ các quy định dưới đây trước khi tiến hành ủng hộ.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            Trường hợp chiến dịch bị hủy
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Nếu chiến dịch bị hủy do phát hiện gian lận hoặc vi phạm chính sách của nền tảng (do Hệ thống hủy), chiến dịch sẽ được chuyển sang cho tổ chức khác <strong>và số tiền ủng hộ vẫn sẽ ở trong chiến dịch đó</strong>.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <InfoIcon className="w-4 h-4 text-blue-600" />
                            Trường hợp không đạt mục tiêu
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Nếu chiến dịch kết thúc mà <strong>không đạt được <span className="text-red-600 font-bold text-lg">{minFundingPercentage}%</span></strong> mục tiêu gây quỹ ban đầu, số tiền bạn đã ủng hộ sẽ được chuyển vào <strong>Quỹ chung của hệ thống</strong> để hỗ trợ các chiến dịch khó khăn khác (Sung công quỹ).
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} className="sm:w-auto">
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-gradient-to-r from-[#E77731] to-[#ad4e28] text-white hover:opacity-90 sm:w-auto"
                    >
                        Đồng ý và tiếp tục
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function InfoIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}
