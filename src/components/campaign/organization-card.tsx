import Image from "next/image";

export function OrganizerCard({
  name,
  email,
  phone,
}: {
  name?: string;
  email?: string;
  phone?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Người vận động</h3>
      <div className="flex items-center gap-3">
        <Image
          src="/images/avatar.webp"
          alt={name || "Người vận động"}
          width={48}
          height={48}
          className="rounded-full border"
        />
        <div className="text-sm">
          <p className="font-medium">{name || "Người vận động"}</p>
          {email && <p className="text-gray-600">{email}</p>}
          {phone && <p className="text-gray-600">{phone}</p>}
        </div>
      </div>
    </div>
  );
}
