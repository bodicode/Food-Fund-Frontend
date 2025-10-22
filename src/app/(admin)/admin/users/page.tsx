"use client";

import { useEffect, useState } from "react";
import { translateRole } from "@/lib/translator";
import { userService } from "@/services/user.service";
import { UserProfile } from "@/types/api/user";
import EditUserModal from "@/components/admin/EditUserModal";
import { Edit } from "lucide-react";

export default function TeamPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await userService.getAllUsers(10, 0);
        if (mounted) setUsers(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Danh sách người dùng
      </h1>

      <div
        className="
      w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
      >
        <table className=" w-full border-collapse">
          <thead>
            <tr>
              {[
                "ID",
                "Họ và Tên",
                "Username",
                "Email",
                "Số điện thoại",
                "Vai trò",
                "Ngày tạo",
                "Kích hoạt",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="
                    sticky top-0 z-10
          text-left text-gray-700 dark:text-gray-200 
          text-sm font-semibold whitespace-nowrap px-4 py-3
          bg-gray-200 dark:bg-[#334155] shadow-sm
                  "
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-sm" colSpan={9}>
                  Đang tải...
                </td>
              </tr>
            ) : (
              users.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`
                    border-t border-gray-200 dark:border-gray-700 
                    text-gray-800 dark:text-gray-100 
                    hover:bg-gray-50 dark:hover:bg-slate-800
                    ${
                      idx % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-gray-50/70 dark:bg-slate-800/40"
                    }
                  `}
                >
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {u.id}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {u.full_name}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {u.user_name}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {u.phone_number || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium
                        ${
                          u.role === "ADMIN"
                            ? "bg-green-500 text-white dark:bg-green-700"
                            : u.role === "DONOR"
                            ? "bg-blue-500 text-white dark:bg-blue-700"
                            : u.role === "KITCHEN"
                            ? "bg-orange-500 text-white dark:bg-orange-700"
                            : u.role === "DELIVERY"
                            ? "bg-purple-500 text-white dark:bg-purple-700"
                            : "bg-yellow-500 text-white dark:bg-yellow-700"
                        }`}
                    >
                      {translateRole(u.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {u.is_active ? "✓" : "✗"}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                        text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
                        bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50
                        rounded-lg transition-colors"
                    >
                      <Edit size={14} />
                      Sửa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSuccess={(updatedUser) => {
            setUsers((prev) =>
              prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
          }}
        />
      )}
    </div>
  );
}
