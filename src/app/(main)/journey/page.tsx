"use client";

import { motion } from "framer-motion";
import StoryCard from "../../../components/shared/article-card";
import { Button } from "../../../components/ui/button";
import { Search, MapPin, Calendar, ArrowRight, Sparkles, Heart, Users, Globe, ChevronRight } from "lucide-react";
import { Input } from "../../../components/ui/input";
import Image from "next/image";

const stories = [
  {
    id: 1,
    title: "Suất cơm nghĩa tình tại bệnh viện Quận 8 Thành phố Hồ Chí Minh",
    excerpt:
      "Mỗi ngày, hàng trăm bệnh nhân nghèo được hỗ trợ những suất cơm nóng hổi, đầy đủ dinh dưỡng. Những nụ cười rạng rỡ của họ chính là động lực to lớn nhất để chúng tôi tiếp tục hành trình này.",
    content:
      "Chi tiết: Từ những tấm lòng hảo tâm, nhóm tình nguyện viên đã phát hơn 500 suất cơm mỗi tuần cho bệnh nhân nghèo, mang lại niềm tin và động lực cho họ trong hành trình chữa bệnh.",
    image: "/images/what-we-do-2.jpg",
    date: "12 Tháng 10, 2025",
    location: "TP. Hồ Chí Minh",
    category: "Bệnh viện"
  },
  {
    id: 2,
    title: "Bếp ăn yêu thương thắp sáng nụ cười ở vùng cao Tây Bắc",
    excerpt:
      "Các em nhỏ tại trường Mường Lống đã có bữa cơm trưa đầy đủ nhờ bếp ăn tình nguyện. Không còn những bữa cơm trắng với muối, giờ đây là những khay cơm có thịt, có rau.",
    content:
      "Chi tiết: Mỗi suất ăn được chuẩn bị từ những nguyên liệu được vận chuyển từ trung tâm huyện, mang đến sự ấm áp cho trẻ em vùng cao trong mùa đông lạnh giá.",
    image: "/images/what-we-do-2.jpg",
    date: "05 Tháng 11, 2025",
    location: "Sơn La",
    category: "Vùng cao"
  },
  {
    id: 3,
    title: "Bữa trưa ấm nóng trên đảo Lý Sơn cho các em học sinh",
    excerpt:
      "Học sinh đảo Bé nay không còn lo cảnh nhịn đói mỗi trưa, nhờ vào bếp ăn chung tay gây dựng. Nhờ đó, các em có thể ở lại trường nghỉ trưa và học tập tốt hơn vào buổi chiều.",
    content:
      "Chi tiết: Với sự đóng góp từ cộng đồng, căn bếp đã phục vụ hơn 300 suất ăn mỗi ngày cho học sinh đảo Bé, giúp các em yên tâm học tập.",
    image: "/images/what-we-do-2.jpg",
    date: "20 Tháng 11, 2025",
    location: "Quảng Ngãi",
    category: "Biên giới - Hải đảo"
  },
  {
    id: 4,
    title: "Hành trình mang Tết sớm đến với người vô gia cư Hà Nội",
    excerpt:
      "Những phần quà Tết và suất ăn nóng hổi được trao tận tay những người vô gia cư trong đêm đông lạnh giá của Hà Nội, mang lại chút hơi ấm tình người.",
    content: "...",
    image: "/images/what-we-do-2.jpg",
    date: "01 Tháng 12, 2025",
    location: "Hà Nội",
    category: "Đô thị"
  },
  {
    id: 5,
    title: "Bếp ăn 0 đồng - Lan tỏa yêu thương giữa lòng Đà Nẵng",
    excerpt:
      "Quán cơm chay 0 đồng phục vụ hàng trăm suất ăn mỗi trưa cho người lao động nghèo, sinh viên và người khuyết tật.",
    content: "...",
    image: "/images/what-we-do-2.jpg",
    date: "15 Tháng 12, 2025",
    location: "Đà Nẵng",
    category: "Cộng đồng"
  }
];

const stats = [
  { label: "Suất ăn đã trao", value: "50,000+", icon: <Heart className="w-5 h-5 text-red-500" /> },
  { label: "Tình nguyện viên", value: "1,200+", icon: <Users className="w-5 h-5 text-blue-500" /> },
  { label: "Điểm đến hỗ trợ", value: "35+", icon: <MapPin className="w-5 h-5 text-green-500" /> },
  { label: "Tỉnh thành", value: "12", icon: <Globe className="w-5 h-5 text-purple-500" /> },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative pt-32 pb-40 px-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100/30 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/80 backdrop-blur-md text-orange-700 font-semibold text-sm mb-8 shadow-xl shadow-orange-900/5 border border-orange-100/50"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="tracking-wide">CHUYỆN NGHỀ, CHUYỆN ĐỜI & NHỮNG HÀNH TRÌNH</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 text-gray-900 tracking-tight leading-[1.1]">
            Hành trình <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 relative inline-block">
              yêu thương
              <svg className="absolute w-full h-4 -bottom-2 left-0 text-orange-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-12">
            Mỗi chuyến đi là một câu chuyện, mỗi suất ăn là một niềm hy vọng.
            Cùng chúng tôi nhìn lại những khoảnh khắc đáng nhớ.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-300 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm những câu chuyện truyền cảm hứng..."
                className="pl-14 pr-6 py-8 rounded-full border-none shadow-2xl focus:ring-4 focus:ring-orange-100 bg-white text-lg transition-all"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <section className="container mx-auto px-6 -mt-20 relative z-20 mb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-orange-50 transition-colors">
                {stat.icon}
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-6 pb-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Câu chuyện tiêu biểu</h2>
            <div className="h-2 w-20 bg-orange-500 rounded-full"></div>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" className="text-orange-600 font-bold hover:bg-orange-50">Tất cả bài viết <ChevronRight className="ml-1 w-4 h-4" /></Button>
          </div>
        </div>

        {/* Featured Story */}
        <motion.div
          className="mb-24 group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100">
            <div className="lg:col-span-12 xl:col-span-7 relative overflow-hidden h-[400px] lg:h-[600px]">
              <Image
                src={stories[0].image}
                alt={stories[0].title}
                fill
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute top-8 left-8">
                <span className="px-5 py-2 rounded-full bg-white/95 backdrop-blur shadow-lg text-xs font-black text-orange-600 uppercase tracking-tighter">
                  {stories[0].category}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-center p-10 lg:p-16 space-y-8 bg-white relative">
              <div className="space-y-4">
                <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-500" /> {stories[0].date}</span>
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> {stories[0].location}</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.2] group-hover:text-orange-600 transition-colors duration-500">
                  {stories[0].title}
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed font-medium line-clamp-4">
                  {stories[0].excerpt}
                </p>
              </div>

              <Button className="w-fit bg-gray-900 hover:bg-orange-600 text-white rounded-2xl px-10 py-7 h-auto text-lg font-bold shadow-2xl shadow-gray-900/20 transition-all duration-300 hover:-translate-y-1">
                Khám phá ngay <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Section Heading for Grid */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4 text-center">Hành trình khác</h2>
          <div className="h-1.5 w-16 bg-orange-500 rounded-full mx-auto"></div>
        </div>

        {/* Grid List */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {stories.slice(1).map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <StoryCard
                {...story}
                date={story.date}
                // @ts-expect-error - location might not be on all story types
                location={story.location}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
