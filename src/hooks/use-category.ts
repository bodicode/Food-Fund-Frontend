"use client";

import { useState, useEffect, useCallback } from "react";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/api/category";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getCategories();
            setCategories(data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Không thể tải danh mục.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        setCategories,
    };
}
