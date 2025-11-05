import { toast } from "sonner";
import { fromPercentInput } from "../utils/percent-utils";
import { Campaign } from "@/types/api/campaign";
import { VALIDATION_MESSAGES, VALIDATION_RULES } from "@/constants";

export function validateCampaignBeforeSave(
  campaign: Partial<Campaign> | null | undefined,
  pcts: {
    ingredient: string;
    cooking: string;
    delivery: string;
  }
): boolean {
  if (!campaign) {
    toast.error(VALIDATION_MESSAGES.INVALID_CAMPAIGN);
    return false;
  }

  const s = campaign.fundraisingStartDate
    ? new Date(campaign.fundraisingStartDate)
    : null;
  const e = campaign.fundraisingEndDate
    ? new Date(campaign.fundraisingEndDate)
    : null;

  if (s && e && s > e) {
    toast.error(VALIDATION_MESSAGES.INVALID_DATE_RANGE);
    return false;
  }

  const p1 = fromPercentInput(pcts.ingredient);
  const p2 = fromPercentInput(pcts.cooking);
  const p3 = fromPercentInput(pcts.delivery);
  const total = p1 + p2 + p3;

  if (Math.abs(total - 100) > VALIDATION_RULES.PERCENTAGE_TOLERANCE) {
    toast.error(VALIDATION_MESSAGES.INVALID_PERCENTAGE_TOTAL);
    return false;
  }

  return true;
}
