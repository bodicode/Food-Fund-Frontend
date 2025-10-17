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
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/auth-slice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type RegisterFormProps = {
  onSwitchToLogin?: () => void;
  authService: typeof graphQLAuthService;
};

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [step, setStep] = useState<"register" | "confirm">("register");
  const [emailForConfirm, setEmailForConfirm] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleGoogleRegister = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if (user) {
        toast.info("Bạn đã đăng nhập");
        router.push("/");
        return;
      }

      const token = credentialResponse.credential;
      if (!token) return;

      console.log("Google idToken:", token);

      const res = await graphQLAuthService.googleAuthentication({
        idToken: token,
      });

      const decoded = jwtDecode<DecodedIdToken>(res.idToken);

      if (!res.isNewUser) {
        toast.info("Tài khoản đã tồn tại, bạn đã được đăng nhập");

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

        Cookies.set("idToken", res.idToken, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("accessToken", res.accessToken, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refreshToken", res.refreshToken, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("role", (decoded["custom:role"] as string) || "DONOR", {
          secure: true,
          sameSite: "strict",
        });

        const role = decoded["custom:role"]?.toUpperCase();
        if (role === "ADMIN") router.push("/admin/users");
        else if (role === "KITCHEN") router.push("/kitchen");
        else if (role === "DELIVERY") router.push("/delivery");
        else router.push("/");
        return;
      }

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

      Cookies.set("idToken", res.idToken, { secure: true, sameSite: "strict" });
      Cookies.set("accessToken", res.accessToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", res.refreshToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("role", (decoded["custom:role"] as string) || "DONOR", {
        secure: true,
        sameSite: "strict",
      });

      toast.success("Đăng ký Google thành công", {
        description: `Chào ${decoded?.name || "bạn"}!`,
      });

      const role = decoded["custom:role"]?.toUpperCase();
      if (role === "ADMIN") router.push("/admin/users");
      else if (role === "KITCHEN") router.push("/kitchen");
      else if (role === "DELIVERY") router.push("/delivery");
      else router.push("/");
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

      <CardContent className="space-y-4">
        {step === "register" ? (
          <RegisterStep
            authService={graphQLAuthService}
            onSuccess={(email) => {
              setEmailForConfirm(email);
              setStep("confirm");
            }}
          />
        ) : (
          <ConfirmStep
            authService={graphQLAuthService}
            email={emailForConfirm}
            onSuccess={() => onSwitchToLogin?.()}
          />
        )}

        {step === "register" && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm" />
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
          </>
        )}
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
