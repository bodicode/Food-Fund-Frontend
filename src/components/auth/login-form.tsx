"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/animate-ui/icons/loader";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/auth-slice";
import { graphQLAuthService } from "@/services/auth.service";
import { translateError, translateMessage } from "@/lib/translator";
import { SignInInput } from "@/types/api/sign-in";
import { decodeIdToken } from "@/lib/jwt-utils";
import Cookies from "js-cookie";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

type LoginFormProps = {
  onSwitchToRegister?: () => void;
};


export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signInRes = await graphQLAuthService.login({
        email,
        password,
      } as SignInInput);

      const decoded = decodeIdToken(signInRes.idToken);
      if (!decoded?.sub)
        throw new Error("Không thể xác định người dùng từ token");

      dispatch(
        setCredentials({
          user: {
            id: decoded.sub!,
            name: decoded.name || "",
            email: decoded.email || "",
            role: decoded["custom:role"],
          },
          accessToken: signInRes.accessToken,
          refreshToken: signInRes.refreshToken,
        })
      );

      Cookies.set("idToken", signInRes.idToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("role", decoded["custom:role"] || "DONOR", {
        secure: true,
        sameSite: "strict",
      });

      const role = decoded["custom:role"]?.toUpperCase();
      if (role === "ADMIN") router.push("/admin/users");
      else if (role === "KITCHEN") router.push("/kitchen");
      else if (role === "DELIVERY") router.push("/delivery");
      else router.push("/");

      toast.success("Đăng nhập thành công", {
        description: translateMessage(`Chào mừng ${decoded?.name || email}`),
      });
    } catch (err: unknown) {
      toast.error("Lỗi đăng nhập", { description: translateError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return;

      console.log("Google idToken:", token);

      const res = await graphQLAuthService.googleAuthentication({ idToken: token });

      const decoded = decodeIdToken(res.idToken);
      if (!decoded?.sub) throw new Error("Không thể xác định người dùng từ token");

      dispatch(
        setCredentials({
          user: {
            id: decoded.sub!,
            name: decoded.name || "",
            email: decoded.email || "",
            role: decoded["custom:role"],
          },
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );

      Cookies.set("idToken", res.idToken, { secure: true, sameSite: "strict" });
      Cookies.set("accessToken", res.accessToken, { secure: true, sameSite: "strict" });
      Cookies.set("refreshToken", res.refreshToken, { secure: true, sameSite: "strict" });
      Cookies.set("role", decoded["custom:role"] || "DONOR", { secure: true, sameSite: "strict" });

      const role = decoded["custom:role"]?.toUpperCase();
      if (role === "ADMIN") router.push("/admin/users");
      else if (role === "KITCHEN") router.push("/kitchen");
      else if (role === "DELIVERY") router.push("/delivery");
      else router.push("/");

      toast.success("Đăng nhập Google thành công", {
        description: `Chào ${decoded?.name || "bạn"}`,
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Đăng nhập Google thất bại!", { description: translateError(error) });
    }
  };

  return (
    <Card className="bg-transparent border-none shadow-none text-black w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-[#ad4e28]">
          Đăng nhập
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28]"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="font-semibold rounded-lg py-2 btn-color"
          >
            {loading ? (
              <Loader animate loop className="h-5 w-5" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Đăng nhập Google thất bại!")}
            shape="pill"
            text="signin_with"
            size="large"
            theme="outline"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 text-sm text-[#ad4e28] items-center">
        <div className="flex justify-between w-full">
          <Link href="/forgot-password" className="hover:underline">
            Quên mật khẩu
          </Link>
          <Link href="/" className="hover:underline">
            Quay về trang chủ
          </Link>
        </div>

        <p className="text-center md:hidden">
          Chưa có tài khoản?{" "}
          <Button
            type="button"
            onClick={onSwitchToRegister}
            className="text-color bg-transparent border-none shadow-none p-0 hover:bg-transparent font-semibold hover:underline"
          >
            Đăng ký ngay
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
