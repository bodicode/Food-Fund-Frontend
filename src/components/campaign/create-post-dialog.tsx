"use client";

import { useState } from "react";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Limit to 5 images
    if (files.length + selectedFiles.length > 5) {
      toast.error("Chỉ được tải lên tối đa 5 ảnh");
      return;
    }

    // Validate file types
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} không phải là file ảnh`);
        return false;
      }
      return true;
    });

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    setFiles([...files, ...validFiles]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const handleRemoveFile = (index: number) => {
    // Revoke the preview URL to free memory
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

      // Upload media files if any
      if (files.length > 0) {
        toast.info("Đang tải ảnh lên...");
        mediaFileKeys = await postService.uploadPostMedia(files);
      }

      // Create post
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

    // Clean up preview URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    setTitle("");
    setContent("");
    setFiles([]);
    setPreviewUrls([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
          <DialogDescription>
            Chia sẻ cập nhật về chiến dịch của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

          {/* Media Upload */}
          <div className="space-y-2">
            <Label>Hình ảnh (Tối đa 5 ảnh)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isSubmitting || files.length >= 5}
              >
                <Upload className="w-4 h-4 mr-2" />
                Chọn ảnh
              </Button>
              <span className="text-sm text-gray-500">
                {files.length}/5 ảnh
              </span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSubmitting ? "Đang tạo..." : "Tạo bài viết"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
