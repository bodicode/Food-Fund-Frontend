import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeliveryTask } from "@/types/delivery-task";
import { format } from "date-fns";
import { translateDeliveryTaskStatus } from "@/lib/translator";

interface DeliveryTaskDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: DeliveryTask | null;
}

export function DeliveryTaskDetailDialog({
    open,
    onOpenChange,
    task,
}: DeliveryTaskDetailDialogProps) {
    if (!task) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh]">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-1">Trạng thái</h4>
                                <Badge>{translateDeliveryTaskStatus(task.status)}</Badge>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Người giao hàng</h4>
                                <p className="text-sm text-muted-foreground">
                                    {task.deliveryStaff.full_name}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Ngày tạo</h4>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(task.created_at), "dd/MM/yyyy HH:mm")}
                                </p>
                            </div>
                        </div>

                        {task.mealBatch && (
                            <div>
                                <h4 className="font-semibold mb-2">Thông tin suất ăn</h4>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm font-medium">{task.mealBatch.foodName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Số lượng: {task.mealBatch.quantity}
                                    </p>
                                </div>
                            </div>
                        )}

                        {task.statusLogs && task.statusLogs.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Lịch sử trạng thái</h4>
                                <div className="space-y-4">
                                    {task.statusLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex gap-4 border-l-2 border-primary pl-4 pb-4 last:pb-0"
                                        >
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-medium text-sm">Trạng thái: {translateDeliveryTaskStatus(log.status)}</p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm")}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Bởi: {log.user?.full_name || 'System'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
