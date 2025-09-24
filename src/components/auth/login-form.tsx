"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
import { authService } from "@/services/auth.service";
import { SignInInput } from "@/types";

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
      const signIn = await authService.login({
        email,
        password,
      } as SignInInput);

      dispatch(
        setCredentials({
          user: signIn.user,
          accessToken: signIn.accessToken,
          refreshToken: signIn.refreshToken,
        })
      );

      toast.success("Đăng nhập thành công 🎉", {
        description: `Chào mừng ${signIn.user.name}`,
      });

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message?.includes("Incorrect username or password")
        ? "Incorrect username or password."
        : "Sai email hoặc mật khẩu. Vui lòng thử lại.";

      toast.error("Lỗi đăng nhập", {
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-transparent border-none shadow-none text-black w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-[#ad4e28]">
          Đăng nhập
        </CardTitle>
      </CardHeader>

      <CardContent>
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
              className="w-full bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28] pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-[#ad4e28] hover:text-[#8c3e1f] hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
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
            className="text-[#ad4e28] font-semibold hover:underline"
          >
            Đăng ký ngay
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
