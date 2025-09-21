import CampaignSearchPage from "@/components/s/campaign-search";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <CampaignSearchPage />
    </Suspense>
  );
}
