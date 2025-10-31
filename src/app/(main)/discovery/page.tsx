"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/use-category";
import { Loader } from "@/components/animate-ui/icons/loader";

export default function CampaignCategoriesPage() {
  const router = useRouter();
  const { categories, loading, error } = useCategories();

  const handleCategoryClick = (categoryId: string) => {
    // Redirect to /s page with category filter
    router.push(`/s?category=${categoryId}`);
  };

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-left mb-12">
        <h1 className="text-5xl font-bold text-color mb-4">
          Danh mục chiến dịch
        </h1>
        <p className="text-muted-foreground text-lg">
          Khám phá các danh mục chiến dịch gây quỹ để hỗ trợ cộng đồng.
        </p>
      </div>

      {error && (
        <div className="text-center text-red-500 font-medium py-10">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader animate animateOnView loop className="w-5 h-5" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              className="rounded-xl border bg-white dark:bg-[#1e293b] p-6 shadow-sm hover:shadow-lg transition cursor-pointer group"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors h-12 flex items-center">
                {cat.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {cat.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
