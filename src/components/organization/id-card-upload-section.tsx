"use client";

import React from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface IDCardUploadSectionProps {
  imagePreview: string | null;
  uploadedImage: File | null;
  isProcessingImage: boolean;
  loading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const IDCardUploadSection = React.memo(function IDCardUploadSection({
  imagePreview,
  uploadedImage,
  isProcessingImage,
  loading,
  onFileChange,
  onRemoveImage,
  fileInputRef,
}: IDCardUploadSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-700">
        Tải ảnh CCCD/CMND để tự động điền thông tin
        <span className="text-orange-600 font-normal ml-2">(Khuyến nghị)</span>
      </Label>

      {!imagePreview ? (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            disabled={loading || isProcessingImage}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-orange-300 hover:border-orange-400 rounded-xl p-8 text-center cursor-pointer transition-colors group bg-orange-50/50"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                <Camera className="w-10 h-10 text-orange-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">
                  Chụp ảnh hoặc tải lên CCCD/CMND
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Hệ thống sẽ tự động điền thông tin cho bạn
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 5MB</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="ID Card Preview"
                  width={128}
                  height={80}
                  className="w-32 h-20 object-cover rounded-lg border"
                />
                {isProcessingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {uploadedImage?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isProcessingImage
                        ? "Đang xử lý và điền thông tin..."
                        : "Đã xử lý thành công"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemoveImage}
                    disabled={isProcessingImage}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!imagePreview && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-blue-700 text-sm font-medium">
            📸 Vui lòng tải lên ảnh CCCD/CMND để bắt đầu điền thông tin
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Hệ thống sẽ tự động điền thông tin cơ bản từ CCCD/CMND của bạn
          </p>
        </div>
      )}
    </div>
  );
});
