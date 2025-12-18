"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Eye, EyeOff, ArrowLeft, KeyRound, Lock, Home, ArrowRight } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { graphQLAuthService } from "../../../services/auth.service";
import { toast } from "sonner";
import { Loader } from "../../../components/animate-ui/icons/loader";
import { translateError, translateMessage } from "../../../lib/translator";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await graphQLAuthService.forgotPassword({ email });
      if (res.emailSent) {
        toast.success("Gửi OTP thành công", {
          description: translateMessage(res.message),
        });
        setStep(2);
      } else {
        toast.error("Không gửi được OTP", {
          description: translateMessage(res.message),
        });
      }
    } catch (err) {
      toast.error("Lỗi", { description: translateError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await graphQLAuthService.confirmForgotPassword({
        email,
        confirmationCode: otp,
        newPassword,
      });
      if (res.passwordReset) {
        toast.success("Đặt lại mật khẩu thành công", {
          description: translateMessage(res.message),
        });
        window.location.href = "/login";
      } else {
        toast.error("Đặt lại mật khẩu thất bại", {
          description: translateMessage(res.message),
        });
      }
    } catch (err) {
      toast.error("Lỗi", { description: translateError(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f9f0e4] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decor Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ad4e28]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="text-center space-y-3 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black tracking-tighter"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ad4e28] via-[#d76c42] to-[#ad4e28] bg-[length:200%_auto] animate-gradient-slow uppercase">
              {step === 1 ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-[10px] md:text-xs font-bold tracking-[0.2em] max-w-lg mx-auto uppercase leading-relaxed"
          >
            {step === 1
              ? "NHẬP EMAIL ĐÃ ĐĂNG KÝ ĐỂ NHẬN MÃ OTP VÀ HƯỚNG DẪN ĐẶT LẠI MẬT KHẨU"
              : "VUI LÒNG NHẬP MÃ OTP VÀ THIẾT LẬP MẬT KHẨU MỚI CHO TÀI KHOẢN CỦA BẠN"}
          </motion.p>
        </div>

        <div className="relative backdrop-blur-xl bg-white/60 p-8 md:p-10 rounded-[3rem] shadow-[0_32px_80px_-16px_rgba(173,78,40,0.12)] border border-white/40">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onSubmit={handleSendEmail}
                className="space-y-6"
              >
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-14 h-16 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[1.5rem] text-lg placeholder:text-gray-300 font-medium border-2"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-16 font-black text-lg bg-[#ad4e28] hover:bg-[#8f4021] text-white shadow-xl shadow-[#ad4e28]/20 rounded-[1.5rem] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader animate loop className="h-6 w-6" />
                      <span>ĐANG XỬ LÝ...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-3 uppercase tracking-widest">
                      Gửi yêu cầu
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                {/* OTP Input */}
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-14 h-16 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[1.5rem] text-lg placeholder:text-gray-300 font-medium border-2"
                    required
                  />
                </div>

                {/* New Password */}
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-14 pr-14 h-16 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[1.5rem] text-lg placeholder:text-gray-300 font-medium border-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ad4e28] transition-all duration-300 z-10"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-14 pr-14 h-16 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[1.5rem] text-lg placeholder:text-gray-300 font-medium border-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ad4e28] transition-all duration-300 z-10"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-16 font-black text-lg bg-[#ad4e28] hover:bg-[#8f4021] text-white shadow-xl shadow-[#ad4e28]/20 rounded-[1.5rem] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader animate loop className="h-6 w-6" />
                      <span>ĐANG XỬ LÝ...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-3 uppercase tracking-widest">
                      Đặt lại mật khẩu
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <p className="text-gray-500 font-medium text-sm">
            Nhớ lại mật khẩu rồi?{" "}
            <Link
              href="/login"
              className="font-black text-[#ad4e28] hover:text-[#8f4021] transition-all tracking-tight"
            >
              ĐĂNG NHẬP NGAY
            </Link>
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#ad4e28] transition-all duration-300 group uppercase tracking-widest"
            >
              <Home className="w-4 h-4" />
              VỀ TRANG CHỦ
            </Link>

            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-[10px] font-black text-[#ad4e28] hover:text-[#8f4021] transition-all duration-300 group uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" />
                GỬI LẠI OTP
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          animation: gradient-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
}

