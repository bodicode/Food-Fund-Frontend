"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Loader } from "@/components/animate-ui/icons/loader";

import { statusConfig } from "@/lib/translator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  DollarSign,
  CalendarDays,
  GoalIcon,
  Info,
  Share2,
  Copy,
} from "lucide-react";

import { ProgressBar } from "@/components/campaign/progress-bar";
import { DateRow } from "@/components/campaign/date-row";
import { BudgetBreakdown } from "@/components/campaign/budget-breakdown";
import { ActionPanel } from "@/components/campaign/action-panel";
import { OrganizerCard } from "@/components/campaign/organization-card";
import { QRCard } from "@/components/campaign/qr-card";
import { calcDaysLeft, calcProgress, coverSrc, toNumber } from "@/lib/utils/utils";
import { Stat } from "@/components/campaign/stat";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDate } from "@/lib/utils/date-utils";

export default function CampaignDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const raised = toNumber(campaign.receivedAmount, 0);
  const goal = Math.max(toNumber(campaign.targetAmount, 0), 1);
  const progress = calcProgress(campaign.receivedAmount, campaign.targetAmount);
  const timeLeft = calcDaysLeft(
    campaign.fundraisingEndDate,
    campaign.fundraisingStartDate
  );
  const status = statusConfig[campaign.status];

  const ingredientPct = toNumber(campaign.ingredientBudgetPercentage, 0);
  const cookingPct = toNumber(campaign.cookingBudgetPercentage, 0);
  const deliveryPct = toNumber(campaign.deliveryBudgetPercentage, 0);

  const ingredientAmt =
    toNumber(campaign.ingredientFundsAmount, 0) ||
    Math.round((ingredientPct / 100) * goal);

  const cookingAmt =
    toNumber(campaign.cookingFundsAmount, 0) ||
    Math.round((cookingPct / 100) * goal);

  const deliveryAmt =
    toNumber(campaign.deliveryFundsAmount, 0) ||
    Math.round((deliveryPct / 100) * goal);

  const hasBudget =
    ingredientAmt > 0 ||
    cookingAmt > 0 ||
    deliveryAmt > 0 ||
    ingredientPct > 0 ||
    cookingPct > 0 ||
    deliveryPct > 0;

  const handleDirection = () => router.push(`/map/${campaign.id}`);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: campaign.title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto pt-30 pb-20 px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden ring-1 ring-gray-200 shadow-sm mb-8">
          <Image
            src={coverSrc(campaign.coverImage)}
            alt={campaign.title}
            width={1600}
            height={900}
            priority
            className="object-cover w-full h-[280px] md:h-[420px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from black/40 via-black/10 to-transparent" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge
              className={`${status.color} flex items-center gap-1 border-0 shadow`}
            >
              <status.icon className="w-4 h-4" /> {status.label}
            </Badge>
            {campaign.category?.title && (
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                {campaign.category.title}
              </Badge>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleShare}
                className="backdrop-blur bg-white/80"
              >
                {copied ? (
                  <Copy className="w-4 h-4 mr-2" />
                ) : (
                  <Share2 className="w-4 h-4 mr-2" />
                )}
                {copied ? "Đã sao chép" : "Chia sẻ"}
              </Button>
              <Button
                onClick={() =>
                  router.push(`/campaign/${campaign.id}/donations`)
                }
                variant="outline"
                className="bg-white/80 backdrop-blur border-white/70"
              >
                Xem quyên góp
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600 font-medium">
              Tiến độ gây quỹ
            </div>
            <div className="text-sm font-semibold text-[#ad4e28]">
              {progress}%
            </div>
          </div>

          <ProgressBar value={progress} />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center mt-5">
            <Stat
              icon={<DollarSign className="mx-auto w-5 h-5" />}
              label="Đã nhận"
              value={formatCurrency(raised)}
              tone="text-green-600"
            />
            <Stat
              icon={<GoalIcon className="mx-auto w-5 h-5" />}
              label="Mục tiêu"
              value={formatCurrency(goal)}
              tone="text-yellow-600"
            />
            <Stat
              icon={<Users className="mx-auto w-5 h-5" />}
              label="Lượt đóng góp"
              value={String(campaign.donationCount ?? 0)}
              tone="text-blue-600"
            />
            <Stat
              icon={<CalendarDays className="mx-auto w-5 h-5" />}
              label="Ngày bắt đầu"
              value={formatDate(campaign.fundraisingStartDate)}
            />
            <Stat
              icon={<CalendarDays className="mx-auto w-5 h-5" />}
              label="Ngày kết thúc"
              value={formatDate(campaign.fundraisingEndDate)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-5 text-sm text-gray-600">
              {campaign.location && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                  <MapPin className="w-4 h-4" /> {campaign.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                <CalendarDays className="w-4 h-4" />
                Còn lại: <b className="ml-1">{timeLeft}</b>
              </span>
            </div>

            <div className="bg-white rounded-2xl border p-6 mb-8">
              <div className="mb-4 flex items-center gap-2 text-gray-800">
                <Info className="w-4 h-4" />
                <h3 className="font-semibold">Mô tả chiến dịch</h3>
              </div>
              {campaign.description ? (
                <div
                  className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: campaign.description }}
                />
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Chưa có mô tả chi tiết.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                Mốc thời gian
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateRow
                  label="Bắt đầu gây quỹ"
                  value={formatDate(campaign.fundraisingStartDate)}
                />
                <DateRow
                  label="Kết thúc gây quỹ"
                  value={formatDate(campaign.fundraisingEndDate)}
                />
                <DateRow
                  label="Mua nguyên liệu"
                  value={formatDate(campaign.ingredientPurchaseDate)}
                />
                <DateRow
                  label="Nấu ăn"
                  value={formatDate(campaign.cookingDate)}
                />
                <DateRow
                  label="Giao/Phân phát"
                  value={formatDate(campaign.deliveryDate)}
                />
                <DateRow
                  label="Ngày tạo"
                  value={formatDate(campaign.created_at)}
                />
              </div>
            </div>

            {hasBudget && (
              <div className="bg-white rounded-2xl border p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Phân bổ ngân sách
                </h3>
                <BudgetBreakdown
                  items={[
                    {
                      title: "Nguyên liệu",
                      amount: ingredientAmt,
                      percent: ingredientPct,
                    },
                    {
                      title: "Nấu ăn",
                      amount: cookingAmt,
                      percent: cookingPct,
                    },
                    {
                      title: "Vận chuyển",
                      amount: deliveryAmt,
                      percent: deliveryPct,
                    },
                  ]}
                />
              </div>
            )}
          </div>

          <aside className="space-y-6 xl:sticky xl:top-28 h-fit">
            <ActionPanel
              canEdit={campaign.status === "PENDING"}
              onEdit={() =>
                router.push(`/profile/my-campaign/${campaign.id}/edit`)
              }
              onViewDonations={() =>
                router.push(`/campaign/${campaign.id}/donations`)
              }
              onDirection={handleDirection}
            />

            <OrganizerCard
              name={campaign.creator?.full_name}
              email={campaign.creator?.email}
              phone={campaign.creator?.phone_number}
            />

            <QRCard />
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
