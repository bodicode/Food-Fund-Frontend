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
import { formatCurrency, parseCurrency } from "@/lib/utils/currency-utils";
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
    unit: string;
    estimatedUnitPrice: string; // Changed from estimatedCost to estimatedUnitPrice with currency formatting
    supplier: string;
    plannedIngredientId?: string;
}

export function CreateIngredientRequestDialog({
    isOpen,
    onClose,
    phases,
    onSuccess,
}: CreateIngredientRequestDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [campaignPhaseId, setCampaignPhaseId] = useState("");
    const [items, setItems] = useState<RequestItemState[]>([
        {
            ingredientName: "",
            quantity: "",
            unit: "",
            estimatedUnitPrice: "",
            supplier: "",
            plannedIngredientId: undefined, // Add this
        },
    ]);

    // Reset or populate form when dialog opens
    useEffect(() => {
        if (isOpen) {
            setCampaignPhaseId("");
            setItems([
                {
                    ingredientName: "",
                    quantity: "",
                    unit: "",
                    estimatedUnitPrice: "",
                    supplier: "",
                    plannedIngredientId: undefined,
                },
            ]);
        }
    }, [isOpen]);

    // Watch for campaignPhaseId changes to auto-fill items
    useEffect(() => {
        if (!campaignPhaseId) return;

        const selectedPhase = phases.find(p => p.id === campaignPhaseId);
        if (selectedPhase?.plannedIngredients && selectedPhase.plannedIngredients.length > 0) {
            // Check if user has already entered data to avoid overwriting (optional, but good UX)
            // For now, let's restart with the planned ingredients if the list is empty or has only one empty item
            const isInitialState = items.length === 1 &&
                !items[0].ingredientName &&
                !items[0].quantity &&
                !items[0].estimatedUnitPrice;

            if (isInitialState) {
                const plannedItems = selectedPhase.plannedIngredients.map(ing => ({
                    ingredientName: ing.name,
                    quantity: ing.quantity, // Assuming string format matches or is just number string
                    unit: ing.unit,
                    estimatedUnitPrice: "", // User still needs to enter this
                    supplier: "",
                    plannedIngredientId: ing.id,
                }));
                setItems(plannedItems);
            }
        }
    }, [campaignPhaseId, phases, items]);

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                ingredientName: "",
                quantity: "",
                unit: "",
                estimatedUnitPrice: "",
                supplier: "",
                plannedIngredientId: undefined,
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

        if (field === "estimatedUnitPrice") {
            // Remove non-digit chars
            const numericValue = parseCurrency(value);
            // Format for display
            const formattedValue = new Intl.NumberFormat("vi-VN").format(Number(numericValue));
            // Update with formatted value (or empty string if 0/empty)
            newItems[index] = { ...newItems[index], [field]: numericValue ? formattedValue : "" };
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }

        setItems(newItems);
    };

    // Calculate total cost
    const totalCost = items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const unitPrice = Number(parseCurrency(item.estimatedUnitPrice)) || 0;
        return sum + (qty * unitPrice);
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
            if (!item.unit.trim()) {
                toast.error(`Vui lòng nhập đơn vị tính cho mục #${i + 1}`);
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
                const unitPrice = Number(parseCurrency(item.estimatedUnitPrice)) || 0;
                const total = qty * unitPrice;

                return {
                    ingredientName: item.ingredientName.trim(),
                    quantity: item.quantity.trim(),
                    unit: item.unit.trim(),
                    estimatedUnitPrice: unitPrice,
                    estimatedTotalPrice: total,
                    supplier: item.supplier.trim() || undefined,
                    plannedIngredientId: item.plannedIngredientId,
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
            <DialogContent
                className="!min-w-[98vw] !w-[98vw] h-[90vh] flex flex-col overflow-hidden p-0 gap-0"
                onWheel={(e) => e.stopPropagation()}
            >
                <DialogHeader className="flex-shrink-0 px-8 pt-8 pb-4 border-b">
                    <DialogTitle className="text-xl font-bold">Tạo yêu cầu mua nguyên liệu</DialogTitle>
                    <DialogDescription>
                        Tạo danh sách nguyên liệu cần mua cho giai đoạn chiến dịch
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0">
                    <form id="create-ingredient-request-form" onSubmit={handleSubmit} className="p-8 space-y-6">
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
                            {campaignPhaseId && (() => {
                                const phase = phases.find(p => p.id === campaignPhaseId);
                                if (phase?.ingredientFundsAmount) {
                                    return (
                                        <p className="text-sm text-blue-600 font-medium mt-1">
                                            Ngân sách đã nhận: {formatCurrency(Number(phase.ingredientFundsAmount))}
                                        </p>
                                    );
                                }
                                return null;
                            })()}
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
                                        <Label className="text-xs">Đơn vị tính <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={item.unit}
                                            onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                            placeholder="VD: kg, lít"
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-xs">Số lượng <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                            placeholder="VD: 10"
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-xs">Đơn giá dự kiến</Label>
                                        <Input
                                            value={item.estimatedUnitPrice}
                                            onChange={(e) => handleItemChange(index, "estimatedUnitPrice", e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-2">
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

                    </form>
                </div>

                <div className="flex-shrink-0 px-8 py-4 border-t bg-gray-50/50">
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            form="create-ingredient-request-form"
                            disabled={isSubmitting}
                            className="bg-[#b55631] hover:bg-[#944322]"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Tạo yêu cầu
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
