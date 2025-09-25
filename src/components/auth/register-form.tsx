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

type RegisterFormProps = {
  onSwitchToLogin?: () => void;
  authService: typeof graphQLAuthService;
};

export default function RegisterForm({
  onSwitchToLogin,
  authService,
}: RegisterFormProps) {
  const [step, setStep] = useState<"register" | "confirm">("register");
  const [emailForConfirm, setEmailForConfirm] = useState("");

  return (
    <Card className="bg-transparent border-none shadow-none text-black w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-[#ad4e28]">
          {step === "register" ? "Đăng ký tài khoản" : "Xác thực tài khoản"}
        </CardTitle>
      </CardHeader>

      <CardContent>
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
