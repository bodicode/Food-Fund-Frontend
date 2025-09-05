"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  return (
    <Card className="bg-transparent border-none shadow-none text-black w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-[#ad4e28]">
          Đăng nhập
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <Input
          type="text"
          placeholder="Tên đăng nhập"
          className="bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28]"
        />
        <Input
          type="password"
          placeholder="Mật khẩu"
          className="bg-white border border-[#ad4e28]/30 text-black placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-[#ad4e28]"
        />
        <Button
          type="submit"
          className="bg-[#ad4e28] hover:bg-[#8c3e1f] text-white font-semibold rounded-lg py-2 cursor-pointer"
        >
          Đăng nhập
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-[#ad4e28]">
        <Link href="#" className="hover:underline">
          Quên mật khẩu
        </Link>
        <Link href="/" className="hover:underline text-sm text-[#ad4e28]">
          Quay về trang chủ
        </Link>
      </CardFooter>
    </Card>
  );
}
