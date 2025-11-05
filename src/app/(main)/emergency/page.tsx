"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CampaignCard } from "@/components/shared/campaign-card";
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Skeleton } from "@/components/ui/skeleton";

const getDaysRemaining = (endDate: string): number => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const diff = end - now;
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

const filterEmergencyCampaigns = (campaigns: Campaign[]): Campaign[] => {
  return campaigns.filter((campaign) => {
    if (!campaign.fundraisingEndDate) return false;
    const daysLeft = getDaysRemaining(campaign.fundraisingEndDate);
    return daysLeft > 0 && daysLeft <= 7;
  });
};

export default function EmergencyPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencyCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns({
          filter: { status: ["ACTIVE", "APPROVED"] },
          sortBy: "NEWEST_FIRST",
          limit: 50,
          offset: 0,
        });

        if (data) {
          const emergencyCampaigns = filterEmergencyCampaigns(data);

          emergencyCampaigns.sort((a, b) => {
            const daysA = getDaysRemaining(a.fundraisingEndDate || "");
            const daysB = getDaysRemaining(b.fundraisingEndDate || "");
            return daysA - daysB;
          });

          setCampaigns(emergencyCampaigns);
        }
      } catch (error) {
        console.error("Error loading emergency campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyCampaigns();
  }, []);

  return (
    <div className="flex flex-col pb-20">
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-[70vh] flex items-center justify-center text-center text-white"
      >
        <Image
          src="/images/emergency-hero.png"
          alt="Emergency support"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-3xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl"
          >
            Các chiến dịch sắp hết hạn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl drop-shadow-lg leading-relaxed"
          >
            Những chiến dịch còn{" "}
            <span className="font-bold text-yellow-300">dưới 7 ngày</span>
          </motion.p>
        </div>
      </motion.section>

      <section className="-mt-24 px-4 sm:px-6 md:px-16 relative z-20">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-[450px] w-full rounded-2xl" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl p-12 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Không có chiến dịch khẩn cấp
              </h3>
              <p className="text-gray-600">
                Hiện tại không có chiến dịch nào cần hỗ trợ gấp. Hãy khám phá
                các chiến dịch khác!
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
              >
                <p className="text-red-800 font-semibold flex items-center gap-2">
                  <span>
                    Tìm thấy{" "}
                    <span className="font-bold">{campaigns.length}</span> chiến
                    dịch sắp hết hạn
                  </span>
                </p>
              </motion.div>

              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((campaign, idx) => {
                  return (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.1 * idx,
                        ease: "easeOut",
                      }}
                    >
                      <CampaignCard
                        id={campaign.id}
                        title={campaign.title}
                        coverImage={
                          campaign.coverImage || "/images/default-campaign.jpg"
                        }
                        phases={campaign.phases}
                        status={campaign.status}
                        donationCount={campaign.donationCount || 0}
                        receivedAmount={campaign.receivedAmount}
                        targetAmount={campaign.targetAmount}
                        isEmergency
                      />
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
