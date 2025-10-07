"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion"; // 👈 thêm framer-motion
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Clock, Goal, MapPin } from "lucide-react";

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);

export default function CampaignDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await campaignService.getCampaignById(id as string);
      setCampaign(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader animate loop className="h-8 w-8 text-color" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Không tìm thấy chiến dịch.
      </div>
    );
  }

  const raised = Number(campaign.receivedAmount || 0);
  const goal = Number(campaign.targetAmount || 1);
  const progress = Math.min(Math.round((raised / goal) * 100), 100);

  // Calculate days left
  const calculateDaysLeft = (endDate?: string, startDate?: string): string => {
    if (!endDate) return "Không xác định";

    const now = new Date();
    const end = new Date(endDate);
    const start = startDate ? new Date(startDate) : null;

    if (start && now < start) {
      const diffToStart = Math.ceil(
        (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `Chưa bắt đầu (còn ${diffToStart} ngày)`;
    }

    if (now > end) {
      return "Đã kết thúc";
    }

    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${diff} ngày`;
  };

  const timeLeft = calculateDaysLeft(campaign.endDate, campaign.startDate);

  const handleDirection = () => {
    router.push(`/map/${campaign.id}`);
  };

  // 👇 chỉ thêm motion.wrapper để animate
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto pt-30 pb-20 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-color mb-6">
              {campaign.title}
            </h1>

            <div className="rounded-2xl overflow-hidden shadow-md mb-6">
              <Image
                src={campaign.coverImage || "/images/default-cover.jpg"}
                alt={campaign.title}
                width={1200}
                height={600}
                className="object-cover w-full h-[400px] md:h-[500px]"
              />
            </div>

            <div className="mb-8">
              <span className="inline-block bg-[#ad4e28]/10 text-[#ad4e28] text-sm font-medium px-3 py-1 rounded-full">
                {campaign.category?.title || "Chiến dịch"}
              </span>
            </div>

            <div
              className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: campaign.description || "" }}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/avatar.webp"
                  alt="Avatar"
                  width={50}
                  height={50}
                  className="rounded-full border"
                />
                <div>
                  <h3 className="font-semibold text-orange-600">
                    {campaign?.creator?.full_name || "Người vận động"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tiền ủng hộ được chuyển đến tổ chức này
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm mb-3 border-t pt-3">
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <Goal className="inline w-4 h-4" /> Mục tiêu chiến dịch
                </span>
                <span className="font-bold">{fmtVND(goal)}</span>
              </div>

              <div className="flex justify-between items-center text-sm mb-3">
                <span className="flex items-center gap-1 text-blue-600 font-semibold">
                  <Clock className="inline w-4 h-4" /> Thời gian còn lại
                </span>
                <span className="font-semibold">{timeLeft}</span>
              </div>

              {campaign.location && (
                <div className="flex items-center text-gray-500 text-sm mb-4 gap-1">
                  <span>
                    <MapPin className="inline mr-2 w-4 h-4" />
                    {campaign.location}
                  </span>
                </div>
              )}

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-3">
                <div
                  className="h-3 bg-[#f97316] rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span>Đã đạt được</span>
                <span className="font-semibold text-[#ad4e28]">
                  {fmtVND(raised)} ({progress}%)
                </span>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDirection}
                  className="flex-1 py-2 rounded-lg border border-[#ad4e28] text-[#ad4e28] font-medium hover:bg-[#ad4e28]/10"
                >
                  Chỉ đường
                </button>

                <button className="flex-1 py-2 rounded-lg bg-[#ad4e28] text-white font-medium hover:opacity-90">
                  Ủng hộ
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3 italic">
                Chia sẻ chiến dịch để lan tỏa yêu thương
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-center">
              <h3 className="font-semibold text-gray-800 mb-3">
                Quét mã QR để ủng hộ
              </h3>
              <Image
                src="/images/qr-code.png"
                alt="QR Code"
                width={180}
                height={180}
                className="mx-auto mb-3"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">
                Thông tin người vận động
              </h3>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/avatar.webp"
                  alt={campaign?.creator?.full_name || "Người vận động"}
                  width={50}
                  height={50}
                  className="rounded-full border"
                />
                <div>
                  <p className="font-medium">
                    {campaign?.creator?.full_name || "Người vận động"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {campaign?.creator?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
