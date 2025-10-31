"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "@/components/animate-ui/icons/loader";
import { toast } from "sonner";

export default function ConfirmSignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const code = searchParams.get("code");
    const email = searchParams.get("email");

    if (!code || !email) {
      setStatus("error");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_URL}/confirm-signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, email }),
        });

        if (!res.ok) throw new Error("Invalid response");
        setStatus("success");
        toast.success("Kích hoạt tài khoản thành công!");
        setTimeout(() => router.push("/login"), 1500);
      } catch (err) {
        setStatus("error");
        toast.error("Liên kết không hợp lệ hoặc đã hết hạn.");
      }
    })();
  }, [searchParams]);

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
