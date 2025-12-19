"use client";

import { useEffect, useState } from "react";
import { mealBatchService } from "../../services/meal-batch.service";
import { organizationService } from "../../services/organization.service";
import { MealBatch, DeliveryTask } from "../../types/api/meal-batch";
import { OrganizationMember, OrganizationMembership } from "../../types/api/organization";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Loader } from "../animate-ui/icons/loader";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDateTime } from "../../lib/utils/date-utils";

interface DeliveryTaskAssignmentTabProps {
    campaignId: string;
}

export function DeliveryTaskAssignmentTab({ campaignId }: DeliveryTaskAssignmentTabProps) {
    const [assignedTasks, setAssignedTasks] = useState<DeliveryTask[]>([]);
    const [mealBatches, setMealBatches] = useState<MealBatch[]>([]);
    const [deliveryStaff, setDeliveryStaff] = useState<OrganizationMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMealBatchId, setSelectedMealBatchId] = useState<string>("");
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const fetchAssignedTasks = async () => {
        try {
            const tasks = await mealBatchService.getDeliveryTasks({
                filter: { campaignId }
            });
            setAssignedTasks(tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [batches, org, tasks] = await Promise.all([
                    mealBatchService.getMealBatches({ filter: { campaignId } }),
                    organizationService.getMyOrganization(),
                    mealBatchService.getDeliveryTasks({ filter: { campaignId } }),
                ]);

                setMealBatches(batches);
                setAssignedTasks(tasks);

                if (org && org.members) {
                    // Filter for active delivery staff
                    const staff = org.members
                        .filter(
                            (m: OrganizationMembership) =>
                                m.member_role === "DELIVERY_STAFF" &&
                                (m.status === "APPROVED" || m.status === "VERIFIED") &&
                                m.member.is_active
                        )
                        .map((m: OrganizationMembership) => m.member);
                    setDeliveryStaff(staff);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Không thể tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [campaignId]);

    const handleStaffToggle = (staffId: string) => {
        setSelectedStaffIds((prev) =>
            prev.includes(staffId)
                ? prev.filter((id) => id !== staffId)
                : [...prev, staffId]
        );
    };

    const handleSubmit = async () => {
        if (!selectedMealBatchId || selectedStaffIds.length === 0) {
            toast.error("Vui lòng chọn suất ăn và nhân viên giao hàng.");
            return;
        }

        try {
            setSubmitting(true);
            await mealBatchService.assignDeliveryTaskToStaff({
                mealBatchId: selectedMealBatchId,
                deliveryStaffIds: selectedStaffIds,
            });
            toast.success("Giao việc thành công!");
            // Reset selection
            setSelectedMealBatchId("");
            setSelectedStaffIds([]);
            // Refresh tasks list
            fetchAssignedTasks();
        } catch (error) {
            console.error("Error assigning task:", error);
            toast.error("Giao việc thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader animate loop className="w-8 h-8 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border p-6 space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-6">Giao việc cho nhân viên</h3>

                <div className="space-y-6">
                    {/* Meal Batch Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn lô suất ăn
                        </label>
                        <Select value={selectedMealBatchId} onValueChange={setSelectedMealBatchId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn lô suất ăn..." />
                            </SelectTrigger>
                            <SelectContent>
                                {mealBatches.filter(b => b.status === "READY" || b.status === "PREPARING").length > 0 ? (
                                    mealBatches
                                        .filter(b => b.status === "READY" || b.status === "PREPARING")
                                        .map((batch) => (
                                            <SelectItem
                                                key={batch.id}
                                                value={batch.id}
                                                disabled={batch.status === "PREPARING"}
                                            >
                                                {batch.foodName} - SL: {batch.quantity} - {formatDateTime(batch.cookedDate)}
                                                {batch.status === "PREPARING" && " (Đang chuẩn bị)"}
                                                {batch.status === "READY" && " (Sẵn sàng)"}
                                            </SelectItem>
                                        ))
                                ) : (
                                    <div className="p-2 text-sm text-gray-500 text-center">
                                        Không có lô suất ăn nào khả dụng.
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Staff Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn nhân viên
                        </label>
                        {deliveryStaff.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-lg p-4 max-h-[300px] overflow-y-auto">
                                {deliveryStaff.map((staff) => (
                                    <div
                                        key={staff.id}
                                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedStaffIds.includes(staff.cognito_id || staff.id)
                                            ? "bg-blue-50 border-blue-200"
                                            : "hover:bg-gray-50 border-gray-100"
                                            }`}
                                        onClick={() => handleStaffToggle(staff.cognito_id || staff.id)}
                                    >
                                        <Checkbox
                                            checked={selectedStaffIds.includes(staff.cognito_id || staff.id)}
                                            onCheckedChange={() => handleStaffToggle(staff.cognito_id || staff.id)}
                                            id={`staff-${staff.cognito_id || staff.id}`}
                                        />
                                        <div className="flex items-center gap-3 flex-1">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={staff.avatar_url} alt={staff.full_name} />
                                                <AvatarFallback>{staff.full_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">{staff.full_name}</p>
                                                <p className="text-gray-500 text-xs">{staff.phone_number || "Chưa cập nhật SĐT"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic border rounded-lg p-4 text-center">
                                Không có nhân viên vận chuyển nào trong tổ chức.
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || !selectedMealBatchId || selectedStaffIds.length === 0}
                            className="btn-color min-w-[120px]"
                        >
                            {submitting ? <Loader animate loop className="w-4 h-4 mr-2" /> : null}
                            Giao việc
                        </Button>
                    </div>
                </div>
            </div>

            {/* Configured Tasks List */}
            <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-6">Danh sách phân công ({assignedTasks.length})</h3>

                {assignedTasks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                <tr>
                                    <th className="px-4 py-3">Nhân viên</th>
                                    <th className="px-4 py-3">Món ăn</th>
                                    <th className="px-4 py-3">Số lượng</th>
                                    <th className="px-4 py-3">Ngày nấu</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                    <th className="px-4 py-3 text-right">Ngày giao</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {assignedTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">
                                            {task.deliveryStaff?.full_name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {task.mealBatch?.foodName || "N/A"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {task.mealBatch?.quantity || 0}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {task.mealBatch?.cookedDate ? formatDateTime(task.mealBatch.cookedDate) : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {(() => {
                                                const translateStatus = (status: string) => {
                                                    switch (status) {
                                                        case "PENDING": return "Chờ xác nhận";
                                                        case "ACCEPTED": return "Đã tiếp nhận";
                                                        case "REJECTED": return "Đã từ chối";
                                                        case "OUT_FOR_DELIVERY": return "Đang giao hàng";
                                                        case "COMPLETED": return "Hoàn thành";
                                                        case "FAILED": return "Thất bại";
                                                        default: return status;
                                                    }
                                                };

                                                const getStatusColor = (status: string) => {
                                                    switch (status) {
                                                        case "PENDING": return "bg-gray-100 text-gray-700 border-gray-200";
                                                        case "ACCEPTED": return "bg-blue-100 text-blue-800 border-blue-200";
                                                        case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
                                                        case "OUT_FOR_DELIVERY": return "bg-amber-100 text-amber-800 border-amber-200";
                                                        case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
                                                        case "FAILED": return "bg-rose-100 text-rose-800 border-rose-200";
                                                        default: return "bg-gray-100 text-gray-800 border-gray-200";
                                                    }
                                                };

                                                return (
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                                                        {translateStatus(task.status)}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-500">
                                            {formatDateTime(task.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                        Chưa có nhiệm vụ giao hàng nào được tạo.
                    </div>
                )}
            </div>
        </div>
    );
}
