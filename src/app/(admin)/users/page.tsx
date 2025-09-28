"use client";

import { translateRole } from "@/lib/translator";
import { Shield, Heart, Utensils, Truck, Megaphone } from "lucide-react";

const teamData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "0905123456",
    email: "an.nguyen@foodfund.org",
    role: "ADMIN",
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    phone: "0934567890",
    email: "mai.tran@foodfund.org",
    role: "DONOR",
  },
  {
    id: 3,
    name: "Lê Quang Huy",
    phone: "0987654321",
    email: "huy.le@foodfund.org",
    role: "KITCHEN",
  },
  {
    id: 4,
    name: "Phạm Thùy Dung",
    phone: "0912345678",
    email: "dung.pham@foodfund.org",
    role: "DELIVERY",
  },
  {
    id: 5,
    name: "Hoàng Minh Tuấn",
    phone: "0978222333",
    email: "tuan.hoang@foodfund.org",
    role: "FUNDRAISER",
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "ADMIN":
      return <Shield className="w-4 h-4 inline-block mr-1" />;
    case "DONOR":
      return <Heart className="w-4 h-4 inline-block mr-1" />;
    case "KITCHEN":
      return <Utensils className="w-4 h-4 inline-block mr-1" />;
    case "DELIVERY":
      return <Truck className="w-4 h-4 inline-block mr-1" />;
    case "FUNDRAISER":
      return <Megaphone className="w-4 h-4 inline-block mr-1" />;
    default:
      return null;
  }
};

export default function TeamPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Đội ngũ FoodFund
      </h1>

      <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-[#1e293b]">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-[#334155] text-left text-gray-700 dark:text-gray-200">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Họ và Tên</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((member) => (
              <tr
                key={member.id}
                className="border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
              >
                <td className="px-4 py-3">{member.id}</td>
                <td className="px-4 py-3">{member.name}</td>
                <td className="px-4 py-3">{member.phone}</td>
                <td className="px-4 py-3">{member.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium
                      ${
                        member.role === "ADMIN"
                          ? "bg-green-500 text-white dark:bg-green-700"
                          : member.role === "DONOR"
                          ? "bg-blue-500 text-white dark:bg-blue-700"
                          : member.role === "KITCHEN"
                          ? "bg-orange-500 text-white dark:bg-orange-700"
                          : member.role === "DELIVERY"
                          ? "bg-purple-500 text-white dark:bg-purple-700"
                          : "bg-yellow-500 text-white dark:bg-yellow-700"
                      }`}
                  >
                    {getRoleIcon(member.role)}
                    {translateRole(member.role)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
