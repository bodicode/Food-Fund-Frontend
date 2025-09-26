"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
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

  const handleChange = (key: keyof SignUpInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
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

      toast.success("Đăng ký thành công", {
        description: translateMessage(res.message),
      });
      onSuccess(form.email);
    } catch (err) {
      toast.error("Đăng ký thất bại", { description: translateError(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col space-y-4">
      <Input
        type="text"
        placeholder="Họ và tên"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="w-full bg-white border border-[#ad4e28]/30 text-black"
      />
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        className="w-full bg-white border border-[#ad4e28]/30 text-black"
      />
      {/* <Input
        type="tel"
        placeholder="Số điện thoại (+84...)"
        value={form.phoneNumber}
        onChange={(e) => {
          let value = e.target.value;
          if (!value.startsWith("+84")) {
            value = "+84" + value.replace(/^(\+84|0)/, "");
          }
          value = "+84" + value.slice(3).replace(/\D/g, "");
          handleChange("phoneNumber", value);
        }}
        className="w-full bg-white border border-[#ad4e28]/30 text-black"
      /> */}

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className="bg-white border border-[#ad4e28]/30 text-black pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </Button>
      </div>

      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-white border border-[#ad4e28]/30 text-black pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
        >
          {showConfirmPassword ? <EyeOff /> : <Eye />}
        </Button>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="font-semibold rounded-lg py-2 btn-color"
      >
        {loading ? <Loader animate loop className="h-5 w-5" /> : "Đăng ký ngay"}
      </Button>
    </form>
  );
}
