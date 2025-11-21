"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { badgeService } from "@/services/badge.service";
import { Badge as BadgeType } from "@/types/api/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/date-utils";
import { Award, Search, RefreshCw, Plus, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BadgesPage() {
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon_url: "",
    is_active: false,
    sort_order: 0,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const data = await badgeService.getAllBadges();
      setBadges(data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách huy hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) {
      return badges;
    }

    const query = searchQuery.toLowerCase();
    return badges.filter(
      (badge) =>
        badge.name.toLowerCase().includes(query) ||
        badge.description.toLowerCase().includes(query)
    );
  }, [badges, searchQuery]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchBadges();
      toast.success("Đã làm mới danh sách");
    } finally {
      setRefreshing(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBadge = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên huy hiệu");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh huy hiệu");
      return;
    }

    let iconUrl = "";

    // Upload image
    try {
      setIsUploading(true);
      const uploadResponse = await badgeService.generateUploadUrl(
        selectedFile.type
      );

      if (!uploadResponse.uploadUrl) {
        throw new Error("Failed to generate upload URL");
      }

      await badgeService.uploadBadgeImage(
        selectedFile,
        uploadResponse.uploadUrl.uploadUrl
      );

      iconUrl = uploadResponse.uploadUrl.cdnUrl;
    } catch (error) {
      toast.error("Lỗi khi upload ảnh");
      console.error(error);
      return;
    } finally {
      setIsUploading(false);
    }

    try {
      setIsCreating(true);
      const newBadge = await badgeService.createBadge({
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon_url: iconUrl,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      });

      setBadges([...badges, newBadge]);
      toast.success("Tạo huy hiệu thành công");
      setCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Lỗi khi tạo huy hiệu");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon_url: "",
      is_active: false,
      sort_order: 0,
    });
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditBadge = (badge: BadgeType) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      description: badge.description,
      icon_url: badge.icon_url,
      is_active: badge.is_active,
      sort_order: badge.sort_order,
    });
    setImagePreview(badge.icon_url);
    setEditDialogOpen(true);
  };

  const handleUpdateBadge = async () => {
    if (!editingBadge) return;

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên huy hiệu");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    let iconUrl = formData.icon_url;

    // Upload image if selected
    if (selectedFile) {
      try {
        setIsUploading(true);
        const uploadResponse = await badgeService.generateUploadUrl(
          selectedFile.type
        );

        if (!uploadResponse.uploadUrl) {
          throw new Error("Failed to generate upload URL");
        }

        await badgeService.uploadBadgeImage(
          selectedFile,
          uploadResponse.uploadUrl.uploadUrl
        );

        iconUrl = uploadResponse.uploadUrl.cdnUrl;
      } catch (error) {
        toast.error("Lỗi khi upload ảnh");
        console.error(error);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    try {
      setIsUpdating(true);
      const updatedBadge = await badgeService.updateBadge(editingBadge.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon_url: iconUrl,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      });

      setBadges(badges.map((b) => (b.id === editingBadge.id ? updatedBadge : b)));
      toast.success("Cập nhật huy hiệu thành công");
      setEditDialogOpen(false);
      resetForm();
      setEditingBadge(null);
    } catch (error) {
      toast.error("Lỗi khi cập nhật huy hiệu");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="h-6 w-6 animate-spin text-[#ad4e28]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-18">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Quản lý Huy hiệu
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm huy hiệu..."
              className="pl-9 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            onClick={onRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={cn("w-4 h-4", refreshing && "animate-spin")}
            />
            Làm mới
          </Button>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tạo huy hiệu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Tạo huy hiệu mới
                </DialogTitle>
                <DialogDescription>
                  Thêm một huy hiệu mới vào hệ thống
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Tên huy hiệu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: Nhà tài trợ vàng"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Mô tả <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả về huy hiệu này"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="min-h-20"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Ảnh huy hiệu
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative w-full">
                      <div className="relative w-24 h-24 mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn ảnh
                    </Button>
                  )}
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                  <Label htmlFor="sort_order" className="text-sm font-medium">
                    Thứ tự sắp xếp
                  </Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sort_order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                {/* Is Active */}
                <div className="space-y-2">
                  <Label htmlFor="is_active" className="text-sm font-medium">
                    Trạng thái
                  </Label>
                  <Select
                    value={formData.is_active ? "true" : "false"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        is_active: value === "true",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Hoạt động</SelectItem>
                      <SelectItem value="false">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={isCreating || isUploading}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateBadge}
                  disabled={isCreating || isUploading}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {(isCreating || isUploading) && (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {isUploading ? "Đang upload..." : "Tạo huy hiệu"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {searchQuery ? "Không tìm thấy huy hiệu nào" : "Chưa có huy hiệu nào"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((badge) => (
            <Card
              key={badge.id}
              className={cn(
                "border-2 transition-all hover:shadow-lg",
                badge.is_active
                  ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50"
                  : "border-gray-200 bg-gray-50"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900">
                      {badge.name}
                    </CardTitle>
                  </div>
                  <Badge
                    className={cn(
                      "text-xs",
                      badge.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {badge.is_active ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Badge Icon */}
                {badge.icon_url && (
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20">
                      <Image
                        src={badge.icon_url}
                        alt={badge.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Mô tả
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {badge.description}
                  </p>
                </div>

                {/* Sort Order */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-600">Thứ tự:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {badge.sort_order}
                  </span>
                </div>

                {/* Dates */}
                <div className="space-y-1 text-xs text-gray-500">
                  <p>Tạo: {formatDate(badge.created_at)}</p>
                  <p>Cập nhật: {formatDate(badge.updated_at)}</p>
                </div>

                {/* Edit Button */}
                <Button
                  onClick={() => handleEditBadge(badge)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Chỉnh sửa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        {loading
          ? "Đang tải..."
          : `Hiển thị ${filtered.length}/${badges.length} huy hiệu`}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Chỉnh sửa huy hiệu
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin huy hiệu
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Tên huy hiệu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="VD: Nhà tài trợ vàng"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-description"
                placeholder="Mô tả về huy hiệu này"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-20"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Ảnh huy hiệu
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative w-full">
                  <div className="relative w-24 h-24 mx-auto">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Chọn ảnh
                </Button>
              )}
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="edit-sort_order" className="text-sm font-medium">
                Thứ tự sắp xếp
              </Label>
              <Input
                id="edit-sort_order"
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Is Active */}
            <div className="space-y-2">
              <Label htmlFor="edit-is_active" className="text-sm font-medium">
                Trạng thái
              </Label>
              <Select
                value={formData.is_active ? "true" : "false"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    is_active: value === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Hoạt động</SelectItem>
                  <SelectItem value="false">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                resetForm();
                setEditingBadge(null);
              }}
              disabled={isUpdating || isUploading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleUpdateBadge}
              disabled={isUpdating || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {(isUpdating || isUploading) && (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isUploading ? "Đang upload..." : "Cập nhật"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
