"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import { CONFIRM_SIGNUP_MUTATION } from "@/graphql/mutations/auth/confirm-signup";
import type { ConfirmSignUpInput, ConfirmSignUpResponse } from "@/types/api/sign-up";

export default function ConfirmSignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const [confirmSignup] = useMutation<
    ConfirmSignUpResponse,
    { confirmSignUpInput2: ConfirmSignUpInput }
  >(CONFIRM_SIGNUP_MUTATION);

  useEffect(() => {
    const code = searchParams.get("code");
    const email = searchParams.get("email");

    if (!code || !email) {
      setStatus("error");
      return;
    }

    (async () => {
      try {
        console.log("Attempting to confirm signup with:", { code, email });

        const { data } = await confirmSignup({
          variables: {
            confirmSignUpInput2: {
              confirmationCode: code,
              email: email,
            },
          },
        });

        console.log("Confirm signup response:", data);

        if (data?.confirmSignUp?.confirmed) {
          setStatus("success");
          toast.success(data.confirmSignUp.message || "Kích hoạt tài khoản thành công!");
          setTimeout(() => router.push("/login"), 1500);
        } else {
          throw new Error(data?.confirmSignUp?.message || "Kích hoạt thất bại");
        }
      } catch (err) {
        console.error("Confirm signup error:", err);
        setStatus("error");
        toast.error("Liên kết không hợp lệ hoặc đã hết hạn.");
      }
    })();
  }, [searchParams, confirmSignup]);

  return (
    <div className="flex items-center justify-center h-screen">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-2">
          <Loader />
          <p className="text-gray-600">Đang kích hoạt tài khoản của bạn...</p>
        </div>
      )}
      {status === "success" && (
        <p className="text-green-600 font-medium">✅ Tài khoản của bạn đã được kích hoạt!</p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-medium">❌ Liên kết kích hoạt không hợp lệ hoặc đã hết hạn.</p>
      )}
    </div>
  );
}
