"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "../../../../../store";
import { updateForm } from "../../../../../store/slices/campaign-form-slice";

import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { toast } from "sonner";
import RichTextEditor from "../../../../../components/shared/rich-text-editor";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PenTool,
  Lightbulb,
  Target,
  Heart,
  Sparkles,
  Info
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Loại", active: false },
  { id: 2, title: "Mục tiêu", active: false },
  { id: 3, title: "Media", active: false },
  { id: 4, title: "Câu chuyện", active: true },
  { id: 5, title: "Xem trước", active: false },
];

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

    router.push("/register/campaign/preview");
  };

  const handleBack = () => {
    dispatch(updateForm({ title, description: story }));
    router.push("/register/campaign/media");
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Step Indicator */}
        <div className="mb-14">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0" />
            {STEPS.map((step) => {
              const isActive = step.id === 4;
              const isCompleted = step.id < 4;
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
              className="space-y-4"
            >
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Viết câu chuyện của bạn</h1>
              <p className="text-gray-500 max-w-lg mx-auto font-medium leading-relaxed">
                Chia sẻ tâm huyết và lý do tại sao mọi người nên hỗ trợ chiến dịch của bạn.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Form */}
            <div className="lg:col-span-8 space-y-10">
              {/* Campaign Title Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <PenTool className="w-3.5 h-3.5 text-[#ad4e28]" />
                    Tiêu đề chiến dịch
                  </label>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${title.length > maxTitleLength - 10 ? "bg-red-50 text-red-400" : "bg-gray-50 text-gray-400"}`}>
                    {title.length}/{maxTitleLength}
                  </span>
                </div>
                <div className="relative group">
                  <Input
                    placeholder="Nhập tiêu đề ngắn gọn và ấn tượng..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={maxTitleLength}
                    className="h-14 text-lg font-bold px-6 rounded-2xl border-gray-100 bg-gray-50/30 group-hover:bg-white group-hover:border-[#ad4e28]/20 transition-all focus:border-[#ad4e28]/30 focus:bg-white focus:ring-0 shadow-sm"
                  />
                </div>
                <p className="text-[11px] text-gray-400 font-medium italic ml-1">
                  * Ví dụ: &quot;Bữa cơm ấm áp cho trẻ em vùng cao&quot;, &quot;Hỗ trợ lương thực sau bão&quot;
                </p>
              </motion.div>

              {/* Story Editor */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ad4e28]" />
                  Câu chuyện gây quỹ
                </label>
                <div className="rounded-3xl border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] overflow-hidden bg-white">
                  <RichTextEditor
                    value={story}
                    onChange={setStory}
                  />
                </div>
              </motion.div>
            </div>

            {/* Side Assistance */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-orange-50/50 rounded-3xl p-6 border border-orange-100/50 space-y-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#ad4e28] flex items-center justify-center text-white shadow-md">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-900">Gợi ý viết bài</h3>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-3 items-start group">
                    <Target className="w-4 h-4 text-[#ad4e28] mt-1 shrink-0 group-hover:rotate-12 transition-transform" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Mục đích rõ ràng</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Hãy cho họ biết bạn là ai và số tiền gây quỹ sẽ giúp ích trực tiếp cho ai.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start group">
                    <Heart className="w-4 h-4 text-[#ad4e28] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Chia sẻ chân thành</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Điều gì đã thôi thúc bạn thực hiện chiến dịch này? Cảm xúc thật sẽ kết nối mọi người.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start group">
                    <Info className="w-4 h-4 text-[#ad4e28] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Kế hoạch minh bạch</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Giải thích ngắn gọn cách bạn sẽ vận hành và sử dụng nguồn đóng góp.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-orange-100/50">
                  <p className="text-[10px] text-[#ad4e28] font-bold uppercase tracking-tight">Kinh nghiệm</p>
                  <p className="text-[11px] text-[#ad4e28]/70 mt-1 italic leading-relaxed">
                    Độ dài lý tưởng là từ 400 - 800 chữ để người đọc không bị quá tải.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-gray-50 gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="group h-12 px-6 rounded-2xl font-bold text-gray-400 hover:text-gray-900 transition-all w-full sm:w-auto"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!title.trim() || !story.trim()}
              className={`group min-w-[240px] h-14 text-lg font-bold rounded-2xl transition-all duration-300 w-full sm:w-auto ${!title.trim() || !story.trim()
                ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                : "btn-color shadow-xl shadow-orange-200/50 hover:-translate-y-1"
                }`}
            >
              Xem trước chiến dịch
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
