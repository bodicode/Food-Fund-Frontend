"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "../animate-ui/icons/loader";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/auth-slice";
import { graphQLAuthService } from "../../services/auth.service";
import { translateError, translateMessage } from "../../lib/translator";
import { SignInInput } from "../../types/api/sign-in";
import { decodeIdToken } from "../../lib/jwt-utils";
import Cookies from "js-cookie";
import { USER_ROLES, ROUTES, COOKIE_NAMES } from "../../constants";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Home, ArrowRight } from "lucide-react";

type LoginFormProps = {
  onSwitchToRegister?: () => void;
};

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          idToken: signInRes.idToken,
          expiresIn: signInRes.expiresIn,
        })
      );

      const role = decoded["custom:role"]?.toUpperCase();
      if (role === USER_ROLES.ADMIN) router.push("/admin");
      else if (role === USER_ROLES.KITCHEN) router.push(ROUTES.KITCHEN);
      else if (role === USER_ROLES.DELIVERY) router.push(ROUTES.DELIVERY);
      else router.push(ROUTES.HOME);

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

      const res = await graphQLAuthService.googleAuthentication({
        idToken: token,
      });

      const decoded = decodeIdToken(res.idToken);
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
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          idToken: res.idToken,
          expiresIn: res.expiresIn,
        })
      );

      const role = decoded["custom:role"]?.toUpperCase();
      if (role === USER_ROLES.ADMIN) router.push("/admin/users");
      else if (role === USER_ROLES.KITCHEN) router.push(ROUTES.KITCHEN);
      else if (role === USER_ROLES.DELIVERY) router.push(ROUTES.DELIVERY);
      else router.push(ROUTES.HOME);

      toast.success("Đăng nhập Google thành công", {
        description: `Chào ${decoded?.name || "bạn"}`,
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Đăng nhập Google thất bại!", {
        description: translateError(error),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
      className="w-full"
    >
      <div className="w-full space-y-6">
        <div className="text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-black tracking-tighter"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ad4e28] via-[#d76c42] to-[#ad4e28] bg-[length:200%_auto] animate-gradient-slow">
              Chào mừng trở lại
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-base md:text-lg font-medium tracking-tight max-w-2xl mx-auto"
          >
            TIẾP TỤC HÀNH TRÌNH CHIA SẺ VÀ LAN TỎA YÊU THƯƠNG TRONG CỘNG ĐỒNG
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group/input"
            >
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
                <Mail className="h-6 w-6" />
              </div>
              <Input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-16 h-18 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[2rem] text-lg placeholder:text-gray-300 font-medium border-2"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="relative group/input">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-[#ad4e28] transition-all duration-300 z-10">
                  <Lock className="h-6 w-6" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-16 pr-16 h-18 bg-white/50 border-gray-200 focus:bg-white focus:border-[#ad4e28]/40 focus:ring-8 focus:ring-[#ad4e28]/5 transition-all duration-500 rounded-[2rem] text-lg placeholder:text-gray-300 font-medium border-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ad4e28] transition-all duration-300 z-10"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </button>
              </div>
              <div className="flex justify-end pr-2">
                <Link
                  href="/forgot-password"
                  className="text-sm font-bold text-[#ad4e28] hover:text-[#8f4021] hover:underline transition-all duration-300 tracking-tight"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full h-18 font-black text-xl bg-[#ad4e28] hover:bg-[#8f4021] text-white shadow-xl shadow-[#ad4e28]/20 rounded-[2rem] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader animate loop className="h-7 w-7" />
                  <span>XÁC THỰC...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-3 uppercase tracking-widest text-lg">
                  Đăng nhập
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative py-2"
        >
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.4em]">
            <span className="bg-[#f9f0e4] px-10 text-gray-400 font-bold">
              Hoặc kết nối qua
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Đăng nhập Google thất bại!")}
            shape="pill"
            theme="outline"
            text="signin_with"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-6 flex flex-col items-center gap-4"
        >
          <p className="text-gray-500 font-medium text-lg">
            Chưa có tài khoản?{" "}
            <Button
              type="button"
              onClick={onSwitchToRegister}
              variant="link"
              className="p-0 h-auto font-black text-[#ad4e28] hover:text-[#8f4021] text-lg transition-all"
            >
              TẠO NGAY
            </Button>
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-[#ad4e28] transition-all duration-300 group uppercase tracking-widest"
          >
            <Home className="w-5 h-5" />
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
