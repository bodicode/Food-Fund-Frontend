"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mealBatchService } from "@/services/meal-batch.service";
import { MealBatch } from "@/types/api/meal-batch";
import { formatDateTime } from "@/lib/utils/date-utils";
import { translateStatus, getStatusColorClass } from "@/lib/utils/status-utils";
import {
  UtensilsCrossed,
  Calendar,
  User,
  Package,
  ShoppingBasket,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Loader } from "@/components/animate-ui/icons/loader";
import Image from "next/image";

interface MealBatchDetailDialogProps {
  mealBatchId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MealBatchDetailDialog({
  mealBatchId,
  open,
  onOpenChange,
}: MealBatchDetailDialogProps) {
  const [mealBatch, setMealBatch] = useState<MealBatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  useEffect(() => {
    if (open && mealBatchId) {
      fetchMealBatch();
    }
  }, [open, mealBatchId]);

  const fetchMealBatch = async () => {
    setLoading(true);
    try {
      const data = await mealBatchService.getMealBatch(mealBatchId);
      setMealBatch(data);
    } catch (error) {
      console.error("Error fetching meal batch:", error);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  const openLightbox = (index: number) => {
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
  };

  const nextMedia = useCallback(() => {
    if (mealBatch?.media) {
      setCurrentMediaIndex((prev) => (prev + 1) % mealBatch.media!.length);
    }
  }, [mealBatch?.media]);

  const prevMedia = useCallback(() => {
    if (mealBatch?.media) {
      setCurrentMediaIndex(
        (prev) => (prev - 1 + mealBatch.media!.length) % mealBatch.media!.length
      );
    }
  }, [mealBatch?.media]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        prevMedia();
      } else if (e.key === "ArrowRight") {
        nextMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextMedia, prevMedia]);

  const getStatusBadge = (status: string) => {
    const label = translateStatus(status);
    const colorClass = getStatusColorClass(status);

    return (
      <Badge className={`${colorClass} flex items-center gap-1 border`}>
        {label}
      </Badge>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} modal>
        <DialogContent
          className="max-w-3xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Header cố định */}
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UtensilsCrossed className="w-6 h-6 text-[#E77731]" />
              Chi tiết món ăn
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-[#E77731]" />
            </div>
          ) : !mealBatch ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không thể tải thông tin</p>
            </div>
          ) : (
            <>
              {/* Body có scroll nội bộ */}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-6 overscroll-contain">
                {/* Header Info */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tên món ăn</p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {mealBatch.foodName}
                      </h3>
                    </div>
                    {getStatusBadge(mealBatch.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Số lượng</p>
                      <p className="text-2xl font-bold text-[#E77731]">
                        {mealBatch.quantity} suất
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngày nấu</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateTime(mealBatch.cookedDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kitchen Staff Info */}
                <div className="bg-white rounded-xl border p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Người nấu</p>
                      <p className="font-bold text-gray-900">
                        {mealBatch.kitchenStaff.full_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ingredient Usages */}
                {mealBatch.ingredientUsages &&
                  mealBatch.ingredientUsages.length > 0 && (
                    <div className="bg-white rounded-xl border p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingBasket className="w-5 h-5 text-[#E77731]" />
                        <h3 className="font-bold text-gray-900 text-lg">
                          Nguyên liệu sử dụng ({mealBatch.ingredientUsages.length})
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {mealBatch.ingredientUsages.map((usage, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {usage.ingredientItem.ingredientName}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-[#E77731]">
                              {usage.ingredientItem.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Media Gallery */}
                {mealBatch.media && mealBatch.media.length > 0 && (
                  <div className="bg-white rounded-xl border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-5 h-5 text-[#E77731]" />
                      <h3 className="font-bold text-gray-900 text-lg">
                        Hình ảnh & Video ({mealBatch.media.length})
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mealBatch.media.map((url, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border group cursor-pointer"
                          onClick={() => openLightbox(index)}
                        >
                          {isVideo(url) ? (
                            <video
                              src={url}
                              className="w-full h-full object-cover"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <Image
                              src={url}
                              alt={`${mealBatch.foodName} - ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Thông tin thời gian
                      </p>
                      <p className="text-sm text-blue-700">
                        Món ăn được nấu vào {formatDateTime(mealBatch.cookedDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer cố định */}
              <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t bg-white dark:bg-zinc-900">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full"
                >
                  Đóng
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox Dialog */}
      {mealBatch?.media && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            className="!max-w-[98vw] !w-[98vw] !h-[98vh] p-0 bg-black/95 border-none"
            showCloseButton={false}
          >
            <DialogTitle className="sr-only">Media Gallery</DialogTitle>

            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {mealBatch.media.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Media Display */}
            <div className="relative w-full h-full flex items-center justify-center px-4 py-20">
              {isVideo(mealBatch.media[currentMediaIndex]) ? (
                <video
                  src={mealBatch.media[currentMediaIndex]}
                  key={currentMediaIndex}
                  className="max-w-[90vw] max-h-[80vh] w-auto h-auto"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="relative w-full h-full max-w-[90vw] max-h-[80vh]">
                  <Image
                    src={mealBatch.media[currentMediaIndex]}
                    alt={`${mealBatch.foodName} - ${currentMediaIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Counter */}
            {mealBatch.media.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
                {currentMediaIndex + 1} / {mealBatch.media.length}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
