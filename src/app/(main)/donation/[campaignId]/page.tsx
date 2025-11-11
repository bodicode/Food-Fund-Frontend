"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Copy, CheckCircle, Heart, QrCode, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader } from "@/components/animate-ui/icons/loader";
import { donationService } from "@/services/donation.service";
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { DonationResponse } from "@/types/api/donation";
import { formatCurrency } from "@/lib/utils/currency-utils";

const SUGGESTED_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000];

export default function DonationPage() {
    const { campaignId } = useParams();
    const router = useRouter();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [description] = useState<string>("");
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [donationData, setDonationData] = useState<DonationResponse | null>(null);

    useEffect(() => {
        if (!campaignId) return;

        const fetchCampaign = async () => {
            try {
                const data = await campaignService.getCampaignById(campaignId as string);
                setCampaign(data);
            } catch {
                toast.error("Không thể tải thông tin chiến dịch");
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [campaignId]);

    const handleAmountSelect = (selectedAmount: number) => {
        setAmount(selectedAmount.toString());
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        setAmount(value);
    };

    const handleCreateDonation = async () => {
        if (!campaignId || !amount) {
            toast.error("Vui lòng nhập số tiền ủng hộ");
            return;
        }

        const amountNumber = parseInt(amount);
        if (amountNumber < 1000) {
            toast.error("Số tiền ủng hộ tối thiểu là 1,000 VNĐ");
            return;
        }

        setCreating(true);
        try {
            const result = await donationService.createDonation({
                amount: amountNumber,
                campaignId: campaignId as string,
                isAnonymous,
                description: description.trim() || undefined,
            });

            if (result) {
                setDonationData(result);
                toast.success("Tạo lệnh ủng hộ thành công!");
            }
        } catch {
            toast.error("Không thể tạo lệnh ủng hộ. Vui lòng thử lại!");
        } finally {
            setCreating(false);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Đã sao chép ${label}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-6xl">💔</div>
                <p className="text-gray-500">Không tìm thấy chiến dịch</p>
                <Button onClick={() => router.push("/")}>Về trang chủ</Button>
            </div>
        );
    }

    if (donationData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pt-20 pb-8">
                <div className="container max-w-2xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
                    >
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Thông tin chuyển khoản
                            </h1>
                            <p className="text-gray-600">
                                Vui lòng chuyển khoản theo thông tin bên dưới
                            </p>
                        </div>

                        {/* QR Code */}
                        {donationData.qrCode && donationData.qrCode.trim() !== "" && (
                            <div className="text-center">
                                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
                                    <QRCodeSVG
                                        value={donationData.qrCode}
                                        size={200}
                                        level="M"
                                        className="mx-auto"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
                                    <QrCode className="w-4 h-4" />
                                    Quét mã QR để chuyển khoản nhanh
                                </p>
                            </div>
                        )}

                        {/* Bank Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                {donationData.bankLogo && donationData.bankLogo.trim() !== "" && (
                                    <Image
                                        src={donationData.bankLogo.startsWith('http') ? donationData.bankLogo : `/images/banks/${donationData.bankLogo}`}
                                        alt={donationData.bankName}
                                        width={40}
                                        height={40}
                                        className="rounded"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{donationData.bankFullName}</p>
                                    <p className="text-sm text-gray-600">{donationData.bankName}</p>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">Số tài khoản</p>
                                        <p className="font-mono font-semibold text-gray-900">
                                            {donationData.bankNumber}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(donationData.bankNumber, "số tài khoản")}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">Tên tài khoản</p>
                                        <p className="font-semibold text-gray-900">
                                            {donationData.bankAccountName}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(donationData.bankAccountName, "tên tài khoản")}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">Số tiền</p>
                                        <p className="font-bold text-lg text-[#ad4e28]">
                                            {formatCurrency(donationData.amount)}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(donationData.amount.toString(), "số tiền")}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">Nội dung chuyển khoản</p>
                                        <p className="font-mono text-sm text-gray-900">
                                            {donationData.description}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(donationData.description, "nội dung")}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Important Note */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Lưu ý quan trọng:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống có thể xác nhận tự động.
                                Sau khi chuyển khoản thành công, khoản ủng hộ sẽ được cập nhật trong vòng 5-10 phút.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/campaign/${campaignId}`)}
                                className="flex-1"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại chiến dịch
                            </Button>
                            <Button
                                onClick={() => router.push("/")}
                                className="flex-1 bg-[#ad4e28] hover:bg-[#9c4624]"
                            >
                                Về trang chủ
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pt-20 pb-8">
            <div className="container max-w-2xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
                >
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-500" />
                                Ủng hộ chiến dịch
                            </h1>
                            <p className="text-sm text-gray-600 truncate">{campaign.title}</p>
                        </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <Image
                            src={campaign.coverImage || "/images/default-campaign.jpg"}
                            alt={campaign.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {campaign.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Mục tiêu: {formatCurrency(campaign.targetAmount)}
                            </p>
                            <p className="text-sm text-gray-600">
                                Đã nhận: {formatCurrency(campaign.receivedAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Amount Selection */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Chọn số tiền ủng hộ</h3>

                        {/* Suggested Amounts */}
                        <div className="grid grid-cols-2 gap-3">
                            {SUGGESTED_AMOUNTS.map((suggestedAmount) => (
                                <Button
                                    key={suggestedAmount}
                                    variant={amount === suggestedAmount.toString() ? "default" : "outline"}
                                    onClick={() => handleAmountSelect(suggestedAmount)}
                                    className={amount === suggestedAmount.toString() ? "bg-[#ad4e28] hover:bg-[#9c4624]" : ""}
                                >
                                    {formatCurrency(suggestedAmount)}
                                </Button>
                            ))}
                        </div>

                        {/* Custom Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Hoặc nhập số tiền khác (tối thiểu 1,000 VNĐ)
                            </label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                value={amount ? formatCurrency(amount) : ""}
                                onChange={handleAmountChange}
                                placeholder="Nhập số tiền..."
                                className="text-lg font-semibold"
                            />
                        </div>
                    </div>

                    {/* Anonymous Option */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="anonymous"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <label
                            htmlFor="anonymous"
                            className="text-sm text-gray-700 cursor-pointer"
                        >
                            Ủng hộ ẩn danh
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleCreateDonation}
                        disabled={!amount || creating}
                        className="w-full bg-gradient-to-r from-[#ad4e28] to-[#E77731] hover:opacity-90 text-white font-semibold py-3"
                    >
                        {creating ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Đang tạo lệnh ủng hộ...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Tạo lệnh ủng hộ {amount && `- ${formatCurrency(amount)}`}
                            </>
                        )}
                    </Button>

                    {/* Security Note */}
                    <div className="text-center text-xs text-gray-500">
                        <p>🔒 Thông tin của bạn được bảo mật tuyệt đối</p>
                        <p>Chúng tôi không lưu trữ thông tin tài khoản ngân hàng</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}