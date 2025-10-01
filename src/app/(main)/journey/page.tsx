"use client";

import { motion } from "framer-motion";
import StoryCard from "@/components/shared/article-card";

const stories = [
  {
    id: 1,
    title: "Suất cơm nghĩa tình tại bệnh viện Quận 8 Thành phố Hồ Chí Minh",
    excerpt:
      "Mỗi ngày, hàng trăm bệnh nhân nghèo được hỗ trợ những suất cơm nóng hổi...",
    content:
      "Chi tiết: Từ những tấm lòng hảo tâm, nhóm tình nguyện viên đã phát hơn 500 suất cơm mỗi tuần cho bệnh nhân nghèo, mang lại niềm tin và động lực cho họ trong hành trình chữa bệnh.",
    image: "/images/what-we-do-1.jpg",
  },
  {
    id: 2,
    title: "Bếp ăn yêu thương ở vùng cao",
    excerpt:
      "Các em nhỏ tại trường Mường Lống đã có bữa cơm trưa đầy đủ nhờ bếp ăn tình nguyện...",
    content:
      "Chi tiết: Mỗi suất ăn được chuẩn bị từ những nguyên liệu được vận chuyển từ trung tâm huyện, mang đến sự ấm áp cho trẻ em vùng cao trong mùa đông lạnh giá.",
    image: "/images/what-we-do-2.jpg",
  },
  {
    id: 3,
    title: "Bữa trưa ấm nóng trên đảo Lý Sơn",
    excerpt:
      "Học sinh đảo Bé nay không còn lo cảnh nhịn đói mỗi trưa, nhờ vào bếp ăn chung tay gây dựng...",
    content:
      "Chi tiết: Với sự đóng góp từ cộng đồng, căn bếp đã phục vụ hơn 300 suất ăn mỗi ngày cho học sinh đảo Bé, giúp các em yên tâm học tập.",
    image: "/images/what-we-do-1.jpg",
  },
];

export default function JourneyPage() {
  return (
    <div className="bg-gray-50">
      <div className="relative flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center text-white px-4 pt-32"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-color">
            Hành trình yêu thương
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-color">
            Những câu chuyện thực tế được ghi lại trên hành trình lan tỏa yêu
            thương qua từng suất ăn.
          </p>
        </motion.div>
      </div>

      <div className="lg:container mx-auto px-4 py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <StoryCard {...story} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
