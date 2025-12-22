"use client";

import { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Mail, User, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "../../animate-ui/icons/loader";
import { SignUpInput } from "../../../types/api/sign-up";
import { validateRegisterForm } from "../../../lib/validators";
import { translateError, translateMessage } from "../../../lib/translator";
import { AuthService } from "../../../services/auth.service";
import { motion } from "framer-motion";

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

      toast.success("Đăng ký thành công!", {
        description:
          translateMessage(res.message) ||
          `Vui lòng kiểm tra email ${form.email} để kích hoạt tài khoản.`,
        icon: <Mail className="text-green-500 mr-1" />,
      });

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
      className="space-y-4"
    >
      <div className="space-y-2">
        {/* Họ và tên */}
        <div className="relative group/input">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
            <User className="h-5 w-5" />
          </div>
          <Input
            type="text"
            placeholder="Họ và tên của bạn"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="pl-14 h-14 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[1.5rem] text-sm placeholder:text-gray-300 font-medium border-2"
            required
          />
        </div>

        {/* Email */}
        <div className="relative group/input">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
            <Mail className="h-5 w-5" />
          </div>
          <Input
            type="email"
            placeholder="Email liên hệ"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="pl-14 h-14 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[1.5rem] text-sm placeholder:text-gray-300 font-medium border-2"
            required
          />
        </div>

        {/* Mật khẩu */}
        <div className="relative group/input">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
            <Lock className="h-5 w-5" />
          </div>
          <Input
            type="password"
            placeholder="Mật khẩu bảo mật"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="pl-14 h-14 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[1.5rem] text-sm placeholder:text-gray-300 font-medium border-2"
            required
          />
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="relative group/input">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
            <Lock className="h-5 w-5" />
          </div>
          <Input
            type="password"
            placeholder="Xác nhận mật mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-14 h-14 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[1.5rem] text-sm placeholder:text-gray-300 font-medium border-2"
            required
          />
        </div>
      </div>

      {/* Nút submit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="group relative w-full h-15 font-black text-lg bg-[#ad4e28] hover:bg-[#8f4021] text-white shadow-xl shadow-[#ad4e28]/20 rounded-[1.5rem] transition-all duration-300 hover:scale-[1.01] active:scale-95 hover:shadow-2xl hover:shadow-[#ad4e28]/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader animate loop className="h-5 w-5" />
              <span className="text-sm">ĐANG XỬ LÝ...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-3 uppercase tracking-widest text-base">
              Đăng ký ngay
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
