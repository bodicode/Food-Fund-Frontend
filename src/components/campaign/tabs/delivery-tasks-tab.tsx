"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { deliveryTaskService } from "@/services/delivery-task.service";
import { DeliveryTask, DeliveryTaskFilterInput } from "@/types/delivery-task";
import { DeliveryTaskDetailDialog } from "../dialogs/delivery-task-detail-dialog";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { translateDeliveryTaskStatus } from "@/lib/translator";

interface DeliveryTasksTabProps {
    campaignId?: string;
}

export function DeliveryTasksTab({ campaignId: propCampaignId }: DeliveryTasksTabProps) {
    const params = useParams();
    // Prioritize prop, fallback to param (though param might be slug, so prop is preferred)
    const campaignId = propCampaignId || params.id as string;

    const [tasks, setTasks] = useState<DeliveryTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<DeliveryTask | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // Filters state (simplified for now as per requirements, mainly campaignId)
    const [filters, setFilters] = useState<DeliveryTaskFilterInput>({
        campaignId: campaignId,
        limit: 10,
        offset: 0,
    });

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await deliveryTaskService.getDeliveryTasks(filters);
            setTasks(data);
        } catch (error) {
            toast.error("Lỗi", {
                description: "Không thể tải danh sách đơn giao hàng",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (campaignId) {
            setFilters(prev => ({ ...prev, campaignId }));
        }
    }, [campaignId]);

    useEffect(() => {
        fetchTasks();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [filters]);

    const handleViewDetail = async (taskId: string) => {
        try {
            const task = await deliveryTaskService.getDeliveryTaskById(taskId);
            setSelectedTask(task);
            setDetailOpen(true);
        } catch (error) {
            toast.error("Lỗi", {
                description: "Không thể xem chi tiết đơn hàng",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Danh sách đơn giao hàng</h3>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Người giao</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            ) : tasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Chưa có đơn giao hàng nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.deliveryStaff.full_name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{translateDeliveryTaskStatus(task.status)}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(task.created_at), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleViewDetail(task.id)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <DeliveryTaskDetailDialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                task={selectedTask}
            />
        </div>
    );
}
