"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { translateRole } from "@/lib/translator";
import { Loader } from "@/components/animate-ui/icons/loader";
import { UserProfile } from "@/types/api/user";
import { userService } from "@/services/user.service";
import { cleanInput } from "@/lib/utils";
import { toast } from "sonner";

export function ProfileTab() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    userService.getProfile().then((profile) => {
      if (profile) {
        setUser(profile);
        setName(profile.full_name || "");
        setUserName(profile.user_name || "");
        setPhone(profile.phone_number || "");
        setBio(profile.bio || "");
        setAvatar(profile.avatar_url || "");
      }
    });
  }, []);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

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

  const handleSave = async () => {
    if (!user) return;

    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      toast.error("Vui lòng nhập số điện thoại hợp lệ");
      return;
    }

    const payload = cleanInput({
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
      const updated = await userService.updateProfile(payload);
      if (updated) {
        setUser(updated);
        toast.success("Cập nhật hồ sơ thành công 🎉");
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
            className={`mt-1 ${isEditing ? "" : "bg-gray-50"} ${
              phoneError ? "border-red-500" : ""
            }`}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Avatar URL
          </label>
          <Input
            type="text"
            value={avatar}
            readOnly={!isEditing}
            onChange={(e) => setAvatar(e.target.value)}
            className={`mt-1 ${isEditing ? "" : "bg-gray-50"}`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Giới thiệu
          </label>
          <Input
            type="text"
            value={bio}
            readOnly={!isEditing}
            onChange={(e) => setBio(e.target.value)}
            className={`mt-1 ${isEditing ? "" : "bg-gray-50"}`}
          />
        </div>
      </div>
    </div>
  );
}
