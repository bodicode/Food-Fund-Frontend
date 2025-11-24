"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { translateRole } from "@/lib/translator";
import { Loader } from "@/components/animate-ui/icons/loader";
import { UserProfile } from "@/types/api/user";
import { userService } from "@/services/user.service";
import { cleanInput } from "@/lib/utils/utils";
import { buildCoverUrl } from "@/lib/build-image";
import { toast } from "sonner";
import { Award, Upload, X } from "lucide-react";

interface ProfileTabProps {
  onProfileUpdate?: () => void;
}

export function ProfileTab({ onProfileUpdate }: ProfileTabProps) {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    userService.getMyProfile().then((profile) => {
      if (profile) {
        setUser(profile);
        setName(profile.full_name || "");
        setUserName(profile.user_name || "");
        setPhone(profile.phone_number || "");
        setBio(profile.bio || "");
        setAvatar(profile.avatar_url || "");
        setPreviewAvatar(profile.avatar_url || "");
        setAddress(profile.address || "");
      }
    });
  }, []);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "upload-avatar") {
      setIsEditing(true);
      // Scroll to avatar section
      setTimeout(() => {
        const avatarSection = document.querySelector("[data-avatar-section]");
        if (avatarSection) {
          avatarSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [searchParams]);

  const validatePhone = (value: string) => {
    if (!value) return "";

    const regex = /^\+84\d{9}$/;

    if (!regex.test(value)) {
      return "Số điện thoại không hợp lệ";
    }

    return "";
  };

  const handlePhoneChange = (value: string) => {
    let formatted = value;

    if (formatted.startsWith("0")) {
      formatted = "+84" + formatted.slice(1);
    }

    if (/^\d+$/.test(formatted) && !formatted.startsWith("+84")) {
      formatted = "+84" + formatted;
    }

    setPhone(formatted);
    setPhoneError(validatePhone(formatted));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Create preview immediately using FileReader
    const reader = new FileReader();
    reader.onloadend = async () => {
      const previewUrl = reader.result as string;
      setPreviewAvatar(previewUrl);

      try {
        setIsUploadingAvatar(true);

        // Generate upload URL
        const uploadInfo = await userService.generateAvatarUploadUrl(
          file.type
        );

        if (!uploadInfo) {
          toast.error("Không thể tạo URL upload");
          return;
        }

        // Upload file to S3
        const uploadResponse = await fetch(uploadInfo.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "x-amz-acl": "public-read",
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text().catch(() => "");
          console.error("Upload error:", uploadResponse.status, errorText);
          toast.error("Lỗi khi upload file");
          return;
        }

        // Build full CDN URL from fileKey
        const fullCdnUrl = buildCoverUrl(uploadInfo.fileKey);
        setAvatar(fullCdnUrl);
        toast.success("Upload avatar thành công");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Có lỗi xảy ra khi upload avatar");
        setPreviewAvatar("");
      } finally {
        setIsUploadingAvatar(false);
        if (avatarInputRef.current) {
          avatarInputRef.current.value = "";
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    setPreviewAvatar("");
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      toast.error("Vui lòng nhập số điện thoại hợp lệ");
      return;
    }

    const payload = cleanInput({
      address,
      full_name: name,
      phone_number: phone,
      bio,
      avatar_url: avatar,
    });

    if (Object.keys(payload).length === 0) {
      toast("Không có gì thay đổi");
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      const updated = await userService.updateMyProfile(payload);
      if (updated) {
        setUser(updated);
        toast.success("Cập nhật hồ sơ thành công 🎉");
        // Refresh profile in parent component (sidebar)
        onProfileUpdate?.();
      } else {
        toast.error("Không thể cập nhật hồ sơ");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Có lỗi xảy ra khi cập nhật", {
          description: error.message,
        });
      } else {
        toast.error("Có lỗi không xác định khi cập nhật");
      }
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  if (!user) return <Loader className="w-5 h-5" animate animateOnView loop />;

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-color">Hồ sơ cá nhân</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              className="btn-color flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving && <Loader className="w-4 h-4 animate-spin" />}
              Cập nhật
            </Button>
          </div>
        ) : (
          <Button className="btn-color" onClick={() => setIsEditing(true)}>
            Chỉnh sửa
          </Button>
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Đây là thông tin cá nhân của bạn. Bạn có thể chỉnh sửa chi tiết.
      </p>

      {/* Avatar Section */}
      {isEditing && (
        <div className="mb-6 pb-6 border-b" data-avatar-section>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Ảnh đại diện
          </label>
          <div className="flex items-end gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
              {previewAvatar ? (
                <>
                  <Image
                    src={previewAvatar}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                  />
                  {isEditing && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="gap-2"
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Chọn ảnh
                  </>
                )}
              </Button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isUploadingAvatar}
              />
              <p className="text-xs text-gray-500">
                Tối đa 5MB, định dạng: JPG, PNG, WebP
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Họ và tên
          </label>
          <Input
            ref={nameInputRef}
            type="text"
            value={name}
            readOnly={!isEditing}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 ${isEditing ? "" : "bg-gray-50"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="text"
            value={user.email}
            readOnly
            className="mt-1 bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên đăng nhập
          </label>
          <Input
            type="text"
            value={userName}
            readOnly={!isEditing}
            onChange={(e) => setUserName(e.target.value)}
            className={`mt-1 ${isEditing ? "" : "bg-gray-50"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <Input
            type="text"
            value={phone}
            readOnly={!isEditing}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={`mt-1 ${isEditing ? "" : "bg-gray-50"} ${phoneError ? "border-red-500" : ""
              }`}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Địa chỉ
          </label>
          <Input
            type="text"
            value={address}
            readOnly={!isEditing}
            onChange={(e) => setAddress(e.target.value)}
            className={`mt-1 ${isEditing ? "" : "bg-gray-50"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vai trò
          </label>
          <Input
            type="text"
            value={translateRole(user.role)}
            readOnly
            className="mt-1 bg-gray-50"
          />
        </div>
      </div>

      {/* Badge Section */}
      {user.badge && user.badge.is_active && (
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Huy hiệu
          </h3>
          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {user.badge.icon_url && (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={user.badge.icon_url}
                      alt={user.badge.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-bold text-gray-900">
                      {user.badge.name}
                    </h4>
                    <BadgeUI className="bg-yellow-100 text-yellow-800 text-xs">
                      Huy hiệu
                    </BadgeUI>
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.badge.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
