import { toast } from "sonner";
import { fromPercentInput } from "../utils/percent-utils";
import { Campaign } from "@/types/api/campaign";

export function validateCampaignBeforeSave(
  campaign: Partial<Campaign> | null | undefined,
  pcts: {
    ingredient: string;
    cooking: string;
    delivery: string;
  }
): boolean {
  if (!campaign) {
    toast.error("Chiến dịch không hợp lệ.");
    return false;
  }

  const s = campaign.fundraisingStartDate
    ? new Date(campaign.fundraisingStartDate)
    : null;
  const e = campaign.fundraisingEndDate
    ? new Date(campaign.fundraisingEndDate)
    : null;

  if (s && e && s > e) {
    toast.error("Ngày kết thúc phải sau (hoặc bằng) ngày bắt đầu.");
    return false;
  }

  const p1 = fromPercentInput(pcts.ingredient);
  const p2 = fromPercentInput(pcts.cooking);
  const p3 = fromPercentInput(pcts.delivery);
  const total = p1 + p2 + p3;

  if (Math.abs(total - 100) > 0.01) {
    toast.error("Tổng phần trăm phân bổ phải bằng 100%.");
    return false;
  }

  return true;
}
