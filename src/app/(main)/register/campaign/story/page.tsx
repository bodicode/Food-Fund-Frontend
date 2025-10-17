"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateForm } from "@/store/slices/campaign-form-slice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import RichTextEditor from "@/components/shared/rich-text-editor";

export default function CreateCampaignStepStory() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.campaignForm);

  const [title, setTitle] = useState(form.title || "");
  const [story, setStory] = useState(form.description || "");
  const maxTitleLength = 60;

  useEffect(() => {
    if (form.title) setTitle(form.title);
    if (form.description) setStory(form.description);
  }, [form]);

  const handleNext = () => {
    if (!title.trim() || !story.trim()) {
      toast.warning("Vui lòng nhập đầy đủ tiêu đề và nội dung chiến dịch.");
      return;
    }

    dispatch(
      updateForm({
        title: title.trim(),
        description: story.trim(),
      })
    );

    toast.success("Lưu thành công!");
    router.push("/register/campaign/preview");
  };

  const handleBack = () => {
    dispatch(updateForm({ title, description: story }));
    router.push("/register/campaign/media");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12 lg:py-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start lg:divide-x lg:divide-gray-200">
          <div className="lg:col-span-1 lg:sticky lg:top-20 pr-8">
            <p className="text-sm text-gray-500 mb-3">Bước 4 / 5</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-snug">
              Kể cho nhà hảo tâm biết bạn <br /> đang gây quỹ vì điều gì
            </h1>
            <div className="text-gray-600 text-base space-y-3">
              <p>Một vài gợi ý để bạn bắt đầu viết:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Giới thiệu bạn và mục đích gây quỹ</li>
                <li>Tại sao điều này quan trọng với bạn</li>
                <li>Giải thích số tiền sẽ được sử dụng như thế nào</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 pl-8 space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tiêu đề chiến dịch
              </label>
              <div className="relative">
                <Input
                  placeholder="Chiến dịch giúp cho..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={maxTitleLength}
                  className="h-12 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {maxTitleLength - title.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Câu chuyện gây quỹ
              </label>
              <RichTextEditor
                value={story ? story.replace(/\n/g, "<br>") : ""}
                onChange={setStory}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                className="h-12 px-6"
                onClick={handleBack}
              >
                ← Quay lại
              </Button>

              <Button
                className={`h-12 px-8 text-base font-semibold ${
                  !title || !story
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-color text-white"
                }`}
                disabled={!title || !story}
                onClick={handleNext}
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
