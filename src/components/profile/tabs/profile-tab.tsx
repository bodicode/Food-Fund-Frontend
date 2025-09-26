"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { translateRole } from "@/lib/translator";

export function ProfileTab() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    // TODO: gọi API update tên user
    console.log("New name:", name);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#ad4e28]">Hồ sơ cá nhân</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Hủy
            </Button>
            <Button className="btn-color" onClick={handleSave}>
              Lưu
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
        {/* Họ và tên */}
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

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="text"
            value={user?.email || ""}
            readOnly
            className="mt-1 bg-gray-50"
          />
        </div>

        {/* Vai trò */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vai trò
          </label>
          <Input
            type="text"
            value={translateRole(user?.role) || "Chưa có"}
            readOnly
            className="mt-1 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}
