"use client";

import React, { JSX } from "react";
import {
  Building2,
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
  User,
  Globe,
  FileText,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OrganizationFormFieldsProps {
  form: Record<string, string>;
  errors: Record<string, string | undefined>;
  autoFilledFields: Set<string>;
  loading: boolean;
  imagePreview: string | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFormBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldClass: (key: string) => string;
  textAreaClass: (key: string) => string;
  ErrorLine: (props: { keyName: string }) => JSX.Element | null;
  refs: React.MutableRefObject<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>;
}

export const OrganizationFormFields = React.memo(function OrganizationFormFields({
  form,
  autoFilledFields,
  loading,
  imagePreview,
  onFormChange,
  onFormBlur,
  fieldClass,
  textAreaClass,
  ErrorLine,
  refs,
}: OrganizationFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tên tổ chức */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
          Tên tổ chức <span className="text-red-500">*</span>
        </Label>
        <div className="relative group">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          <Input
            id="name"
            name="name"
            ref={(el) => {
              refs.current.name = el;
            }}
            value={form.name}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="VD: Quỹ Thiện Nguyện Ánh Dương"
            className={fieldClass("name")}
            disabled={loading || !imagePreview}
          />
        </div>
        <ErrorLine keyName="name" />
      </div>

      {/* Lĩnh vực hoạt động */}
      <div className="space-y-2">
        <Label htmlFor="activity_field" className="text-sm font-semibold text-gray-700">
          Lĩnh vực hoạt động <span className="text-red-500">*</span>
        </Label>
        <div className="relative group">
          <HeartHandshake className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          <Input
            id="activity_field"
            name="activity_field"
            ref={(el) => {
              refs.current.activity_field = el;
            }}
            value={form.activity_field}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="VD: Từ thiện, Giáo dục, Y tế"
            className={fieldClass("activity_field")}
            disabled={loading || !imagePreview}
          />
        </div>
        <ErrorLine keyName="activity_field" />
      </div>

      {/* Số điện thoại */}
      <div className="space-y-2">
        <Label htmlFor="phone_number" className="text-sm font-semibold text-gray-700">
          Số điện thoại <span className="text-red-500">*</span>
        </Label>
        <div className="relative group">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          <Input
            id="phone_number"
            name="phone_number"
            type="tel"
            ref={(el) => {
              refs.current.phone_number = el;
            }}
            value={form.phone_number}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="+84901234567"
            className={fieldClass("phone_number")}
            disabled={loading || !imagePreview}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Nhập số điện thoại Việt Nam (+84 theo sau 9 chữ số). Ví dụ: +84901234567
        </p>
        <ErrorLine keyName="phone_number" />
      </div>

      {/* Địa chỉ */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          Địa chỉ <span className="text-red-500">*</span>
          {autoFilledFields.has("address") && (
            <div className="flex items-center gap-1 text-green-600">
              <Shield className="w-3 h-3" />
              <span className="text-xs font-normal">Tự động điền</span>
            </div>
          )}
        </Label>
        <div className="relative group">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          {autoFilledFields.has("address") && (
            <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
          )}
          <Input
            id="address"
            name="address"
            ref={(el) => {
              refs.current.address = el;
            }}
            value={form.address}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="30 Nguyễn Trãi, Quận 5, TP.HCM"
            className={fieldClass("address")}
            disabled={loading || !imagePreview}
            readOnly={autoFilledFields.has("address")}
          />
        </div>
        <ErrorLine keyName="address" />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
          Email đại diện <span className="text-red-500">*</span>
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          <Input
            id="email"
            name="email"
            type="email"
            ref={(el) => {
              refs.current.email = el;
            }}
            value={form.email}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="contact@organization.com"
            className={fieldClass("email")}
            disabled={loading || !imagePreview}
          />
        </div>
        <ErrorLine keyName="email" />
      </div>

      {/* Người đại diện */}
      <div className="space-y-2">
        <Label htmlFor="representative_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          Tên người đại diện <span className="text-red-500">*</span>
          {autoFilledFields.has("representative_name") && (
            <div className="flex items-center gap-1 text-green-600">
              <Shield className="w-3 h-3" />
              <span className="text-xs font-normal">Tự động điền</span>
            </div>
          )}
        </Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          {autoFilledFields.has("representative_name") && (
            <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
          )}
          <Input
            id="representative_name"
            name="representative_name"
            ref={(el) => {
              refs.current.representative_name = el;
            }}
            value={form.representative_name}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="Nguyễn Văn A"
            className={fieldClass("representative_name")}
            disabled={loading || !imagePreview}
            readOnly={autoFilledFields.has("representative_name")}
          />
        </div>
        <ErrorLine keyName="representative_name" />
      </div>

      {/* CCCD */}
      <div className="space-y-2">
        <Label htmlFor="representative_identity_number" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          CMND/CCCD người đại diện <span className="text-red-500">*</span>
          {autoFilledFields.has("representative_identity_number") && (
            <div className="flex items-center gap-1 text-green-600">
              <Shield className="w-3 h-3" />
              <span className="text-xs font-normal">Tự động điền</span>
            </div>
          )}
        </Label>
        <div className="relative group">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          {autoFilledFields.has("representative_identity_number") && (
            <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
          )}
          <Input
            id="representative_identity_number"
            name="representative_identity_number"
            ref={(el) => {
              refs.current.representative_identity_number = el;
            }}
            value={form.representative_identity_number}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="001234567890"
            className={fieldClass("representative_identity_number")}
            disabled={loading || !imagePreview}
            readOnly={autoFilledFields.has("representative_identity_number")}
          />
        </div>
        <ErrorLine keyName="representative_identity_number" />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm font-semibold text-gray-700">
          Website <span className="text-gray-500 font-normal">(Tùy chọn)</span>
        </Label>
        <div className="relative group">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          <Input
            id="website"
            name="website"
            ref={(el) => {
              refs.current.website = el;
            }}
            value={form.website}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="https://yoursite.com"
            className={fieldClass("website")}
            disabled={loading || !imagePreview}
          />
        </div>
        <p className="text-xs text-gray-500">Nếu không có website, bạn có thể bỏ trống trường này</p>
        <ErrorLine keyName="website" />
      </div>

      {/* Mô tả */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
          Mô tả tổ chức <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Textarea
            id="description"
            name="description"
            ref={(el) => {
              refs.current.description = el;
            }}
            value={form.description}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="Chia sẻ về sứ mệnh, tầm nhìn và các hoạt động chính của tổ chức..."
            className={textAreaClass("description")}
            disabled={loading || !imagePreview}
          />
        </div>
        <ErrorLine keyName="description" />
      </div>
    </div>
  );
});
