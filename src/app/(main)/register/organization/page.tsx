"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Building2, Mail, Phone, Globe, User, MapPin, Briefcase, FileText, ChefHat, Truck } from "lucide-react";

type Staff = {
    name: string;
    email: string;
};

export default function OrgRegisterForm() {
    const [form, setForm] = useState({
        orgName: "",
        sector: "",
        address: "",
        representative: "",
        orgEmail: "",
        phone: "",
        website: "",
        description: "",
        agree: false,
    });

    const [kitchenStaff, setKitchenStaff] = useState<Staff[]>([{ name: "", email: "" }]);
    const [deliveryStaff, setDeliveryStaff] = useState<Staff[]>([{ name: "", email: "" }]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target;
        const { name } = target;

        let value: string | boolean = target.value;
        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            value = target.checked;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStaffChange = (
        index: number,
        field: keyof Staff,
        value: string,
        type: "kitchen" | "delivery"
    ) => {
        if (type === "kitchen") {
            const newList = [...kitchenStaff];
            newList[index][field] = value;
            setKitchenStaff(newList);
        } else {
            const newList = [...deliveryStaff];
            newList[index][field] = value;
            setDeliveryStaff(newList);
        }
    };

    const handleAddStaff = (type: "kitchen" | "delivery") => {
        const newStaff = { name: "", email: "" };
        if (type === "kitchen") {
            setKitchenStaff([...kitchenStaff, newStaff]);
        } else {
            setDeliveryStaff([...deliveryStaff, newStaff]);
        }
    };

    const handleRemoveStaff = (index: number, type: "kitchen" | "delivery") => {
        if (type === "kitchen") {
            setKitchenStaff(kitchenStaff.filter((_, i) => i !== index));
        } else {
            setDeliveryStaff(deliveryStaff.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form:", form);
        console.log("Kitchen Staff:", kitchenStaff);
        console.log("Delivery Staff:", deliveryStaff);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-30 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
                        <Building2 className="h-12 w-12 text-orange-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-color mb-3">
                        Đăng Ký Tổ Chức
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Trở thành đối tác của FoodFund và lan tỏa yêu thương
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-2xl p-8 space-y-8"
                >
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="h-1 w-12 bg-brown-color rounded"></div>
                            <h2 className="text-2xl font-bold text-color">Thông Tin Tổ Chức</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    name="orgName"
                                    value={form.orgName}
                                    onChange={handleChange}
                                    placeholder="Tên tổ chức"
                                    className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    name="sector"
                                    value={form.sector}
                                    onChange={handleChange}
                                    placeholder="Lĩnh vực hoạt động"
                                    className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Địa chỉ liên hệ"
                                className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="representative"
                                value={form.representative}
                                onChange={handleChange}
                                placeholder="Người đại diện pháp lý"
                                className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="email"
                                    name="orgEmail"
                                    value={form.orgEmail}
                                    onChange={handleChange}
                                    placeholder="Email tổ chức"
                                    className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Số điện thoại"
                                    className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                placeholder="Website / Fanpage (tuỳ chọn)"
                                className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Mô tả ngắn gọn về tổ chức và hoạt động của bạn..."
                                className="pl-10 pt-3 min-h-[120px] border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="h-1 w-12 bg-brown-color rounded"></div>
                            <ChefHat className="h-6 w-6 text-color" />
                            <h2 className="text-2xl font-bold text-color">Nhân Viên Bếp</h2>
                        </div>

                        <div className="space-y-3">
                            {kitchenStaff.map((staff, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative p-5 border-2 border-orange-100 rounded-xl bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-all"
                                >
                                    <div className="absolute top-3 right-3 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                                        #{index + 1}
                                    </div>
                                    <div className="space-y-3 mt-2">
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Họ và tên nhân viên bếp"
                                                value={staff.name}
                                                onChange={(e) => handleStaffChange(index, "name", e.target.value, "kitchen")}
                                                className="pl-10 h-11 bg-white border-gray-200"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="relative flex-1">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="email"
                                                    placeholder="Email nhân viên"
                                                    value={staff.email}
                                                    onChange={(e) => handleStaffChange(index, "email", e.target.value, "kitchen")}
                                                    className="pl-10 h-11 bg-white border-gray-200"
                                                    required
                                                />
                                            </div>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveStaff(index, "kitchen")}
                                                    className="hover:bg-red-50 h-11 w-11"
                                                >
                                                    <Trash2 className="h-5 w-5 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleAddStaff("kitchen")}
                            className="w-full border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 h-12"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Thêm nhân viên bếp
                        </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="h-1 w-12 bg-brown-color rounded"></div>
                            <Truck className="h-6 w-6 text-color" />
                            <h2 className="text-2xl font-bold text-color">Nhân Viên Vận Chuyển</h2>
                        </div>

                        <div className="space-y-3">
                            {deliveryStaff.map((staff, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative p-5 border-2 border-amber-100 rounded-xl bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition-all"
                                >
                                    <div className="absolute top-3 right-3 bg-amber-100 text-amber-600 text-xs font-bold px-2 py-1 rounded-full">
                                        #{index + 1}
                                    </div>
                                    <div className="space-y-3 mt-2">
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Họ và tên nhân viên vận chuyển"
                                                value={staff.name}
                                                onChange={(e) => handleStaffChange(index, "name", e.target.value, "delivery")}
                                                className="pl-10 h-11 bg-white border-gray-200"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="relative flex-1">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="email"
                                                    placeholder="Email nhân viên"
                                                    value={staff.email}
                                                    onChange={(e) => handleStaffChange(index, "email", e.target.value, "delivery")}
                                                    className="pl-10 h-11 bg-white border-gray-200"
                                                    required
                                                />
                                            </div>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveStaff(index, "delivery")}
                                                    className="hover:bg-red-50 h-11 w-11"
                                                >
                                                    <Trash2 className="h-5 w-5 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleAddStaff("delivery")}
                            className="w-full border-2 border-dashed border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400 h-12"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Thêm nhân viên vận chuyển
                        </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6 pt-4">
                        <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={handleChange}
                                className="mt-1 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                required
                            />
                            <label className="text-sm text-gray-700 leading-relaxed">
                                Tôi cam kết rằng tất cả thông tin được cung cấp là chính xác và đồng ý với{" "}
                                <span className="font-semibold text-orange-600">điều khoản sử dụng</span> của FoodFund.
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                        >
                            Gửi Đăng Ký
                        </Button>
                    </motion.div>
                </motion.form>
            </div>
        </div>
    );
}