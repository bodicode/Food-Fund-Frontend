"use client";

import client from "@/lib/apollo-client";
import { CREATE_INFLOW_TRANSACTION } from "@/graphql/mutations/transaction/create-inflow-transaction";
import { GENERATE_PROOF_UPLOAD_URL } from "@/graphql/mutations/transaction/generate-proof-upload-url";

type CreateInflowTransactionInput = {
  campaignPhaseId: string;
  operationRequestId?: string;
  ingredientRequestId?: string;
  amount: number;
  proof: string;
};

type CreateInflowTransactionResponse = {
  createInflowTransaction: {
    id: string;
    amount: string;
    status: string;
    transactionType: string;
    created_at: string;
    campaignPhaseId: string;
    operationRequestId?: string;
    ingredientRequestId?: string;
  };
};

type GenerateProofUploadUrlResponse = {
  generateProofUploadUrl: {
    success: boolean;
    message: string;
    uploadUrl: {
      uploadUrl: string;
      fileKey: string;
      cdnUrl?: string;
      expiresAt: string;
      fileType: string;
    };
    instructions?: string;
  };
};

// Helper: map MIME → extension
function toExtFromMime(mime: string) {
  const type = mime.toLowerCase();
  if (type.includes("pdf")) return "pdf";
  if (type.includes("jpeg") || type.includes("jpg")) return "jpeg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("doc")) return "doc";
  return "pdf";
}

// Optional delay (CDN sync delay)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const transactionService = {
  async generateProofUploadUrl(
    file: File,
    campaignPhaseId: string
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    try {
      const { data } = await client.mutate<GenerateProofUploadUrlResponse>({
        mutation: GENERATE_PROOF_UPLOAD_URL,
        variables: {
          input: {
            fileType: toExtFromMime(file.type),
            campaignPhaseId,
          },
        },
        fetchPolicy: "no-cache",
      });

      const payload = data?.generateProofUploadUrl?.uploadUrl;
      if (!payload?.uploadUrl || !payload?.fileKey) {
        throw new Error("Không lấy được uploadUrl hoặc fileKey từ server.");
      }

      const response = await fetch(payload.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/pdf",
          "x-amz-acl": "public-read",
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText} — ${errorText}`
        );
      }

      await sleep(1000);

      return { uploadUrl: payload.uploadUrl, fileKey: payload.fileKey };
    } catch (error) {
      throw error;
    }
  },

  async createInflowTransaction(
    input: CreateInflowTransactionInput
  ): Promise<CreateInflowTransactionResponse["createInflowTransaction"]> {
    try {
      const { data, error } = await client.mutate<CreateInflowTransactionResponse>({
        mutation: CREATE_INFLOW_TRANSACTION,
        variables: { input },
      });

      if (!data?.createInflowTransaction) {
        return Promise.reject(error);
      }

      return data.createInflowTransaction;
    } catch (error) {
      console.error("Error creating inflow transaction:", error);
      throw error;
    }
  },
};
