"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { campaignService } from "@/services/campaign.service";
import { CampaignPhase } from "@/types/api/phase";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { CreateIngredientRequestItemInput } from "@/types/api/ingredient-request";

interface CreateIngredientRequestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string;
    phases: CampaignPhase[];
    onSuccess?: () => void;
}

interface RequestItemState {
    ingredientName: string;
    quantity: string;
    estimatedCost: string; // Changed from estimatedUnitPrice to estimatedCost (Total for item)
    supplier: string;
}

export function CreateIngredientRequestDialog({
    isOpen,
    onClose,
    campaignId,
    phases,
    onSuccess,
}: CreateIngredientRequestDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [campaignPhaseId, setCampaignPhaseId] = useState("");
    const [items, setItems] = useState<RequestItemState[]>([
        {
            ingredientName: "",
            quantity: "",
            estimatedCost: "",
            supplier: "",
        },
    ]);

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            setCampaignPhaseId("");
            setItems([
                {
                    ingredientName: "",
                    quantity: "",
                    estimatedCost: "",
                    supplier: "",
                },
            ]);
        }
    }, [isOpen]);

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                ingredientName: "",
                quantity: "",
                estimatedCost: "",
                supplier: "",
            },
        ]);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length <= 1) return;
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleItemChange = (
        index: number,
        field: keyof RequestItemState,
        value: string
    ) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    // Calculate total cost
    const totalCost = items.reduce((sum, item) => {
        const cost = parseFloat(item.estimatedCost) || 0;
        return sum + cost;
    }, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!campaignPhaseId) {
            toast.error("Vui lòng chọn giai đoạn chiến dịch");
            return;
        }

        // Validate items
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.ingredientName.trim()) {
                toast.error(`Vui lòng nhập tên nguyên liệu cho mục #${i + 1}`);
                return;
            }
            if (!item.quantity.trim()) {
                toast.error(`Vui lòng nhập số lượng cho mục #${i + 1}`);
                return;
            }
        }

        try {
            setIsSubmitting(true);

            // Transform items to match API expectation
            const requestItems: CreateIngredientRequestItemInput[] = items.map((item) => {
                const qty = parseFloat(item.quantity) || 0;
                const total = parseFloat(item.estimatedCost) || 0;

                // Calculate unit price derived from total and quantity
                let unitPrice = 0;
                if (qty > 0) {
                    unitPrice = total / qty;
                } else {
                    unitPrice = total; // Fallback
                }

                return {
                    ingredientName: item.ingredientName.trim(),
                    quantity: item.quantity.trim(),
                    estimatedUnitPrice: unitPrice,
                    estimatedTotalPrice: total,
                    supplier: item.supplier.trim() || undefined,
                };
            });

            const totalRequestCost = requestItems.reduce(
                (sum, item) => sum + item.estimatedTotalPrice,
                0
            );

            const result = await campaignService.createIngredientRequest({
                campaignPhaseId,
                totalCost: String(totalRequestCost),
                items: requestItems,
            });

            if (!result) {
                throw new Error("Không thể tạo yêu cầu");
            }

            toast.success("Tạo yêu cầu mua nguyên liệu thành công");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Không thể tạo yêu cầu", {
                description: "Vui lòng thử lại sau",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle>Tạo yêu cầu mua nguyên liệu</DialogTitle>
                    <DialogDescription>
                        Tạo danh sách nguyên liệu cần mua cho giai đoạn chiến dịch
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto p-1">
                    <div className="space-y-2">
                        <Label>Giai đoạn chiến dịch <span className="text-red-500">*</span></Label>
                        <Select
                            value={campaignPhaseId}
                            onValueChange={setCampaignPhaseId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn giai đoạn" />
                            </SelectTrigger>
                            <SelectContent>
                                {phases.map((phase) => (
                                    <SelectItem key={phase.id} value={phase.id}>
                                        {phase.phaseName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Danh sách nguyên liệu</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddItem}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm nguyên liệu
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 gap-3 items-start p-4 bg-gray-50 rounded-lg relative group"
                            >
                                <div className="col-span-4 space-y-2">
                                    <Label className="text-xs">Tên nguyên liệu <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={item.ingredientName}
                                        onChange={(e) => handleItemChange(index, "ingredientName", e.target.value)}
                                        placeholder="VD: Gạo, Thịt..."
                                    />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label className="text-xs">Số lượng <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                        placeholder="VD: 10kg"
                                    />
                                </div>

                                <div className="col-span-3 space-y-2">
                                    <Label className="text-xs">Thành tiền dự kiến</Label>
                                    <Input
                                        type="number"
                                        value={item.estimatedCost}
                                        onChange={(e) => handleItemChange(index, "estimatedCost", e.target.value)}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="col-span-3 space-y-2">
                                    <Label className="text-xs">Nhà cung cấp</Label>
                                    <Input
                                        value={item.supplier}
                                        onChange={(e) => handleItemChange(index, "supplier", e.target.value)}
                                        placeholder="Tên cửa hàng..."
                                    />
                                </div>

                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <span className="font-medium text-blue-900">Tổng chi phí dự kiến:</span>
                        <span className="text-xl font-bold text-blue-700">
                            {formatCurrency(totalCost)}
                        </span>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-[#b55631] hover:bg-[#944322]">
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Tạo yêu cầu
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
