"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { RegisterStep } from "./steps/register-step";
import { ConfirmStep } from "./steps/confirm-step";
import { graphQLAuthService } from "@/services/auth.service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import type { DecodedIdToken } from "@/lib/jwt-utils";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/store/slices/auth-slice";
import { RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { USER_ROLES, ROUTES, COOKIE_NAMES } from "@/constants";

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
      const decoded = jwtDecode<DecodedIdToken>(res.idToken);

      if (!res.isNewUser) {
        toast.info("Tài khoản đã tồn tại, bạn đã được đăng nhập");
      } else {
        toast.success("Đăng ký Google thành công", {
          description: `Chào ${decoded?.name || "bạn"}!`,
        });
      }

      // Lưu token & dispatch
      if (decoded?.sub) {
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

      Cookies.set(COOKIE_NAMES.ID_TOKEN, res.idToken, { secure: true, sameSite: "strict" });
      Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, res.accessToken, { secure: true, sameSite: "strict" });
      Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, res.refreshToken, { secure: true, sameSite: "strict" });
      Cookies.set(COOKIE_NAMES.ROLE, (decoded["custom:role"] as string) || USER_ROLES.DONOR, {
        secure: true,
        sameSite: "strict",
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
    <Card className="bg-transparent border-none shadow-none text-black w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-[#ad4e28]">
          {step === "register" ? "Đăng ký tài khoản" : "Xác thực tài khoản"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 min-h-[340px]">
        <AnimatePresence mode="wait">
          {step === "register" ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterStep
                authService={graphQLAuthService}
                onSuccess={(email) => {
                  setEmailForConfirm(email);
                  setStep("confirm");
                }}
              />

              {/* Divider + Google button */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleRegister}
                  onError={() => toast.error("Đăng ký Google thất bại!")}
                  shape="pill"
                  text="signup_with"
                  size="large"
                  theme="outline"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <ConfirmStep
                email={emailForConfirm}
                onSuccess={() => onSwitchToLogin?.()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-black">
        <Link href="/" className="hover:underline text-sm text-[#ad4e28]">
          Quay về trang chủ
        </Link>
        <p className="md:hidden">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-color hover:underline"
          >
            Đã có tài khoản?
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
