"use client";

import { useState, useEffect, useCallback } from "react";
import { campaignService } from "@/services/campaign.service";
import { Campaign, CampaignParams } from "@/types/api/campaign";

export function useCampaigns(initialParams: CampaignParams = {}) {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const [params, setParams] = useState<CampaignParams>({
        search: initialParams.search || undefined,
        filter: initialParams.filter || {},
        sortBy: initialParams.sortBy || "NEWEST_FIRST",
        limit: initialParams.limit || 20,
        offset: initialParams.offset || 0,
    });

    const fetchCampaigns = useCallback(
        async (override?: Partial<CampaignParams>, loadMore = false) => {
            try {
                setLoading(true);
                setError(null);

                const finalParams: CampaignParams = { ...params, ...override };
                const data = await campaignService.getCampaigns(finalParams);

                setCampaigns((prev) =>
                    loadMore ? [...prev, ...(data || [])] : data || []
                );

                setHasMore((data?.length || 0) >= (finalParams.limit || 20));

                setParams(finalParams);
            } catch (err) {
                setError("Không thể tải danh sách campaign");
                console.error("Error fetching campaigns:", err);
            } finally {
                setLoading(false);
            }
        },
        [params]
    );

    useEffect(() => {
        fetchCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        campaigns,
        loading,
        error,
        params,
        setParams,
        fetchCampaigns,
        hasMore,
    };
}
