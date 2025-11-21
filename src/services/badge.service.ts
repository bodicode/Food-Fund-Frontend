import { GET_ALL_BADGES } from "@/graphql/query/badge/get-all-badges";
import { GET_BADGE_BY_ID } from "@/graphql/query/badge/get-badge-by-id";
import { CREATE_BADGE } from "@/graphql/mutations/badge/create-badge";
import { UPDATE_BADGE } from "@/graphql/mutations/badge/update-badge";
import { GENERATE_BADGE_UPLOAD_URL } from "@/graphql/mutations/badge/generate-badge-upload-url";
import client from "@/lib/apollo-client";
import { Badge } from "@/types/api/user";

export interface CreateBadgeInput {
  name: string;
  description: string;
  icon_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface UpdateBadgeInput {
  name?: string;
  description?: string;
  icon_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface GenerateBadgeUploadUrlInput {
  fileType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  cdnUrl: string;
  fileKey: string;
  fileType: string;
  expiresAt: string;
}

export interface GenerateUploadUrlResponse {
  success: boolean;
  message: string;
  instructions: string;
  uploadUrl: UploadUrlResponse;
}

export const badgeService = {
  async getAllBadges(): Promise<Badge[]> {
    try {
      const { data } = await client.query<{
        getAllBadges: Badge[];
      }>({
        query: GET_ALL_BADGES,
        fetchPolicy: "network-only",
      });

      if (!data?.getAllBadges) {
        return [];
      }

      return data.getAllBadges;
    } catch (error) {
      console.error("Error fetching badges:", error);
      throw error;
    }
  },

  async generateUploadUrl(
    fileType: string
  ): Promise<GenerateUploadUrlResponse> {
    try {
      // Convert MIME type to extension if needed
      let extension = fileType;
      if (fileType.startsWith("image/")) {
        extension = fileType.split("/")[1];
      }

      // Map common MIME types to extensions
      const mimeToExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/svg+xml": "svg",
        "image/webp": "webp",
      };

      extension = mimeToExt[fileType] || extension;

      const { data } = await client.mutate<{
        generateBadgeUploadUrl: GenerateUploadUrlResponse;
      }>({
        mutation: GENERATE_BADGE_UPLOAD_URL,
        variables: {
          input: { fileType: extension },
        },
      });

      if (!data?.generateBadgeUploadUrl) {
        throw new Error("No upload URL generated");
      }

      return data.generateBadgeUploadUrl;
    } catch (error) {
      console.error("Error generating upload URL:", error);
      throw error;
    }
  },

  async uploadBadgeImage(
    file: File,
    uploadUrl: string
  ): Promise<void> {
    try {
      const response = await fetch(uploadUrl, {
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

      // Wait for CDN sync
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error uploading badge image:", error);
      throw error;
    }
  },

  async createBadge(input: CreateBadgeInput): Promise<Badge> {
    try {
      const { data } = await client.mutate<{
        createBadge: Badge;
      }>({
        mutation: CREATE_BADGE,
        variables: { input },
      });

      if (!data?.createBadge) {
        throw new Error("Failed to create badge");
      }

      return data.createBadge;
    } catch (error) {
      console.error("Error creating badge:", error);
      throw error;
    }
  },

  async getBadgeById(id: string): Promise<Badge> {
    try {
      const { data } = await client.query<{
        getBadgeId: Badge;
      }>({
        query: GET_BADGE_BY_ID,
        variables: { getBadgeIdId: id },
        fetchPolicy: "network-only",
      });

      if (!data?.getBadgeId) {
        throw new Error("Badge not found");
      }

      return data.getBadgeId;
    } catch (error) {
      console.error("Error fetching badge:", error);
      throw error;
    }
  },

  async updateBadge(id: string, input: UpdateBadgeInput): Promise<Badge> {
    try {
      const { data } = await client.mutate<{
        updateBadge: Badge;
      }>({
        mutation: UPDATE_BADGE,
        variables: { updateBadgeId: id, input },
      });

      if (!data?.updateBadge) {
        throw new Error("Failed to update badge");
      }

      return data.updateBadge;
    } catch (error) {
      console.error("Error updating badge:", error);
      throw error;
    }
  },
};
