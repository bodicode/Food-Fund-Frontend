"use client";

import { useMemo, useRef, useState } from "react";
import {
  Building2,
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
  User,
  CreditCard,
  Globe,
  FileText,
  CheckCircle2,
  Sparkles,
  Camera,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { organizationService } from "@/services/organization.service";
import type { CreateOrganizationInput } from "@/types/api/organization";
import { toast } from "sonner";
import { Loader } from "@/components/animate-ui/icons/loader";
import Image from "next/image";

type FormKeys =
  | "name"
  | "activity_field"
  | "address"
  | "phone_number"
  | "email"
  | "representative_name"
  | "representative_identity_number"
  | "website"
  | "description";

export default function OrgRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<FormKeys>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Record<FormKeys, string>>({
    name: "",
    activity_field: "",
    address: "",
    phone_number: "",
    email: "",
    representative_name: "",
    representative_identity_number: "",
    website: "",
    description: "",
  });

  const [touched, setTouched] = useState<Partial<Record<FormKeys, boolean>>>(
    {}
  );
  const [errors, setErrors] = useState<Partial<Record<FormKeys, string>>>({});

  const refs = useRef<
    Record<FormKeys, HTMLInputElement | HTMLTextAreaElement | null>
  >({
    name: null,
    activity_field: null,
    address: null,
    phone_number: null,
    email: null,
    representative_name: null,
    representative_identity_number: null,
    website: null,
    description: null,
  });

  const labels: Record<FormKeys, string> = useMemo(
    () => ({
      name: "Tên tổ chức",
      activity_field: "Lĩnh vực hoạt động",
      address: "Địa chỉ",
      phone_number: "Số điện thoại",
      email: "Email đại diện",
      representative_name: "Tên người đại diện",
      representative_identity_number: "CMND/CCCD người đại diện",
      website: "Website",
      description: "Mô tả tổ chức",
    }),
    []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as { name: FormKeys; value: string };
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: value.trim()
          ? ""
          : `Vui lòng nhập ${labels[name].toLowerCase()}.`,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as { name: FormKeys; value: string };
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim()
        ? ""
        : `Vui lòng nhập ${labels[name].toLowerCase()}.`,
    }));
  };

  const validateAll = (): Partial<Record<FormKeys, string>> => {
    const next: Partial<Record<FormKeys, string>> = {};
    (Object.keys(form) as FormKeys[]).forEach((k) => {
      if (!form[k].trim())
        next[k] = `Vui lòng nhập ${labels[k].toLowerCase()}.`;
    });
    return next;
  };

  const buildInput = (): CreateOrganizationInput => {
    const trim = (s: string) => s.trim();
    return {
      name: trim(form.name),
      email: trim(form.email),
      representative_name: trim(form.representative_name),
      representative_identity_number: trim(form.representative_identity_number),
      activity_field: trim(form.activity_field),
      address: trim(form.address),
      phone_number: trim(form.phone_number),
      website: trim(form.website),
      description: trim(form.description),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const nextErrors = validateAll();
    setErrors(nextErrors);
    setTouched({
      name: true,
      activity_field: true,
      address: true,
      phone_number: true,
      email: true,
      representative_name: true,
      representative_identity_number: true,
      website: true,
      description: true,
    });

    const hasError = Object.values(nextErrors).some((v) => v && v.length > 0);
    if (hasError) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");

      const firstKey = (Object.keys(nextErrors) as FormKeys[]).find(
        (k) => nextErrors[k]
      );
      if (firstKey && refs.current[firstKey]) {
        refs.current[firstKey]!.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        refs.current[firstKey]!.focus();
      }
      return;
    }

    const input = buildInput();

    try {
      setLoading(true);
      const res = await organizationService.createOrganization(input);

      if (res.success) toast.success(res.message || "Tạo tổ chức thành công!");
      else {
        toast.error(res.message || "Tạo tổ chức thất bại");
        return;
      }

      setSubmitted(true);
      setForm({
        name: "",
        activity_field: "",
        address: "",
        phone_number: "",
        email: "",
        representative_name: "",
        representative_identity_number: "",
        website: "",
        description: "",
      });
      setErrors({});
      setTouched({});

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (key: FormKeys) => {
    const baseClass = "h-12 border-2 focus-visible:ring-orange-200";
    const paddingClass = autoFilledFields.has(key) ? "pl-11 pr-11" : "pl-11";
    const errorClass = errors[key] ? "border-red-400 focus:border-red-500" : "focus:border-orange-500";
    const readOnlyClass = autoFilledFields.has(key) ? "bg-green-50 border-green-300 text-green-800 cursor-not-allowed" : "";
    
    return `${baseClass} ${paddingClass} ${errorClass} ${readOnlyClass}`;
  };

  const textAreaClass = (key: FormKeys) =>
    `pl-11 min-h-32 border-2 resize-none focus-visible:ring-orange-200 ${
      errors[key]
        ? "border-red-400 focus:border-red-500"
        : "focus:border-orange-500"
    }`;

  const ErrorLine = ({ keyName }: { keyName: FormKeys }) =>
    errors[keyName] ? (
      <p className="mt-1 text-sm text-red-600">{errors[keyName]}</p>
    ) : null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh hợp lệ');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploadedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process the image
    processIdCard(file);
  };

  const processIdCard = async (file: File) => {
    setIsProcessingImage(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_FPT_API_KEY;
      if (!apiKey) {
        toast.error('API key chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
        clearImage();
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      console.log('Processing ID card with FPT AI...');
      const response = await fetch('https://api.fpt.ai/vision/idr/vnm/', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('FPT AI response:', result);

      if (result.errorCode === 0 && result.data && result.data.length > 0) {
        const idData = result.data[0];
        console.log('Extracted ID data:', idData);
        
        // Track which fields will be auto-filled
        const filledFields = new Set<FormKeys>();
        const updatedForm: Partial<Record<FormKeys, string>> = {};

        if (idData.name) {
          updatedForm.representative_name = idData.name;
          filledFields.add('representative_name');
        }
        if (idData.id) {
          updatedForm.representative_identity_number = idData.id;
          filledFields.add('representative_identity_number');
        }
        if (idData.address) {
          updatedForm.address = idData.address;
          filledFields.add('address');
        }

        // Auto-fill form fields from OCR response
        setForm(prev => ({
          ...prev,
          ...updatedForm,
        }));

        // Mark these fields as auto-filled (read-only)
        setAutoFilledFields(filledFields);

        toast.success('Đã tự động điền thông tin từ CCCD/CMND. Các thông tin này đã được khóa để đảm bảo tính chính xác.');
      } else if (result.errorCode === 3) {
        toast.error('Không tìm thấy CCCD/CMND trong hình ảnh. Vui lòng tải lên ảnh khác.');
        clearImage();
      } else {
        console.error('FPT AI error:', result);
        toast.error(result.errorMessage || 'Có lỗi xảy ra khi xử lý hình ảnh');
        clearImage();
      }
    } catch (error) {
      console.error('Error processing ID card:', error);
      toast.error('Có lỗi xảy ra khi xử lý hình ảnh. Vui lòng thử lại.');
      clearImage();
    } finally {
      setIsProcessingImage(false);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    clearImage();
    // Clear the auto-filled fields when removing image
    setForm(prev => ({
      ...prev,
      representative_name: '',
      representative_identity_number: '',
      address: '',
    }));
    // Clear auto-filled fields tracking
    setAutoFilledFields(new Set());
    toast.info('Đã xóa ảnh CCCD/CMND và mở khóa các trường thông tin');
  };

  return (
    <div className="min-h-screen pt-30 bg-gradient-to-br from-orange-50 via-white to-pink-50 py-16 px-4 relative overflow-hidden">
      <div className="fixed top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div
        className="fixed top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="fixed bottom-20 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-6">
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Dành cho tổ chức từ thiện
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-500 bg-clip-text text-transparent leading-tight">
            Đăng ký Tài khoản
            <br />
            Tổ chức Minh bạch
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gia nhập hệ sinh thái từ thiện minh bạch, quản lý quỹ chuyên nghiệp
            và xây dựng niềm tin với cộng đồng
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {["100% Minh bạch", "Bảo mật cao", "Miễn phí đăng ký"].map(
              (text) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>

          <Card className="relative border-0 shadow-2xl bg-white/95 backdrop-blur">
            <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 p-8 rounded-t-2xl">
              <CardHeader className="text-center space-y-4 p-0">
                <div className="flex items-center justify-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm transform hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm transform hover:scale-110 transition-transform">
                    <HeartHandshake className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white">
                  Thông tin Tổ chức
                </CardTitle>
                <CardDescription className="text-orange-50 text-base">
                  Vui lòng điền đầy đủ thông tin bên dưới
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-6">
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3">
                      {error}
                    </div>
                  )}

                  {/* ID Card Upload - Moved to top */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Tải ảnh CCCD/CMND để tự động điền thông tin
                      <span className="text-orange-600 font-normal ml-2">(Khuyến nghị)</span>
                    </Label>
                    
                    {!imagePreview ? (
                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={loading || isProcessingImage}
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-orange-300 hover:border-orange-400 rounded-xl p-8 text-center cursor-pointer transition-colors group bg-orange-50/50"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                              <Camera className="w-10 h-10 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-base font-semibold text-gray-800">
                                Chụp ảnh hoặc tải lên CCCD/CMND
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Hệ thống sẽ tự động điền thông tin cho bạn
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG tối đa 5MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <Image
                                src={imagePreview}
                                alt="ID Card Preview"
                                width={128}
                                height={80}
                                className="w-32 h-20 object-cover rounded-lg border"
                              />
                              {isProcessingImage && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {uploadedImage?.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {isProcessingImage ? 'Đang xử lý và điền thông tin...' : 'Đã xử lý thành công'}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRemoveImage}
                                  disabled={isProcessingImage}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Helper message when no image uploaded */}
                  {!imagePreview && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                      <p className="text-blue-700 text-sm font-medium">
                        📸 Vui lòng tải lên ảnh CCCD/CMND để bắt đầu điền thông tin
                      </p>
                      <p className="text-blue-600 text-xs mt-1">
                        Hệ thống sẽ tự động điền thông tin cơ bản từ CCCD/CMND của bạn
                      </p>
                    </div>
                  )}

                  {/* Helper message when fields are auto-filled */}
                  {autoFilledFields.size > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <p className="text-green-700 text-sm font-medium">
                          Thông tin đã được tự động điền từ CCCD/CMND
                        </p>
                      </div>
                      <p className="text-green-600 text-xs">
                        Các trường có biểu tượng <Shield className="w-3 h-3 inline mx-1" /> đã được khóa để đảm bảo tính chính xác. 
                        Nếu cần chỉnh sửa, vui lòng xóa ảnh và tải lên lại.
                      </p>
                    </div>
                  )}

                  {/* Form fields - disabled until image processing is complete */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tên tổ chức */}
                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-700"
                      >
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="VD: Quỹ Thiện Nguyện Ánh Dương"
                          className={fieldClass("name")}
                          disabled={loading || !imagePreview}
                        />
                      </div>
                      <ErrorLine keyName="name" />
                    </div>

                    {/* Lĩnh vực hoạt động */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="activity_field"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Lĩnh vực hoạt động{" "}
                        <span className="text-red-500">*</span>
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="VD: Từ thiện, Giáo dục, Y tế"
                          className={fieldClass("activity_field")}
                          disabled={loading || !imagePreview}
                        />
                      </div>
                      <ErrorLine keyName="activity_field" />
                    </div>

                    {/* Số điện thoại */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone_number"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Số điện thoại <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        <Input
                          id="phone_number"
                          name="phone_number"
                          ref={(el) => {
                            refs.current.phone_number = el;
                          }}
                          value={form.phone_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="+84 123 456 789"
                          className={fieldClass("phone_number")}
                          disabled={loading || !imagePreview}
                        />
                      </div>
                      <ErrorLine keyName="phone_number" />
                    </div>

                    {/* Địa chỉ */}
                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        Địa chỉ <span className="text-red-500">*</span>
                        {autoFilledFields.has('address') && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Shield className="w-3 h-3" />
                            <span className="text-xs font-normal">Tự động điền</span>
                          </div>
                        )}
                      </Label>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        {autoFilledFields.has('address') && (
                          <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        )}
                        <Input
                          id="address"
                          name="address"
                          ref={(el) => {
                            refs.current.address = el;
                          }}
                          value={form.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="30 Nguyễn Trãi, Quận 5, TP.HCM"
                          className={fieldClass("address")}
                          disabled={loading || !imagePreview}
                          readOnly={autoFilledFields.has('address')}
                        />
                      </div>
                      <ErrorLine keyName="address" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700"
                      >
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="contact@organization.com"
                          className={fieldClass("email")}
                          disabled={loading || !imagePreview}
                        />
                      </div>
                      <ErrorLine keyName="email" />
                    </div>

                    {/* Người đại diện */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="representative_name"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        Tên người đại diện{" "}
                        <span className="text-red-500">*</span>
                        {autoFilledFields.has('representative_name') && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Shield className="w-3 h-3" />
                            <span className="text-xs font-normal">Tự động điền</span>
                          </div>
                        )}
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        {autoFilledFields.has('representative_name') && (
                          <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        )}
                        <Input
                          id="representative_name"
                          name="representative_name"
                          ref={(el) => {
                            refs.current.representative_name = el;
                          }}
                          value={form.representative_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Nguyễn Văn A"
                          className={fieldClass("representative_name")}
                          disabled={loading || !imagePreview}
                          readOnly={autoFilledFields.has('representative_name')}
                        />
                      </div>
                      <ErrorLine keyName="representative_name" />
                    </div>

                    {/* CCCD */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="representative_identity_number"
                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                      >
                        CMND/CCCD người đại diện{" "}
                        <span className="text-red-500">*</span>
                        {autoFilledFields.has('representative_identity_number') && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Shield className="w-3 h-3" />
                            <span className="text-xs font-normal">Tự động điền</span>
                          </div>
                        )}
                      </Label>
                      <div className="relative group">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        {autoFilledFields.has('representative_identity_number') && (
                          <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        )}
                        <Input
                          id="representative_identity_number"
                          name="representative_identity_number"
                          ref={(el) => {
                            refs.current.representative_identity_number = el;
                          }}
                          value={form.representative_identity_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="001234567890"
                          className={fieldClass(
                            "representative_identity_number"
                          )}
                          disabled={loading || !imagePreview}
                          readOnly={autoFilledFields.has('representative_identity_number')}
                        />
                      </div>
                      <ErrorLine keyName="representative_identity_number" />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Website <span className="text-red-500">*</span>
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="https://yoursite.com"
                          className={fieldClass("website")}
                          disabled={loading || !imagePreview}
                        />
                      </div>
                      <ErrorLine keyName="website" />
                    </div>

                    {/* Mô tả */}
                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold text-gray-700"
                      >
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Chia sẻ về sứ mệnh, tầm nhìn và các hoạt động chính của tổ chức..."
                          className={textAreaClass("description")}
                          disabled={loading || !imagePreview}
                        />
                      </div>
                      <ErrorLine keyName="description" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading || !imagePreview}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <Loader className="w-5 h-5 inline mr-2" /> Đang gửi
                          yêu cầu
                        </span>
                      ) : submitted ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Đăng ký thành công!
                        </span>
                      ) : (
                        "Đăng ký Tài khoản Tổ chức"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
