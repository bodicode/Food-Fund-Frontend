"use client";

import client from "@/lib/apollo-client";
import { GENERATE_CAMPAIGN_IMAGE_UPLOAD_URL } from "@/graphql/mutations/campaign/generate-upload-url";
import { buildCoverUrl } from "@/lib/build-image";

type GenerateUploadUrlResp = {
    generateCampaignImageUploadUrl: {
        uploadUrl: string;
        fileKey: string;
        expiresAt: string;
        cdnUrl?: string | null;
        instructions?: string | null;
    };
};

// Helper: map MIME → extension
function toExtFromMime(mime: string) {
    const type = mime.toLowerCase();
    if (type.includes("jpeg") || type.includes("jpg")) return "jpeg";
    if (type.includes("png")) return "png";
    if (type.includes("webp")) return "webp";
    if (type.includes("gif")) return "gif";
    if (type.includes("mp4")) return "mp4";
    if (type.includes("webm")) return "webm";
    if (type.includes("quicktime")) return "mov";
    return "jpeg";
}

// Optional delay (CDN sync delay)
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const uploadService = {
    async uploadCampaignCover(
        file: File,
        opts?: { campaignId?: string | null }
    ): Promise<{ fileKey: string; cdnUrl: string }> {
        try {
            const { data } = await client.mutate<GenerateUploadUrlResp>({
                mutation: GENERATE_CAMPAIGN_IMAGE_UPLOAD_URL,
                variables: {
                    input: {
                        campaignId: opts?.campaignId ?? null,
                        fileType: toExtFromMime(file.type),
                    },
                },
                fetchPolicy: "no-cache",
            });

            const payload = data?.generateCampaignImageUploadUrl;
            if (!payload?.uploadUrl || !payload?.fileKey) {
                throw new Error("Không lấy được uploadUrl hoặc fileKey từ server.");
            }

            const response = await fetch(payload.uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type || "image/jpeg",
                    "x-amz-acl": "public-read",
                },
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => "");
                throw new Error(
                    `Upload failed: ${response.status} ${response.statusText} — ${errorText}`
                );
            }

            const cdnUrl = buildCoverUrl(payload.fileKey);

            await sleep(2000);

            return { fileKey: payload.fileKey, cdnUrl };
        } catch (error) {
            throw error;
        }
    },
};
