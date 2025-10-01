// "use client";

// import {
//   Utensils,
//   Baby,
//   School,
//   HeartHandshake,
//   Home,
//   Hospital,
//   Mountain,
//   Leaf,
//   Factory,
//   CloudRain,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { CampaignCard } from "@/components/campaign-card";
// import { Autoplay } from "swiper/modules";
// import Link from "next/link";

// const categories = [
//   {
//     title: "Bữa ăn học đường",
//     desc: "Hỗ trợ bữa sáng/bữa trưa dinh dưỡng cho học sinh nghèo.",
//     icon: School,
//   },
//   {
//     title: "Thực phẩm cho trẻ em suy dinh dưỡng",
//     desc: "Sữa, bột, vitamin và bữa ăn cải thiện thể trạng.",
//     icon: Baby,
//   },
//   {
//     title: "Bữa cơm cho gia đình khó khăn",
//     desc: "Hỗ trợ gạo, nhu yếu phẩm và bữa ăn miễn phí.",
//     icon: Home,
//   },
//   {
//     title: "Bếp ăn dã chiến",
//     desc: "Bếp ăn cho khu cách ly, vùng thiên tai khẩn cấp.",
//     icon: Utensils,
//   },
//   {
//     title: "Bữa ăn ấm áp mùa đông",
//     desc: "Suất ăn nóng cho người vô gia cư, dân vùng cao.",
//     icon: HeartHandshake,
//   },
//   {
//     title: "Nhu yếu phẩm dài hạn",
//     desc: "Cung cấp gạo, mì, nước mắm, dầu ăn định kỳ.",
//     icon: Utensils,
//   },
//   {
//     title: "Thực phẩm cho mẹ và bé",
//     desc: "Bữa ăn và dinh dưỡng riêng cho phụ nữ mang thai, mẹ bỉm.",
//     icon: Baby,
//   },
//   {
//     title: "Suất ăn hỗ trợ viện phí",
//     desc: "Bữa ăn giá rẻ/miễn phí trong bệnh viện.",
//     icon: Hospital,
//   },
//   {
//     title: "Thực phẩm cho dân tộc thiểu số",
//     desc: "Hỗ trợ gạo, thực phẩm cho bản làng xa xôi.",
//     icon: Mountain,
//   },
//   {
//     title: "Bữa ăn xanh – lành mạnh",
//     desc: "Rau củ quả, thực phẩm sạch cho gia đình khó khăn.",
//     icon: Leaf,
//   },
//   {
//     title: "Thực phẩm cứu trợ thiên tai",
//     desc: "Gạo, mì, nước sạch cho vùng lũ, bão, thiên tai.",
//     icon: CloudRain,
//   },
//   {
//     title: "Hỗ trợ bữa ăn công nhân",
//     desc: "Bữa cơm giá rẻ và nhu yếu phẩm cho công nhân.",
//     icon: Factory,
//   },
// ];

// const featuredCategories = [
//   {
//     name: "Bữa ăn học đường",
//     campaigns: [
//       {
//         id: 1,
//         title: "Suất ăn sáng cho học sinh vùng cao",
//         image: "/images/what-we-do-1.jpg",
//         donations: 250,
//         raised: 5000000,
//         goal: 10000000,
//         progress: 50,
//       },
//       {
//         id: 2,
//         title: "Bữa trưa đầy đủ dinh dưỡng",
//         image: "/images/what-we-do-1.jpg",
//         donations: 180,
//         raised: 3500000,
//         goal: 8000000,
//         progress: 44,
//       },
//       {
//         id: 3,
//         title: "Chương trình sữa học đường",
//         image: "/images/what-we-do-1.jpg",
//         donations: 320,
//         raised: 9000000,
//         goal: 12000000,
//         progress: 75,
//       },
//       {
//         id: 4,
//         title: "Chương trình bữa ăn học đường",
//         image: "/images/what-we-do-1.jpg",
//         donations: 320,
//         raised: 9000000,
//         goal: 12000000,
//         progress: 75,
//       },
//     ],
//   },
//   {
//     name: "Bữa cơm cho gia đình khó khăn",
//     campaigns: [
//       {
//         id: 5,
//         title: "Hỗ trợ gạo cho 50 hộ nghèo",
//         image: "/images/what-we-do-1.jpg",
//         donations: 400,
//         raised: 12000000,
//         goal: 20000000,
//         progress: 60,
//       },
//       {
//         id: 6,
//         title: "Bữa cơm miễn phí cuối tuần",
//         image: "/images/what-we-do-1.jpg",
//         donations: 150,
//         raised: 2500000,
//         goal: 6000000,
//         progress: 42,
//       },
//       {
//         id: 7,
//         title: "Gói nhu yếu phẩm hàng tháng",
//         image: "/images/what-we-do-1.jpg",
//         donations: 210,
//         raised: 7000000,
//         goal: 15000000,
//         progress: 47,
//       },
//       {
//         id: 8,
//         title: "Gói nhu yếu phẩm hàng tháng",
//         image: "/images/what-we-do-1.jpg",
//         donations: 210,
//         raised: 7000000,
//         goal: 15000000,
//         progress: 47,
//       },
//     ],
//   },
//   {
//     name: "Suất ăn hỗ trợ viện phí",
//     campaigns: [
//       {
//         id: 9,
//         title: "Cơm miễn phí cho bệnh nhân nghèo",
//         image: "/images/what-we-do-1.jpg",
//         donations: 350,
//         raised: 8000000,
//         goal: 12000000,
//         progress: 66,
//       },
//       {
//         id: 10,
//         title: "Bữa ăn cho người nhà bệnh nhân",
//         image: "/images/what-we-do-1.jpg",
//         donations: 210,
//         raised: 4000000,
//         goal: 9000000,
//         progress: 44,
//       },
//       {
//         id: 11,
//         title: "Gói nhu yếu phẩm hàng tháng",
//         image: "/images/what-we-do-1.jpg",
//         donations: 210,
//         raised: 7000000,
//         goal: 15000000,
//         progress: 47,
//       },
//       {
//         id: 12,
//         title: "Gói nhu yếu phẩm hàng tháng",
//         image: "/images/what-we-do-1.jpg",
//         donations: 210,
//         raised: 7000000,
//         goal: 15000000,
//         progress: 47,
//       },
//     ],
//   },
//   {
//     name: "Thực phẩm cứu trợ thiên tai",
//     campaigns: [
//       {
//         id: 13,
//         title: "Gạo cho vùng lũ miền Trung",
//         image: "/images/what-we-do-1.jpg",
//         donations: 500,
//         raised: 20000000,
//         goal: 30000000,
//         progress: 66,
//       },
//       {
//         id: 14,
//         title: "Thực phẩm cho dân bị sạt lở",
//         image: "/images/what-we-do-1.jpg",
//         donations: 330,
//         raised: 10000000,
//         goal: 20000000,
//         progress: 50,
//       },
//       {
//         id: 15,
//         title: "Hỗ trợ nước sạch sau bão",
//         image: "/images/what-we-do-1.jpg",
//         donations: 280,
//         raised: 6000000,
//         goal: 15000000,
//         progress: 40,
//       },
//       {
//         id: 16,
//         title: "Hỗ trợ nước sạch sau bão",
//         image: "/images/what-we-do-1.jpg",
//         donations: 280,
//         raised: 6000000,
//         goal: 15000000,
//         progress: 40,
//       },
//     ],
//   },
// ];

