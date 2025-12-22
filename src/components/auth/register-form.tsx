"use client";

import { useState } from "react";
import Link from "next/link";
import { RegisterStep } from "./steps/register-step";
import { ConfirmStep } from "./steps/confirm-step";
import { graphQLAuthService } from "../../services/auth.service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../store/slices/auth-slice";
import { RootState } from "../../store";
import { motion, AnimatePresence } from "framer-motion";
import { USER_ROLES, ROUTES, COOKIE_NAMES } from "../../constants";
import { Button } from "../ui/button";
import { Home } from "lucide-react";
import { decodeIdToken } from "../../lib/jwt-utils";

type RegisterFormProps = {
  onSwitchToLogin?: () => void;
};

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [step, setStep] = useState<"register" | "confirm">("register");
  const [emailForConfirm, setEmailForConfirm] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // --- Xử lý Google Register ---
  const handleGoogleRegister = async (credentialResponse: CredentialResponse) => {
    try {
      if (user) {
        toast.info("Bạn đã đăng nhập");
        router.push("/");
        return;
      }

      const token = credentialResponse.credential;
      if (!token) return;

      const res = await graphQLAuthService.googleAuthentication({ idToken: token });
      const decoded = decodeIdToken(res.idToken);

      if (!decoded) {
        toast.error("Không thể giải mã mã xác thực!");
        return;
      }

      if (!res.isNewUser) {
        toast.info("Tài khoản đã tồn tại, bạn đã được đăng nhập");
      } else {
        toast.success("Đăng ký Google thành công", {
          description: `Chào ${decoded.name || "bạn"}!`,
        });
      }

      // Lưu token & dispatch
      if (decoded.sub) {
        dispatch(
          setCredentials({
            user: {
              id: decoded.sub,
              name: decoded.name || "",
              email: decoded.email || "",
              role: decoded["custom:role"],
            },
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })
        );
      }

      Cookies.set(COOKIE_NAMES.ID_TOKEN, res.idToken, {
        secure: true,
        sameSite: "strict",
        expires: 1 / 24, // 1 hour
      });
      Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, res.accessToken, {
        secure: true,
        sameSite: "strict",
        expires: 1 / 24, // 1 hour
      });
      Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, res.refreshToken, {
        secure: true,
        sameSite: "strict",
        expires: 30, // 30 days
      });
      Cookies.set(COOKIE_NAMES.ROLE, decoded["custom:role"] || USER_ROLES.DONOR, {
        secure: true,
        sameSite: "strict",
        expires: 30, // 30 days
      });

      // Điều hướng theo role
      const role = decoded["custom:role"]?.toUpperCase();
      if (role === USER_ROLES.ADMIN) router.push("/admin/users");
      else if (role === USER_ROLES.KITCHEN) router.push(ROUTES.KITCHEN);
      else if (role === USER_ROLES.DELIVERY) router.push(ROUTES.DELIVERY);
      else router.push(ROUTES.HOME);
    } catch (error) {
      console.error("Google register error:", error);
      toast.error("Đăng ký Google thất bại!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
      className="w-full"
    >
      <div className="w-full space-y-4">
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-black tracking-tighter"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ad4e28] via-[#d76c42] to-[#ad4e28] bg-[length:200%_auto] animate-gradient-slow uppercase">
              {step === "register" ? "Tạo tài khoản" : "Xác thực email"}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-[10px] md:text-xs font-medium tracking-tight max-w-2xl mx-auto uppercase"
          >
            {step === "register"
              ? "KHÁM PHÁ HÀNH TRÌNH CHIA SẺ VÀ LAN TỎA YÊU THƯƠNG"
              : "VUI LÒNG KIỂM TRA EMAIL ĐỂ HOÀN TẤT QUÁ TRÌNH ĐĂNG KÝ"}
          </motion.p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {step === "register" ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="space-y-4"
              >
                <RegisterStep
                  authService={graphQLAuthService}
                  onSuccess={(email) => {
                    setEmailForConfirm(email);
                    setStep("confirm");
                  }}
                />

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em]">
                    <span className="bg-[#f9f0e4] px-10 text-gray-400 font-bold">
                      Hoặc kết nối qua
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleRegister}
                    onError={() => toast.error("Đăng ký Google thất bại!")}
                    shape="pill"
                    theme="outline"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ConfirmStep
                  email={emailForConfirm}
                  onSuccess={() => onSwitchToLogin?.()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-gray-500 font-medium text-sm">
            Đã có tài khoản?{" "}
            <Button
              type="button"
              onClick={onSwitchToLogin}
              variant="link"
              className="p-0 h-auto font-black text-[#ad4e28] hover:text-[#8f4021] text-sm transition-all"
            >
              ĐĂNG NHẬP
            </Button>
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#ad4e28] transition-all duration-300 group uppercase tracking-widest"
          >
            <Home className="w-4 h-4" />
            VỀ TRANG CHỦ
          </Link>
        </motion.div>
      </div>

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
    </motion.div>
  );
}
