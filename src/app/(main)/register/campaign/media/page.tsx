"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "../../../../../store";
import { updateForm } from "../../../../../store/slices/campaign-form-slice";
import { toast } from "sonner";

import { Button } from "../../../../../components/ui/button";
import { Upload, X, ChevronLeft, ChevronRight, Image as ImageIcon, Camera, CheckCircle2, AlertCircle } from "lucide-react";
import { Loader } from "../../../../../components/animate-ui/icons/loader";
import Image from "next/image";
import { uploadService } from "../../../../../services/upload.service";
import { buildCoverUrl } from "../../../../../lib/build-image";

const MAX_IMAGE_MB = 2;
const ACCEPTED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

const STEPS = [
  { id: 1, title: "Loại", active: false },
  { id: 2, title: "Mục tiêu", active: false },
  { id: 3, title: "Media", active: true },
  { id: 4, title: "Câu chuyện", active: false },
  { id: 5, title: "Xem trước", active: false },
];

export default function CreateCampaignStepMedia() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.campaignForm);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const coverFromRedux = useMemo(
    () => buildCoverUrl(form.coverImageFileKey),
    [form.coverImageFileKey]
  );

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const validateFile = (f: File): string | null => {
    const isImage = ACCEPTED_IMAGE.includes(f.type);
    const isVideo = ACCEPTED_VIDEO.includes(f.type);

    if (!isImage && !isVideo)
      return "Định dạng không hỗ trợ. Chỉ chấp nhận ảnh (jpg, png, webp, gif) hoặc video (mp4, webm, mov).";

    const sizeMB = f.size / (1024 * 1024);
    if (isImage && sizeMB > MAX_IMAGE_MB)
      return `Ảnh quá lớn. Tối đa ${MAX_IMAGE_MB}MB.`;

    return null;
  };

  const handleFileSelect = (f: File) => {
    const err = validateFile(f);
    if (err) {
      toast.error(err);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) handleFileSelect(uploadedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview("");
    setFile(null);
    dispatch(updateForm({ coverImageFileKey: "" }));
  };

  const handleNext = async () => {
    try {
      setUploading(true);

      if (!file && form.coverImageFileKey) {
        router.push("/register/campaign/story");
        return;
      }

      if (!file) {
        toast.error("Vui lòng chọn ảnh hoặc video bìa.");
        return;
      }

      const { fileKey, cdnUrl } = await uploadService.uploadCampaignCover(file);
      const imageUrl = cdnUrl || buildCoverUrl(fileKey);

      dispatch(updateForm({ coverImageFileKey: imageUrl }));
      toast.success("Tải ảnh bìa thành công!");
      router.push("/register/campaign/story");
    } catch (error) {
      console.error(error);
      toast.error("Tải ảnh thất bại. Vui lòng thử lại!");
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = preview || coverFromRedux;
  const hasPreview = !!displayUrl;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Step Indicator */}
        <div className="mb-14">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0" />
            {STEPS.map((step) => {
              const isActive = step.id === 3;
              const isCompleted = step.id < 3;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive
                      ? "bg-[#ad4e28] border-[#ad4e28] text-white shadow-lg scale-110"
                      : isCompleted
                        ? "bg-[#ad4e28] border-[#ad4e28] text-white"
                        : "bg-white border-gray-200 text-gray-300"
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-[13px] font-bold">{step.id}</span>}
                  </div>
                  <span className={`text-[11px] mt-2 font-bold uppercase tracking-wider ${isActive ? "text-[#ad4e28]" : "text-gray-400"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Ảnh bìa</h1>
              <p className="text-gray-500 max-w-lg mx-auto font-medium">
                Một bức ảnh rõ ràng và cảm xúc sẽ giúp chiến dịch của bạn tiếp cận nhiều người ủng hộ hơn.
              </p>
            </motion.div>
          </div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ảnh bìa chiến dịch</h2>
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#ad4e28] bg-orange-50 px-3 py-1 rounded-full">
                <AlertCircle className="w-3 h-3" />
                Tối đa {MAX_IMAGE_MB}MB
              </div>
            </div>

            <label
              htmlFor="coverUpload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center w-full aspect-[16/10] border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden group shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] ${isDragging
                ? "border-[#ad4e28] bg-orange-50/50 scale-[0.99]"
                : hasPreview
                  ? "border-transparent"
                  : "border-gray-100 bg-white hover:border-[#ad4e28]/20 hover:bg-gray-50/30"
                }`}
            >
              {!hasPreview ? (
                <div className="flex flex-col items-center px-8 text-center">
                  <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center transition-all duration-500 ${isDragging ? "bg-[#ad4e28] text-white scale-110" : "bg-orange-50 text-[#ad4e28] group-hover:scale-110"}`}>
                    {isDragging ? <Camera className="w-10 h-10 animate-bounce" /> : <Upload className="w-10 h-10" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Kéo thả hoặc nhấn để chọn ảnh</h3>
                  <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
                    Định dạng hỗ trợ: JPG, PNG, WEBP. Ảnh đẹp nhất khi có tỷ lệ 16:9 hoặc 16:10.
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full p-4">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      unoptimized
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      src={displayUrl}
                      alt="Preview ảnh bìa"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-20"
                    onClick={handleRemove}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 pointer-events-none">
                    Nhấn để thay đổi ảnh
                  </div>
                </div>
              )}

              <input
                id="coverUpload"
                type="file"
                accept={[...ACCEPTED_IMAGE, ...ACCEPTED_VIDEO].join(",")}
                className="hidden"
                onChange={handleUpload}
              />
            </label>

            <AnimatePresence>
              {hasPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-green-50/50 p-4 rounded-2xl border border-green-100/50"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-900">Ảnh bìa đã sẵn sàng</p>
                    <p className="text-[11px] text-green-700/70 font-medium">Bạn có thể tiếp tục sang bước tiếp theo</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-gray-50 gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.push("/register/campaign/goal")}
              className="group h-14 px-8 rounded-2xl font-bold text-gray-400 hover:text-gray-900 transition-all w-full sm:w-auto"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={uploading}
              className={`group min-w-[240px] h-14 text-lg font-bold rounded-2xl transition-all duration-300 w-full sm:w-auto ${uploading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "btn-color shadow-xl shadow-orange-200/50 hover:-translate-y-1"
                }`}
            >
              {uploading && <Loader className="animate-spin w-5 h-5 mr-3" />}
              {uploading ? "Đang xử lý..." : "Tiếp tục: Viết câu chuyện"}
              {!uploading && <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
