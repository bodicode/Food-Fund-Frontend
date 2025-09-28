"use client";

import StoryCard from "@/components/article-card";

const articles = [
  {
    id: 1,
    title: "3 thế kỷ trồng cây vì Trường Sa Xanh",
    excerpt:
      "Chỉ có một số cây dừa trên đảo Nam Yết và vài gốc bàng vuông cổ thụ trên những đảo lớn...",
    image: "/images/what-we-do-1.jpg",
    date: "16 Thg 06, 2025",
  },
  {
    id: 2,
    title:
      "Sau vụ 16,7 tỷ đồng từ thiện, MBBank lên tiếng: 'Mong người dùng chủ động báo cáo hành vi...'",
    excerpt: "Ngân hàng kêu gọi cộng đồng cùng giám sát và phản ánh...",
    image: "/images/what-we-do-2.jpg",
    date: "04 Thg 03, 2025",
  },
  {
    id: 3,
    title: "Cộng đồng HiGreen chung tay - Biển bờ kề bên",
    excerpt: "Hoạt động thiện nguyện hướng về trẻ em vùng biển khó khăn...",
    image: "/images/what-we-do-2.jpg",
    date: "18 Thg 06, 2024",
  },
  {
    id: 4,
    title:
      "Nền tảng Thiện nguyện của MB được vinh danh tại Human Act Prize 2023",
    excerpt:
      "App Thiện nguyện được ví như liều thuốc hóa giải 'nỗi đau' của xã hội",
    image: "/images/what-we-do-1.jpg",
    date: "13 Thg 12, 2023",
  },
  {
    id: 5,
    title: "Thử thách chạy bộ HiGreen",
    excerpt:
      "Người tham gia cùng các tổ chức xã hội cải tạo 10 bãi rác thành các sân chơi sinh thái...",
    image: "/images/what-we-do-2.jpg",
    date: "28 Thg 10, 2023",
  },
  {
    id: 6,
    title: "MB Mastercard Hi Green - Thẻ ngân hàng xanh vì tương lai bền vững",
    excerpt:
      "Ngân hàng TMCP Quân Đội kết hợp với Mastercard ra mắt thẻ MB Hi Green...",
    image: "/images/what-we-do-1.jpg",
    date: "10 Thg 04, 2024",
  },
  {
    id: 7,
    title:
      "Nền tảng Thiện nguyện của MB được vinh danh tại Human Act Prize 2023",
    excerpt:
      "App Thiện nguyện được ví như liều thuốc hóa giải 'nỗi đau' của xã hội",
    image: "/images/what-we-do-1.jpg",
    date: "11 Thg 11, 2023",
  },
  {
    id: 8,
    title: "Thử thách chạy bộ HiGreen",
    excerpt:
      "Người tham gia cùng các tổ chức xã hội cải tạo 10 bãi rác thành các sân chơi sinh thái...",
    image: "/images/what-we-do-2.jpg",
    date: "22 Thg 07, 2024",
  },
  {
    id: 9,
    title: "MB Mastercard Hi Green - Thẻ ngân hàng xanh vì tương lai bền vững",
    excerpt:
      "Ngân hàng TMCP Quân Đội kết hợp với Mastercard ra mắt thẻ MB Hi Green...",
    image: "/images/what-we-do-1.jpg",
    date: "09 Thg 02, 2024",
  },
  {
    id: 10,
    title:
      "Nền tảng Thiện nguyện của MB được vinh danh tại Human Act Prize 2023",
    excerpt:
      "App Thiện nguyện được ví như liều thuốc hóa giải 'nỗi đau' của xã hội",
    image: "/images/what-we-do-1.jpg",
    date: "11 Thg 11, 2023",
  },
  {
    id: 11,
    title: "Thử thách chạy bộ HiGreen",
    excerpt:
      "Người tham gia cùng các tổ chức xã hội cải tạo 10 bãi rác thành các sân chơi sinh thái...",
    image: "/images/what-we-do-2.jpg",
    date: "22 Thg 07, 2024",
  },
  {
    id: 12,
    title: "MB Mastercard Hi Green - Thẻ ngân hàng xanh vì tương lai bền vững",
    excerpt:
      "Ngân hàng TMCP Quân Đội kết hợp với Mastercard ra mắt thẻ MB Hi Green...",
    image: "/images/what-we-do-1.jpg",
    date: "09 Thg 02, 2024",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-6 pt-24 pb-16">
      <div className="grid lg:grid-cols-3 gap-6 mb-16">
        <div className="lg:col-span-2 h-full">
          <StoryCard
            id={articles[0].id}
            title={articles[0].title}
            excerpt={articles[0].excerpt}
            image={articles[0].image}
            date={articles[0].date}
            variant="large"
          />
        </div>

        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1">
            <StoryCard
              id={articles[1].id}
              title={articles[1].title}
              excerpt={articles[1].excerpt}
              image={articles[1].image}
              date={articles[1].date}
            />
          </div>
          <div className="flex-1">
            <StoryCard
              id={articles[2].id}
              title={articles[2].title}
              excerpt={articles[2].excerpt}
              image={articles[2].image}
              date={articles[2].date}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(3).map((a) => (
          <StoryCard
            key={a.id}
            id={a.id}
            title={a.title}
            excerpt={a.excerpt}
            image={a.image}
            date={a.date}
          />
        ))}
      </div>
    </div>
  );
}
