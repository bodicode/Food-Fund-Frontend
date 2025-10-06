"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateForm } from "@/store/slices/campaign-form-slice";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Loader } from "@/components/animate-ui/icons/loader";
import Image from "next/image";
import { uploadService } from "@/services/upload.service";
import { buildCoverUrl } from "@/lib/build-image";

const MAX_IMAGE_MB = 2;
const ACCEPTED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

export default function CreateCampaignStepMedia() {
    const router = useRouter();
    const dispatch = useDispatch();
    const form = useSelector((state: RootState) => state.campaignForm);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [uploading, setUploading] = useState(false);

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

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleRemove = () => {
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
    const showVideo = displayUrl && /\.(mp4|webm|mov)$/i.test(displayUrl);

    return (
        <div className="min-h-screen pt-30 bg-gray-50">
            <div className="container mx-auto px-6 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start lg:divide-x lg:divide-gray-200">
                    {/* ===== LEFT ===== */}
                    <div className="lg:col-span-1 lg:sticky lg:top-20 pr-8">
                        <p className="text-sm text-gray-500 mb-3">Bước 3</p>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-snug">
                            Thêm ảnh bìa
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Một bức ảnh rõ ràng và sáng sẽ giúp mọi người kết nối với chiến
                            dịch của bạn nhanh hơn.
                        </p>
                    </div>

                    <div className="lg:col-span-2 pl-8">
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Upload ảnh bìa
                            </h2>

                            <label
                                htmlFor="coverUpload"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition bg-white"
                            >
                                {!hasPreview ? (
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                        <p className="text-gray-600">Kéo thả hoặc chọn ảnh</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Ảnh ≤ {MAX_IMAGE_MB}MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full p-3">
                                        <div className="relative w-full h-full rounded-md overflow-hidden">
                                            {showVideo ? (
                                                <video
                                                    className="h-full w-full object-cover"
                                                    src={displayUrl}
                                                    controls
                                                />
                                            ) : (
                                                <Image
                                                    unoptimized
                                                    width={500}
                                                    height={500}
                                                    className="h-full w-full object-cover"
                                                    src={displayUrl}
                                                    alt="Preview ảnh bìa"
                                                />
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white shadow hover:bg-gray-50"
                                            onClick={handleRemove}
                                        >
                                            <X className="w-5 h-5 text-gray-600" />
                                        </button>
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
                        </div>

                        <div className="flex items-center justify-between mt-10">
                            <Button
                                variant="outline"
                                className="h-12 px-6"
                                onClick={() => router.push("/register/campaign/goal")}
                            >
                                ← Quay lại
                            </Button>

                            <Button
                                onClick={handleNext}
                                disabled={uploading}
                                className={`h-12 px-8 text-base font-semibold flex items-center gap-2 ${uploading
                                    ? "bg-gray-300 text-gray-500"
                                    : "btn-color text-white"
                                    }`}
                            >
                                {uploading && <Loader className="animate-spin w-5 h-5" />}
                                {uploading ? "Đang tải..." : "Tiếp tục"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
