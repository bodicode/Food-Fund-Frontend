export function CampaignsTab() {
  const campaigns = [
    {
      id: 1,
      title: "Bữa trưa ấm nóng cho học sinh đảo Bé",
      status: "Đang gây quỹ",
      amount: 12000000,
    },
    {
      id: 2,
      title: "Xây bếp ăn cho trẻ em vùng cao",
      status: "Hoàn thành",
      amount: 30000000,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#ad4e28]">
        Chiến dịch của tôi
      </h2>
      <ul className="divide-y divide-gray-200">
        {campaigns.map((c) => (
          <li key={c.id} className="py-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.status}</p>
            </div>
            <p className="font-bold text-[#ad4e28]">
              {c.amount.toLocaleString("vi-VN")} đ
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
