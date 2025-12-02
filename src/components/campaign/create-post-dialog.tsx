"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { postService } from "@/services/post.service";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  onSuccess?: () => void;
}

export function CreatePostDialog({
  isOpen,
  onClose,
  campaignId,
  onSuccess,
}: CreatePostDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Ngăn scroll body khi dialog mở
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (files.length + selectedFiles.length > 5) {
      toast.error("Chỉ được tải lên tối đa 5 file (ảnh/video)");
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast.error(`${file.name} không phải là file ảnh hoặc video`);
        return false;
      }

      // Optional: Check file size for videos if needed (e.g. max 50MB)
      if (isVideo && file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} quá lớn (tối đa 50MB)`);
        return false;
      }

      return true;
    });

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setFiles([...files, ...validFiles]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết");
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    setIsSubmitting(true);

    try {
      let mediaFileKeys: string[] = [];

      if (files.length > 0) {
        toast.info("Đang tải media lên...");
        mediaFileKeys = await postService.uploadPostMedia(files);
      }

      toast.info("Đang tạo bài viết...");
      await postService.createPost({
        campaignId,
        title: title.trim(),
        content: content.trim(),
        mediaFileKeys: mediaFileKeys.length > 0 ? mediaFileKeys : undefined,
      });

      toast.success("Tạo bài viết thành công!");

      // Reset form
      setTitle("");
      setContent("");
      setFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo bài viết"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setTitle("");
    setContent("");
    setFiles([]);
    setPreviewUrls([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal>
      <DialogContent
        className="max-w-3xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        onWheel={(e) => e.stopPropagation()} // ✅ chặn scroll bubble ra body
      >
        {/* Header cố định */}
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle>Tạo bài viết mới</DialogTitle>
          <DialogDescription>
            Chia sẻ cập nhật về chiến dịch của bạn
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Body có scroll nội bộ */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4 overscroll-contain">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề bài viết..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>
              Nội dung <span className="text-red-500">*</span>
            </Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Upload ảnh/video */}
          <div className="space-y-2 pb-4">
            <Label>Hình ảnh/Video (Tối đa 5 file)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isSubmitting || files.length >= 5}
              >
                <Upload className="w-4 h-4 mr-2" />
                Chọn ảnh/video
              </Button>
              <span className="text-sm text-gray-500">{files.length}/5 file</span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => {
                  const file = files[index];
                  const isVideo = file?.type.startsWith("video/");

                  return (
                    <div key={index} className="relative group">
                      {isVideo ? (
                        <video
                          src={url}
                          className="w-full h-32 object-cover rounded-lg border bg-black"
                          controls
                        />
                      ) : (
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer cố định */}
        <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 border-t bg-white dark:bg-zinc-900">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isSubmitting ? "Đang tạo..." : "Tạo bài viết"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
