"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    employees: "solo",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã gửi thông tin!");
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form bên trái */}
      <motion.div
        className="lg:w-1/2 p-8 lg:px-16 lg:pt-32 bg-white flex flex-col justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <h1 className="text-3xl font-bold mb-2 text-color">
          Liên hệ với FoodFund
        </h1>
        <p className="text-gray-600 mb-8">
          Bạn có thắc mắc về nền tảng gây quỹ thực phẩm FoodFund? Cần hỗ trợ tạo
          chiến dịch hoặc quản lý đóng góp? Hãy liên hệ với chúng tôi, và chúng
          tôi sẽ phản hồi trong vòng 2 giờ.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Input
              name="firstName"
              placeholder="Họ"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <Input
              name="lastName"
              placeholder="Tên"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div className="flex gap-2 items-center">
            <Input
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              type="tel"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium">
              Bạn là cá nhân hay đại diện tổ chức?
            </label>

            <RadioGroup
              value={form.employees}
              onValueChange={(value) => setForm({ ...form, employees: value })}
              className="flex flex-col gap-2"
            >
              <label className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer">
                <RadioGroupItem value="solo" />
                <div>
                  <div>Tôi là cá nhân</div>
                  <div className="text-xs text-gray-500">
                    Tôi muốn tạo một chiến dịch cá nhân.
                  </div>
                </div>
              </label>
              <label className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer">
                <RadioGroupItem value="team" />
                <div>
                  <div>Tôi đại diện tổ chức</div>
                  <div className="text-xs text-gray-500">
                    Tôi muốn quản lý các chiến dịch cho nhóm hoặc cộng đồng.
                  </div>
                </div>
              </label>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full mt-6 btn-color">
            Liên hệ FoodFund
          </Button>
        </form>
      </motion.div>

      {/* Hình bên phải */}
      <motion.div
        className="lg:w-1/2 relative flex items-center justify-center p-8 lg:p-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <Image
            fill
            src="/images/contact.jpg"
            alt="Đội ngũ FoodFund"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25"></div>
        </div>

        <motion.div
          className="relative text-center text-white z-10 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="font-semibold text-lg">
            FoodFund giúp các cộng đồng tiếp cận và phân phối thực phẩm một cách
            hiệu quả. Nền tảng của chúng tôi đơn giản hóa việc quyên góp, theo
            dõi và quản lý logistics cho các tổ chức từ thiện và sáng kiến địa
            phương.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
