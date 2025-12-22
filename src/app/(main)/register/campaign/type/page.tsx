"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateForm } from "../../../../../store/slices/campaign-form-slice";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react";

import { Button } from "../../../../../components/ui/button";
import { useCategories } from "../../../../../hooks/use-category";

// Steps configuration
const steps = [
  { id: 1, title: "Loại", active: true },
  { id: 2, title: "Mục tiêu", active: false },
  { id: 3, title: "Câu chuyện", active: false },
  { id: 4, title: "Media", active: false },
  { id: 5, title: "Xem trước", active: false },
];

export default function CreateCampaignStepType() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { categories, loading, error } = useCategories();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNextStep = () => {
    if (!selected) return;
    dispatch(updateForm({ categoryId: selected }));
    router.push("/register/campaign/goal");
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step.id === 1
                    ? "bg-[#ad4e28] border-[#ad4e28] text-white shadow-lg scale-110"
                    : "bg-white border-gray-200 text-gray-400"
                    }`}
                >
                  {step.id < 1 ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-bold">{step.id}</span>}
                </div>
                <span className={`text-xs mt-2 font-medium ${step.id === 1 ? "text-[#ad4e28]" : "text-gray-400"}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-wider text-[#ad4e28] uppercase bg-orange-50 rounded-full">
              Bắt đầu hành trình
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
              Chọn loại chiến dịch của bạn
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hãy chọn danh mục phù hợp nhất để cộng đồng dễ dàng tìm thấy và ủng hộ chiến dịch của bạn.
            </p>
          </motion.div>

          <div className="space-y-10">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
                <div className="w-12 h-12 border-4 border-[#ad4e28]/20 border-t-[#ad4e28] rounded-full animate-spin mb-4"></div>
                <p className="font-medium animate-pulse">Đang tải danh mục...</p>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 text-red-600 bg-red-50 p-6 rounded-2xl border border-red-100"
              >
                <Info className="w-6 h-6 shrink-0" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {categories.map((cat, idx) => (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelected(cat.id)}
                      className={`relative overflow-hidden group p-8 rounded-3xl border-2 text-left transition-all duration-300 ${selected === cat.id
                        ? "border-[#ad4e28] bg-white shadow-xl ring-4 ring-[#ad4e28]/10"
                        : "border-gray-100 bg-white hover:border-[#ad4e28]/30 hover:shadow-lg"
                        }`}
                    >
                      {/* Selection Indicator */}
                      {selected === cat.id && (
                        <motion.div
                          layoutId="active-check"
                          className="absolute top-4 right-4 text-[#ad4e28]"
                        >
                          <CheckCircle2 className="w-6 h-6 fill-[#ad4e28] text-white" />
                        </motion.div>
                      )}

                      <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${selected === cat.id ? "text-[#ad4e28]" : "text-gray-900 group-hover:text-[#ad4e28]"
                        }`}>
                        {cat.title}
                      </h3>

                      {cat.description && (
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${selected === cat.id ? "text-gray-600" : "text-gray-500"
                          }`}>
                          {cat.description}
                        </p>
                      )}

                      {/* Subtle background decoration */}
                      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 transition-transform duration-500 ${selected === cat.id ? "bg-[#ad4e28] scale-150" : "bg-gray-100 group-hover:scale-110"
                        }`} />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center pt-8 border-t border-gray-100"
            >
              <Button
                size="lg"
                className={`group min-w-[240px] h-14 text-lg font-bold rounded-2xl transition-all duration-300 ${!selected
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                  : "btn-color shadow-lg hover:shadow-orange-200 hover:-translate-y-1"
                  }`}
                disabled={!selected}
                onClick={handleNextStep}
              >
                Tiếp tục
                <ChevronRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${selected ? "group-hover:translate-x-1" : ""}`} />
              </Button>
              {!selected && (
                <p className="mt-4 text-sm text-gray-500 font-medium">
                  Vui lòng chọn một danh mục để tiếp tục
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
