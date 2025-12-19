"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCategories } from "../../../hooks/use-category";
import { CategoryStats } from "../../../types/api/category";
import { Loader } from "../../../components/animate-ui/icons/loader";
import {
  Utensils,
  HeartPulse,
  GraduationCap,
  Leaf,
  Baby,
  Accessibility,
  AlertCircle,
  Tag,
  Search,
  LayoutGrid,
  ArrowRight,
  TrendingUp,
  PawPrint
} from "lucide-react";

import { titleToSlug } from "../../../lib/utils/slug-utils";
import { Button } from "../../../components/ui/button";

// Icon mapping for categories
const getIconForCategory = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("thực phẩm") || t.includes("bữa ăn") || t.includes("cơm") || t.includes("ăn") || t.includes("food")) return Utensils;
  if (t.includes("y tế") || t.includes("sức khỏe") || t.includes("bệnh") || t.includes("health")) return HeartPulse;
  if (t.includes("giáo dục") || t.includes("học") || t.includes("trường") || t.includes("edu")) return GraduationCap;
  if (t.includes("môi trường") || t.includes("xanh") || t.includes("rừng") || t.includes("env")) return Leaf;
  if (t.includes("trẻ em") || t.includes("mồ côi") || t.includes("children")) return Baby;
  if (t.includes("người già") || t.includes("vượt khó") || t.includes("elderly")) return Accessibility;
  if (t.includes("động vật") || t.includes("animals") || t.includes("pet")) return PawPrint;
  if (t.includes("khẩn cấp") || t.includes("thiên tai") || t.includes("cứu trợ") || t.includes("relief")) return AlertCircle;
  return Tag;
};

export default function CampaignCategoriesPage() {
  const router = useRouter();
  const { categories, loading, error } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryClick = (category: { title: string }) => {
    const slug = titleToSlug(category.title);
    router.push(`/s?category=${slug}`);
  };

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fefcf8]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
              x: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#E77731]/5 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -10, 0],
              x: [0, -100, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 -right-24 w-[600px] h-[600px] bg-[#ad4e28]/5 rounded-full blur-[120px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.15]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-6">
              <LayoutGrid className="w-3.5 h-3.5" />
              Khám phá cộng đồng
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Duyệt theo <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">danh mục</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
              Tìm thấy sứ mệnh mà bạn quan tâm. Hỗ trợ hàng ngàn chiến dịch gây quỹ tác động trực tiếp đến cộng đồng của chúng ta.
            </p>


          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 pb-32">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center bg-red-50 border border-red-100 rounded-2xl p-8 max-w-lg mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Đã có lỗi xảy ra</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Thử lại</Button>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 grayscale brightness-125">
            <Loader animate animateOnView loop className="w-12 h-12 text-[#E77731]" />
            <p className="mt-4 text-gray-400 font-medium">Đang tải danh mục...</p>
          </div>
        ) : (
          <>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-xl text-gray-500 font-medium">Không tìm thấy danh mục phù hợp</p>
                <Button variant="link" onClick={() => setSearchQuery("")} className="text-[#E77731]">Xóa tìm kiếm</Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {filteredCategories.map((cat, idx) => {
                    const CategoryIcon = getIconForCategory(cat.title);
                    const campaignCount = (cat as CategoryStats).campaignCount || 0;

                    return (
                      <motion.div
                        layout
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        whileHover={{ y: -8 }}
                        className="group relative h-full flex flex-col rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md hover:shadow-[0_8px_30px_rgba(231,119,49,0.1)] hover:border-[#E77731]/30 transition-all cursor-pointer"
                        onClick={() => handleCategoryClick(cat)}
                      >
                        {/* Status/Badge */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fefcf8] to-[#fef7f0] border border-gray-100 group-hover:border-[#E77731]/20 group-hover:bg-[#E77731]/5 transition-all">
                            <CategoryIcon className="w-6 h-6 text-gray-700 group-hover:text-[#E77731] transition-colors" />
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider group-hover:bg-[#E77731]/10 group-hover:text-[#E77731] transition-all">
                            <TrendingUp className="w-3 h-3" />
                            <span>{campaignCount} Chiến dịch</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#E77731] transition-colors">
                            {cat.title}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                            {cat.description || "Khám phá các chiến dịch ý nghĩa trong danh mục này và góp sức lan tỏa yêu thương."}
                          </p>
                        </div>

                        {/* Footer Action */}
                        <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-widest">Xem thêm</span>
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#E77731] group-hover:text-white transition-all transform group-hover:translate-x-1">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
