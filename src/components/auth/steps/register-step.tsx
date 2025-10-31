"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "@/components/animate-ui/icons/loader";
import { SignUpInput } from "@/types/api/sign-up";
import { validateRegisterForm } from "@/lib/validators";
import { translateError, translateMessage } from "@/lib/translator";
import { AuthService } from "@/services/auth.service";

type Props = {
  authService: AuthService;
  onSuccess: (email: string) => void;
};

export function RegisterStep({ authService, onSuccess }: Props) {
  const [form, setForm] = useState<SignUpInput>({
    email: "",
    name: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Handle change cho các field input */
  const handleChange = (key: keyof SignUpInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /** Submit đăng ký */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validateRegisterForm(form, confirmPassword);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.signup(form);

      // ✅ Nếu backend trả về success = true → hiển thị hướng dẫn kiểm tra email
      toast.success("Đăng ký thành công!", {
        description:
          translateMessage(res.message) ||
          `Vui lòng kiểm tra email ${form.email} để kích hoạt tài khoản.`,
        icon: <Mail className="text-[#ad4e28]" />,
      });

      // Gọi callback để parent chuyển sang bước xác thực
      onSuccess(form.email);
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Đăng ký thất bại!", {
        description: translateError(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col space-y-4 animate-fadeIn"
    >
      {/* Họ và tên */}
      <Input
        type="text"
        placeholder="Họ và tên"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="w-full bg-white border border-[#ad4e28]/30 text-black"
        required
      />

      {/* Email */}
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        className="w-full bg-white border border-[#ad4e28]/30 text-black"
        required
      />

      {/* Mật khẩu */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className="bg-white border border-[#ad4e28]/30 text-black pr-10"
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>

      {/* Xác nhận mật khẩu */}
      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-white border border-[#ad4e28]/30 text-black pr-10"
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-600"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>

      {/* Nút submit */}
      <Button
        type="submit"
        disabled={loading}
        className="font-semibold rounded-lg py-2 btn-color"
      >
        {loading ? (
          <>
            <Loader animate loop className="h-5 w-5 mr-2" />
            Đang xử lý...
          </>
        ) : (
          "Đăng ký ngay"
        )}
      </Button>
    </form>
  );
}
