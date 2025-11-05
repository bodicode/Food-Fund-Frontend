"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateForm } from "@/store/slices/campaign-form-slice";


import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-category";

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
    <div className="min-h-screen bg-gray-50 pt-18">
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 mb-3">Bước 1</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-snug">
              Chọn loại chiến dịch với{" "}
              <strong className="text-color">FoodFund</strong>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Chọn danh mục phù hợp với chiến dịch gây quỹ của bạn
            </p>
          </div>

          <div className="space-y-8">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                <p>Đang tải danh mục...</p>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelected(cat.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg ${selected === cat.id
                      ? "border-[#ad4e28] bg-[#ad4e28] text-white shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{cat.title}</h3>
                    {cat.description && (
                      <p className={`text-sm ${selected === cat.id ? "text-white/80" : "text-gray-500"
                        }`}>
                        {cat.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="pt-8">
              <Button
                className={`w-full h-12 text-base font-semibold ${!selected
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "btn-color text-white"
                  }`}
                disabled={!selected}
                onClick={handleNextStep}
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
