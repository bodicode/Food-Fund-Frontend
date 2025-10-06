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

type RegisterFormProps = {
  onSwitchToLogin?: () => void;
  authService: typeof graphQLAuthService;
};
interface GoogleJwtPayload {
  iss: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}


export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [step, setStep] = useState<"register" | "confirm">("register");
  const [emailForConfirm, setEmailForConfirm] = useState("");

  const router = useRouter()

  const handleGoogleRegister = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return;

      // Decode ID Token để lấy thông tin user
      const googleUser = jwtDecode<GoogleJwtPayload>(token);

      console.log("✅ Google user info:", googleUser);

      // Gửi token Google về backend của bạn để tạo tài khoản
      // const result = await graphQLAuthService.registerWithGoogle({ token });

      toast.success("Đăng ký Google thành công", {
        description: `Chào ${googleUser.name}!`,
      });

      router.push("/"); // redirect sau khi đăng ký thành công
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm" />
          </div>
        )}

        {step === "register" && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm" />
            </div>

            {/* ✅ Nút Google Login đồng nhất với LoginForm */}
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
