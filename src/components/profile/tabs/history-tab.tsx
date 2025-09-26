export function HistoryTab() {
  const donations = [
    {
      id: 1,
      campaign: "Ủng hộ miền Trung",
      date: "2025-09-10",
      amount: 500000,
    },
    {
      id: 2,
      campaign: "Xây trường học vùng cao",
      date: "2025-08-20",
      amount: 1000000,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#ad4e28]">Lịch sử ủng hộ</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Chiến dịch</th>
            <th className="p-3">Ngày</th>
            <th className="p-3">Số tiền</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id} className="border-b">
              <td className="p-3">{d.campaign}</td>
              <td className="p-3 text-gray-500">{d.date}</td>
              <td className="p-3 font-bold text-[#ad4e28]">
                {d.amount.toLocaleString("vi-VN")} đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
