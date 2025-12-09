"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { transactionService } from "@/services/transaction.service";
import { Loader } from "@/components/animate-ui/icons/loader";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { FileText } from "lucide-react";

interface CreateDisbursementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  requestType: "operation" | "ingredient";
  amount: string;
  campaignPhaseId?: string;
  onSuccess: () => void;
}

export function CreateDisbursementDialog({
  isOpen,
  onClose,
  requestId,
  requestType,
  amount,
  campaignPhaseId,
  onSuccess,
}: CreateDisbursementDialogProps) {
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proofFile) {
      toast.error("Vui lòng chọn file hóa đơn");
      return;
    }

    if (!campaignPhaseId) {
      toast.error("Không tìm thấy ID giai đoạn chiến dịch");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload proof file first
      const { fileKey } = await transactionService.generateProofUploadUrl(
        proofFile,
        campaignPhaseId
      );

      // 2. Create transaction with the uploaded file key
      await transactionService.createInflowTransaction({
        campaignPhaseId,
        operationRequestId:
          requestType === "operation" ? requestId : undefined,
        ingredientRequestId:
          requestType === "ingredient" ? requestId : undefined,
        amount: parseFloat(amount),
        proof: fileKey,
      });

      toast.success("Tạo giải ngân thành công!");
      setProofFile(null);
      setPreview("");
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo giải ngân";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setProofFile(null);
    setPreview("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo giải ngân</DialogTitle>
          <DialogDescription>
            Tạo yêu cầu giải ngân cho{" "}
            {requestType === "operation" ? "yêu cầu giải ngân" : "yêu cầu nguyên liệu"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Display */}
          <div className="space-y-2">
            <Label>Số tiền giải ngân</Label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(parseFloat(amount))}
              </p>
            </div>
          </div>

          {/* Proof Upload */}
          <div className="space-y-2">
            <Label htmlFor="proof">Upload hóa đơn giải ngân (PDF, JPG, PNG, DOC)</Label>
            <div className="flex gap-2">
              <Input
                id="proof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
            {proofFile && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  <FileText className="inline h-3 w-3 mr-1" />
                  {proofFile.name}
                </p>
                {preview && (
                  <div className="border rounded-lg overflow-hidden bg-gray-50 p-3">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={400}
                      height={320}
                      className="max-h-80 max-w-full mx-auto object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || !proofFile}
              className="btn-color"
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Tạo giải ngân"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
