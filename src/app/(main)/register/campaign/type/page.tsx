"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateForm } from "@/store/slices/campaign-form-slice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-category";

interface District {
    code: number;
    name: string;
}

export default function CreateCampaignStepType() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { categories, loading, error } = useCategories();
    const [selected, setSelected] = useState<string | null>(null);
    const [districts, setDistricts] = useState<District[]>([]);
    const [district, setDistrict] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    useEffect(() => {
        async function fetchDistricts() {
            try {
                const res = await fetch("https://provinces.open-api.vn/api/p/79?depth=2");
                const data = await res.json();
                setDistricts(data.districts || []);
            } catch (err) {
                console.error("Error fetching districts:", err);
            }
        }
        fetchDistricts();
    }, []);

    const handleNextStep = () => {
        if (!selected || !district || !address) return;

        const fullLocation = `${address}, ${district}, Thành phố Hồ Chí Minh`;

        dispatch(
            updateForm({
                categoryId: selected,
                location: fullLocation,
            })
        );

        router.push("/register/campaign/goal");
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            <div className="container mx-auto px-6 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start lg:divide-x lg:divide-gray-200">
                    <div className="lg:col-span-1 lg:sticky lg:top-20 pr-8">
                        <p className="text-sm text-gray-500 mb-3">Bước 1</p>
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-snug">
                            Bắt đầu hành trình gây quỹ cùng{" "}
                            <strong className="text-color">FoodFund</strong>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Chúng tôi sẽ đồng hành cùng bạn trong từng bước để tạo chiến dịch
                            gây quỹ hiệu quả.
                        </p>
                    </div>

                    <div className="lg:col-span-2 space-y-10 pl-8">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-color">
                                Địa điểm bạn mong muốn để làm thiện nguyện?
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Thành phố
                                    </label>
                                    <Input
                                        value="Thành phố Hồ Chí Minh"
                                        disabled
                                        className="h-9"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Quận / Huyện
                                    </label>
                                    <Select value={district} onValueChange={setDistrict}>
                                        <SelectTrigger className="w-full h-16">
                                            <SelectValue placeholder="Chọn quận / huyện" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {districts.map((d) => (
                                                <SelectItem key={d.code} value={d.name}>
                                                    {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Địa chỉ cụ thể
                                </label>
                                <Input
                                    placeholder="Nhập địa chỉ cụ thể (VD: 123 Lý Thường Kiệt, Phường 7)"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-color">
                                Chọn một loại chiến dịch để bắt đầu ngay!
                            </h2>

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
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
                                <div className="flex flex-wrap gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelected(cat.id)}
                                            className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-200 ${selected === cat.id
                                                ? "btn-color text-white shadow-md scale-105"
                                                : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                                }`}
                                        >
                                            {cat.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                className={`w-full h-12 text-base font-semibold ${!selected || !district || !address
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "btn-color text-white"
                                    }`}
                                disabled={!selected || !district || !address}
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