// export default function CampaignCategoriesPage() {
//   const cardsRef = useRef<HTMLDivElement[]>([]);

//   useLayoutEffect(() => {
//     cardsRef.current.forEach((card) => {
//       if (!card) return;

//       const enter = () => {
//         gsap.to(card, {
//           scale: 1.05,
//           rotate: 1.5,
//           boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
//           duration: 0.2,
//           ease: "power3.out",
//         });
//       };

//       const leave = () => {
//         gsap.to(card, {
//           scale: 1,
//           rotate: 0,
//           boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
//           duration: 0.2,
//           ease: "power3.inOut",
//         });
//       };

//       card.addEventListener("mouseenter", enter);
//       card.addEventListener("mouseleave", leave);

//       return () => {
//         card.removeEventListener("mouseenter", enter);
//         card.removeEventListener("mouseleave", leave);
//       };
//     });
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-32">
//       <div className="text-left mb-12">
//         <h1 className="text-7xl font-bold text-color mb-4">
//           Phân loại chiến dịch
//         </h1>
//         <p className="text-muted-foreground text-lg">
//           Chọn danh mục phù hợp để khám phá các chiến dịch gây quỹ cho bữa ăn và
//           thực phẩm.
//         </p>
//       </div>

//       <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-20">
//         {categories.map((cat, idx) => {
//           const Icon = cat.icon;
//           return (
//             <motion.div
//               key={idx}
//               ref={(el) => {
//                 if (el) cardsRef.current[idx] = el;
//               }}
//               className="rounded-xl border bg-white p-6 shadow-sm transition group cursor-pointer"
//               initial={{ opacity: 0, y: 40 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: idx * 0.08 }}
//             >
//               <Icon className="w-8 h-8 text-orange-500 mb-4 group-hover:scale-110 transition" />
//               <h3 className="font-semibold text-lg mb-2">{cat.title}</h3>
//               <p className="text-sm text-gray-500">{cat.desc}</p>
//             </motion.div>
//           );
//         })}
//       </div>

//       <div className="border-b-2 w-full text-muted-foreground" />

//       <div className="space-y-10 mt-16">
//         {featuredCategories.map((cat, idx) => (
//           <div key={idx}>
//             <h2 className="text-3xl font-bold text-color mb-6">{cat.name}</h2>
//             <Swiper
//               spaceBetween={20}
//               slidesPerView={3}
//               loop={true}
//               speed={1500}
//               modules={[Autoplay]}
//               autoplay={{
//                 delay: 3000,
//                 disableOnInteraction: false,
//               }}
//             >
//               {cat.campaigns.map((c, i) => (
//                 <SwiperSlide key={c.id}>
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.9, y: 30 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: i * 0.15 }}
//                   >
//                     <CampaignCard {...c} />
//                   </motion.div>
//                 </SwiperSlide>
//               ))}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.5 }}
//                 className="col-span-3 text-right"
//               >
//                 <Link
//                   href="/discovery/categories"
//                   className="block mt-3 text-sm hover:underline text-muted-foreground"
//                 >
//                   Xem tất cả
//                 </Link>
//               </motion.div>
//             </Swiper>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page