"use client";

import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight
} from "lucide-react";
import React from "react";

import "../globals.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    type: "individual",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert("Cảm ơn bạn! Chúng tôi đã nhận được thông tin và sẽ phản hồi sớm nhất có thể.");
  };

  return (
    <div className="min-h-screen bg-[#fefcf8] relative overflow-hidden flex items-center justify-center py-20">
      {/* Background Mesh/Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#E77731]/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-24 w-[600px] h-[600px] bg-[#ad4e28]/5 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.2]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Left Column: Content & Info */}
          <div className="lg:w-5/12 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E77731]/10 text-[#E77731] text-xs font-bold tracking-wider uppercase mb-6">
                <MessageSquare className="w-3.5 h-3.5" />
                Liên hệ với chúng tôi
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                Hãy cùng nhau <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E77731] to-[#ad4e28]">kết nối</span> để lan tỏa yêu thương
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Bạn có thắc mắc về Food Fund? Cần hỗ trợ tạo chiến dịch hoặc muốn hợp tác?
                Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong vòng 2 giờ làm việc.
              </p>
            </motion.div>

            {/* Contact Details Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Mail, label: "Email", value: "support@foodfund.vn", color: "bg-blue-50 text-blue-600" },
                { icon: Phone, label: "Hotline", value: "1900 123 456", color: "bg-green-50 text-green-600" },
                { icon: MapPin, label: "Địa chỉ", value: "TP. Hồ Chí Minh, Việt Nam", color: "bg-red-50 text-red-600" },
                { icon: Heart, label: "Cộng đồng", value: "Hơn 10k+ tình nguyện viên", color: "bg-pink-50 text-pink-600" },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.5 }}
                  className="p-5 rounded-2xl bg-white/50 border border-white/60 shadow-sm backdrop-blur-sm group hover:border-[#E77731]/30 transition-all hover:shadow-md"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</h4>
                  <p className="text-sm font-bold text-gray-800">{item.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6"
            >
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Theo dõi:</p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#E77731] hover:text-white hover:border-[#E77731] transition-all transform hover:-translate-y-1">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:w-7/12 w-full"
          >
            <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-gray-50">
              <div className="absolute top-0 right-0 p-8">
                <Send className="w-12 h-12 text-[#E77731]/5 -rotate-12" />
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Họ</label>
                    <Input
                      name="firstName"
                      placeholder="Nguyễn"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="h-14 bg-gray-50/50 border-gray-100 focus-visible:ring-[#E77731] focus-visible:border-[#E77731] rounded-2xl px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tên</label>
                    <Input
                      name="lastName"
                      placeholder="Văn An"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="h-14 bg-gray-50/50 border-gray-100 focus-visible:ring-[#E77731] focus-visible:border-[#E77731] rounded-2xl px-6"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="an.nguyen@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="h-14 bg-gray-50/50 border-gray-100 focus-visible:ring-[#E77731] focus-visible:border-[#E77731] rounded-2xl px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="0912 345 678"
                      value={form.phone}
                      onChange={handleChange}
                      className="h-14 bg-gray-50/50 border-gray-100 focus-visible:ring-[#E77731] focus-visible:border-[#E77731] rounded-2xl px-6"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Bạn là người ủng hộ hay tổ chức gây quỹ?</label>
                  <RadioGroup
                    value={form.type}
                    onValueChange={(value) => setForm({ ...form, type: value })}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    <label className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${form.type === 'individual' ? 'border-[#E77731] bg-[#E77731]/5' : 'border-gray-50 bg-gray-50 group hover:border-gray-200'}`}>
                      <RadioGroupItem value="individual" className="sr-only" />
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${form.type === 'individual' ? 'border-[#E77731] bg-white' : 'border-gray-300'}`}>
                        {form.type === 'individual' && <div className="w-2.5 h-2.5 rounded-full bg-[#E77731]" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">Người ủng hộ</div>
                        <div className="text-[10px] text-gray-500 font-medium">Muốn đóng góp cho cộng đồng</div>
                      </div>
                    </label>
                    <label className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${form.type === 'organization' ? 'border-[#E77731] bg-[#E77731]/5' : 'border-gray-50 bg-gray-50 group hover:border-gray-200'}`}>
                      <RadioGroupItem value="organization" className="sr-only" />
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${form.type === 'organization' ? 'border-[#E77731] bg-white' : 'border-gray-300'}`}>
                        {form.type === 'organization' && <div className="w-2.5 h-2.5 rounded-full bg-[#E77731]" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">Tổ chức gây quỹ</div>
                        <div className="text-[10px] text-gray-500 font-medium">Tạo và quản lý các sứ mệnh</div>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tin nhắn của bạn</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Hãy cho chúng tôi biết bạn cần hỗ trợ điều gì..."
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border-gray-100 focus:ring-[#E77731] focus:border-[#E77731] rounded-2xl px-6 py-4 transition-all resize-none border focus-visible:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-2xl bg-[#E77731] hover:bg-[#d16629] text-white font-bold text-lg shadow-[0_10px_20px_-5px_rgba(231,119,49,0.4)] transition-all transform active:scale-[0.98] group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Gửi thông tin cho Food Fund
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
