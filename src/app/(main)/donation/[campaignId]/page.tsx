"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Copy, CheckCircle, Heart, QrCode } from "lucide-react";
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
import { createCampaignSlug, getCampaignIdFromSlug } from "@/lib/utils/slug-utils";

const SUGGESTED_AMOUNTS = [50000, 100000, 200000, 500000];

export default function DonationPage() {
    const { campaignId: paramId } = useParams();
    const router = useRouter();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [description] = useState<string>("");
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [donationData, setDonationData] = useState<DonationResponse | null>(null);

    // Resolve campaignId from slug or use param directly
    const campaignId = getCampaignIdFromSlug(paramId as string) || paramId;

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

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (!campaignId) return;
                                    const slug = campaign?.title ? createCampaignSlug(campaign.title, campaignId as string) : campaignId;
                                    router.push(`/campaign/${slug}`);
                                }}
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

    const targetAmt = Number(campaign.targetAmount) || 0;
    const receivedAmt = Number(campaign.receivedAmount) || 0;
    const progress = targetAmt > 0
        ? Math.min((receivedAmt / targetAmt) * 100, 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-8">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-gray-600 mb-3 hover:text-gray-900 self-start"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch"
                >
                    {/* Left Column - Campaign Info */}
                    <div className="space-y-4 flex flex-col">
                        {/* Campaign Card */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex-1">
                            {/* Header */}
                            <div className="p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-[#E77731]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Tổ chức gây quỹ / Người đại diện</p>
                                        <h2 className="font-bold text-gray-900">{campaign.creator?.full_name || "Tổ chức"}</h2>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Image */}
                            <div className="relative aspect-video">
                                <Image
                                    src={campaign.coverImage || "/images/default-campaign.jpg"}
                                    alt={campaign.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                                    Còn 78 ngày
                                </div>
                            </div>

                            {/* Campaign Details */}
                            <div className="p-4 space-y-3">
                                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                                    {campaign.title}
                                </h3>

                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Đã đạt được:</span>
                                        <span className="font-bold text-[#E77731]">
                                            {formatCurrency(campaign.receivedAmount)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-[#E77731] to-[#ad4e28] h-2 rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{Math.round(progress)}%</span>
                                        <span>Mục tiêu: {formatCurrency(campaign.targetAmount)}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-between pt-2 border-t">
                                    <div>
                                        <p className="text-xs text-gray-500">Còn mục tiêu</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(Math.max(0, targetAmt - receivedAmt))}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Lượt ủng hộ</p>
                                        <p className="font-semibold text-gray-900">
                                            {Number(campaign.donationCount) || 0} lượt ủng hộ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Donation Form */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 flex flex-col sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900">Thông tin ủng hộ</h2>

                        {/* Login Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                Nếu bạn muốn lưu họ tên chuyển khoản của mình, vui lòng{" "}
                                <span
                                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                                    onClick={() => router.push("/login")}
                                >
                                    đăng nhập
                                </span>
                                {" "}hoặc{" "}
                                <span
                                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                                    onClick={() => router.push("/register")}
                                >
                                    đăng ký tài khoản
                                </span>
                                . Nếu không đăng nhập, mọi thông tin ủng hộ của bạn sẽ bị ẩn danh.
                            </p>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">
                                Nhập số tiền ủng hộ <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    value={amount ? Number(amount).toLocaleString('vi-VN') : ''}
                                    onChange={handleAmountChange}
                                    placeholder="0"
                                    className="text-3xl font-bold text-[#E77731] border-2 border-gray-200 focus:border-[#E77731] h-16 pr-16"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#E77731]">
                                    VNĐ
                                </span>
                            </div>
                        </div>

                        {/* Suggested Amounts */}
                        <div className="grid grid-cols-4 gap-2">
                            {SUGGESTED_AMOUNTS.map((suggestedAmount) => (
                                <Button
                                    key={suggestedAmount}
                                    variant="outline"
                                    onClick={() => handleAmountSelect(suggestedAmount)}
                                    className={`text-xs py-2 ${amount === suggestedAmount.toString()
                                        ? "border-[#E77731] bg-orange-50 text-[#E77731]"
                                        : "border-gray-200"
                                        }`}
                                >
                                    {suggestedAmount >= 1000000
                                        ? `${suggestedAmount / 1000000}tr`
                                        : `${suggestedAmount / 1000}k`}
                                </Button>
                            ))}
                        </div>

                        {/* Anonymous Checkbox */}
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="anonymous"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#E77731] focus:ring-[#E77731]"
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
                            className="w-full bg-[#E77731] hover:bg-[#ad4e28] text-white font-semibold py-6 text-lg rounded-xl"
                        >
                            {creating ? (
                                <>
                                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Ủng hộ"
                            )}
                        </Button>

                        {/* Important Note */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Lưu ý quan trọng:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống có thể xác nhận tự động.
                                Sau khi chuyển khoản thành công, khoản ủng hộ sẽ được cập nhật trong vòng 5-10 phút.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}