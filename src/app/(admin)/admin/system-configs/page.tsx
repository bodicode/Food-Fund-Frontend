"use client";

import { useEffect, useState } from "react";
import { SystemConfig } from "@/types/api/system-config";
import { systemConfigService } from "@/services/system-config.service";
import { Loader } from "@/components/animate-ui/icons/loader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, RefreshCw, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/date-utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SystemConfigsPage() {
    const [configs, setConfigs] = useState<SystemConfig[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editedValue, setEditedValue] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    // Delete State
    const [deletingKey, setDeletingKey] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const data = await systemConfigService.getSystemConfigs();
            setConfigs(data);
        } catch (error) {
            console.error("Failed to fetch configs", error);
            toast.error("Không thể tải cấu hình");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const handleEditClick = (config: SystemConfig) => {
        setEditingConfig(config);
        setEditedValue(config.value);
        setEditedDescription(config.description);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (key: string) => {
        setDeletingKey(key);
        setIsDeleteDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingConfig) return;

        try {
            setIsUpdating(true);
            await systemConfigService.updateSystemConfig({
                key: editingConfig.key,
                value: editedValue,
                description: editedDescription,
                dataType: editingConfig.dataType
            });
            toast.success("Cập nhật cấu hình thành công");
            setIsEditDialogOpen(false);
            fetchConfigs();
        } catch (error) {
            console.error(error);
            toast.error("Cập nhật thất bại");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingKey) return;
        try {
            setIsDeleting(true);
            await systemConfigService.deleteSystemConfig(deletingKey);
            toast.success("Xóa cấu hình thành công");
            setIsDeleteDialogOpen(false);
            fetchConfigs();
        } catch (error) {
            console.error(error);
            toast.error("Xóa thất bại");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Cấu hình hệ thống
                </h1>
                <Button onClick={fetchConfigs} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Làm mới
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách cấu hình</CardTitle>
                    <CardDescription>
                        Quản lý các tham số cấu hình toàn hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-[#ad4e28]" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                                        <TableHead className="font-bold">Key</TableHead>
                                        <TableHead className="font-bold">Giá trị</TableHead>
                                        <TableHead className="font-bold">Mô tả</TableHead>
                                        <TableHead className="font-bold">Loại dữ liệu</TableHead>
                                        <TableHead className="font-bold">Cập nhật lần cuối</TableHead>
                                        <TableHead className="font-bold w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {configs.length > 0 ? (
                                        configs.map((config) => (
                                            <TableRow key={config.key}>
                                                <TableCell className="font-medium font-mono text-blue-600 dark:text-blue-400">
                                                    {config.key}
                                                </TableCell>
                                                <TableCell className="max-w-md truncate" title={config.value}>
                                                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                                        {config.value}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400">
                                                    {config.description}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{config.dataType}</Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500">
                                                    {formatDateTime(new Date(config.updatedAt))}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditClick(config)}>
                                                                <Edit2 className="mr-2 h-4 w-4" />
                                                                Chỉnh sửa
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteClick(config.key)} className="text-red-600 focus:text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Xóa
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                                Không có dữ liệu cấu hình
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa cấu hình</DialogTitle>
                        <DialogDescription>
                            Cập nhật giá trị cho {editingConfig?.key}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Key</Label>
                            <Input value={editingConfig?.key} disabled className="bg-gray-100" />
                        </div>
                        <div className="space-y-2">
                            <Label>Giá trị</Label>
                            <Input
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                placeholder="Nhập giá trị mới"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mô tả</Label>
                            <Input
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                placeholder="Nhập mô tả"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Loại dữ liệu</Label>
                            <Input value={editingConfig?.dataType} disabled className="bg-gray-100" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>Hủy</Button>
                        <Button onClick={handleUpdate} disabled={isUpdating}>
                            {isUpdating && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa cấu hình <strong>{deletingKey}</strong> khỏi hệ thống. Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
