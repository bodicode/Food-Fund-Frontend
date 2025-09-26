"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LockIcon } from "@/components/animate-ui/icons/lock";
import { MessageCircleCode } from "@/components/animate-ui/icons/message-circle-code";
import { graphQLAuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { Loader } from "@/components/animate-ui/icons/loader";
import { translateError, translateMessage } from "@/lib/translator";

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
    <div className="min-h-screen flex items-center justify-center bg-color-base px-4">
      <Card className="bg-white/90 backdrop-blur-sm border border-[#ad4e28]/30 shadow-xl w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-[#ad4e28]">
            {step === 1 ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <form
              onSubmit={handleSendEmail}
              className="flex flex-col space-y-4"
            >
              <p className="text-center text-gray-600 text-sm leading-relaxed">
                Nhập email bạn đã đăng ký để nhận mã OTP và hướng dẫn đặt lại
                mật khẩu.
              </p>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ad4e28]/70" />
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-semibold rounded-lg py-2 btn-color"
              >
                {loading ? (
                  <Loader animate loop className="h-5 w-5" />
                ) : (
                  "Gửi yêu cầu"
                )}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col space-y-4"
            >
              {/* OTP */}
              <div className="relative">
                <MessageCircleCode
                  animate
                  animateOnView
                  loop
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ad4e28]/70"
                />
                <Input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28]"
                />
              </div>

              {/* Mật khẩu mới */}
              <div className="relative">
                <LockIcon
                  animate
                  animateOnView
                  loop
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ad4e28]/70"
                />
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-[#ad4e28] hover:text-[#8c3e1f] hover:bg-transparent"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="relative">
                <LockIcon
                  animate
                  animateOnView
                  loop
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ad4e28]/70"
                />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-[#ad4e28] hover:text-[#8c3e1f] hover:bg-transparent"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-semibold rounded-lg py-2 btn-color"
              >
                {loading ? (
                  <Loader animate loop className="h-5 w-5" />
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 items-center text-sm">
          <p className="text-gray-600">
            Nhớ lại mật khẩu rồi?{" "}
            <Link
              href="/login"
              className="text-[#ad4e28] font-semibold hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
          <Link
            href="/"
            className="text-gray-500 hover:text-[#ad4e28] transition text-xs"
          >
            ← Quay về trang chủ
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
