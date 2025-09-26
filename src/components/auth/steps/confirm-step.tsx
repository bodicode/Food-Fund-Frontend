"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "@/components/animate-ui/icons/loader";
import { translateError, translateMessage } from "@/lib/translator";
import { AuthService } from "@/services/auth.service";

type Props = {
  email: string;
  authService: AuthService & {
    resendConfirmCode: (input: {
      email: string;
    }) => Promise<{ emailSent: boolean; message: string }>;
  };
  onSuccess: () => void;
};

export function ConfirmStep({ email, authService, onSuccess }: Props) {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmationCode.trim()) {
      toast.error("Vui lòng nhập mã xác nhận");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.confirmSignup({
        email,
        confirmationCode,
      });

      if (res.confirmed) {
        toast.success("Xác nhận thành công", {
          description: translateMessage(res.message),
        });
        onSuccess();
      } else {
        toast.error("Xác nhận thất bại", {
          description: translateMessage(res.message),
        });
      }
    } catch (err) {
      toast.error("Đăng ký thất bại", { description: translateError(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await authService.resendConfirmCode({ email });

      if (res.emailSent) {
        toast.success("Mã xác nhận đã được gửi lại", {
          description: translateMessage(res.message),
        });
      } else {
        toast.error("Không gửi được mã xác nhận", {
          description: translateMessage(res.message),
        });
      }
    } catch (err) {
      toast.error("Gửi lại thất bại", { description: translateError(err) });
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleConfirm} className="flex flex-col space-y-4">
      <p className="text-gray-600 text-sm">
        Vui lòng nhập mã xác nhận được gửi tới email{" "}
        <span className="font-semibold">{email}</span>
      </p>

      <Input
        type="text"
        placeholder="Mã xác nhận"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        className="w-full bg-white border border-[#ad4e28]/30 text-black"
      />

      <Button
        type="submit"
        disabled={loading}
        className="font-semibold rounded-lg py-2 btn-color"
      >
        {loading ? <Loader animate loop className="h-5 w-5" /> : "Xác nhận"}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={resending}
        onClick={handleResend}
        className="font-semibold rounded-lg py-2 border-[#ad4e28] text-[#ad4e28] hover:bg-[#ad4e28] hover:text-white"
      >
        {resending ? (
          <Loader animate loop className="h-5 w-5" />
        ) : (
          "Gửi lại mã xác nhận"
        )}
      </Button>
    </form>
  );
}
