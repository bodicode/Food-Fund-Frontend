"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="pt-32 text-center px-6"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold text-color mb-6"
        >
          Tại sao vẫn còn nhiều người thiếu bữa ăn đủ dinh dưỡng?
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
        >
          FoodFund giúp kết nối cộng đồng để gây quỹ, chuẩn bị và phân phát bữa
          ăn đến những người đang gặp khó khăn.
        </motion.p>
      </motion.section>

      {/* Trải nghiệm thực tế */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 md:px-16 py-10 mt-12 bg-color-base"
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-color mb-4">
            Trải nghiệm từ thực tế.
          </h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            Khi dịch bệnh và thiên tai xảy ra, chúng tôi chứng kiến nhiều gia
            đình, trẻ em và người lao động mất đi nguồn thu nhập và không có đủ
            lương thực. Nhiều người chỉ cần một bữa cơm nóng để có thêm nghị lực
            vượt qua khó khăn.
          </p>
          <p className="text-gray-700 mb-3 leading-relaxed">
            Chúng tôi nhận ra rằng, có rất nhiều tấm lòng sẵn sàng giúp đỡ,
            nhưng lại thiếu một nền tảng minh bạch và tiện lợi để quyên góp, tổ
            chức nấu ăn và phân phát thực phẩm. Chính vì vậy FoodFund được ra
            đời.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Với FoodFund, mỗi đóng góp nhỏ đều có thể biến thành một bữa cơm ấm
            áp, mang đến niềm hy vọng và sự sẻ chia cho cộng đồng.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {[
              {
                name: "Trương Minh Phước",
                role: "CEO",
                img: "/images/avatar.webp",
              },
              {
                name: "Huỳnh Đình Luyện",
                role: "CTO",
                img: "/images/avatar.webp",
              },
              {
                name: "Huỳnh Lê Nhật Hoàng",
                role: "COO",
                img: "/images/avatar.webp",
              },
              {
                name: "Phan Cảnh Bảo Duy",
                role: "CMO",
                img: "/images/avatar.webp",
              },
            ].map((founder, idx) => (
              <SwiperSlide key={idx}>
                <motion.div
                  variants={fadeInUp}
                  className="rounded-lg p-4 text-center"
                >
                  <Image
                    src={founder.img}
                    alt={founder.name}
                    width={150}
                    height={150}
                    className="rounded-full mx-auto"
                  />
                  <p className="mt-3 font-medium text-gray-900">
                    {founder.name}
                  </p>
                  <p className="text-sm text-gray-600">{founder.role}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </motion.section>

      {/* Sứ mệnh */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8 px-6 md:px-16 py-16 bg-[#f9fafb]"
      >
        <motion.div variants={fadeInUp} className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-color">
            Sứ mệnh của FoodFund.
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi tin rằng không ai nên phải lo lắng về bữa ăn hằng ngày.
            FoodFund được xây dựng để kết nối những tấm lòng nhân ái với những
            người đang cần sự hỗ trợ cấp thiết, đặc biệt là trong những thời
            điểm khó khăn như dịch bệnh, thiên tai hay biến động kinh tế.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Sứ mệnh của chúng tôi không chỉ dừng lại ở việc mang đến những bữa
            cơm nóng hổi, mà còn khơi dậy tinh thần sẻ chia trong cộng đồng. Mỗi
            đóng góp, dù nhỏ, đều mang trong mình một câu chuyện yêu thương,
            được gói ghém thành những suất ăn ấm áp gửi tới những người cần giúp
            đỡ.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Với nền tảng minh bạch và tiện lợi, các cá nhân và tổ chức có thể dễ
            dàng tham gia vào hành trình thiện nguyện: từ gây quỹ, chuẩn bị bữa
            ăn cho đến phân phát tận tay người nhận. Tất cả quá trình đều được
            công khai, đảm bảo mọi nguồn lực được sử dụng đúng mục đích.
          </p>
          <p className="text-gray-700 leading-relaxed">
            FoodFund không chỉ là một nền tảng hỗ trợ bữa ăn, mà còn là nhịp cầu
            kết nối những trái tim nhân ái. Chúng tôi tin rằng khi cộng đồng
            cùng chung tay, sẽ không còn ai bị bỏ lại phía sau trên hành trình
            đi tìm sự sống và niềm hy vọng.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi tin rằng mỗi bữa ăn không chỉ là dinh dưỡng cho cơ thể, mà
            còn là niềm tin và động lực để mọi người cùng nhau vượt qua thử
            thách. FoodFund hướng tới việc xây dựng một cộng đồng bền vững, nơi
            sự quan tâm và tình thương được lan tỏa, để không ai phải đi ngủ với
            chiếc bụng đói.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Đó chính là sứ mệnh lớn nhất của chúng tôi: biến sự đồng hành và sẻ
            chia thành một thói quen đẹp trong xã hội, để mỗi hành động nhỏ đều
            có thể góp phần thay đổi cuộc đời của nhiều người.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="space-y-12 p-5 rounded-2xl bg-color-base"
        >
          {[
            {
              title: "Minh bạch",
              desc: "Mọi khoản quyên góp đều được công khai. Chúng tôi cam kết 100% số tiền được sử dụng đúng mục đích.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" />
                </svg>
              ),
            },
            {
              title: "Tiếp cận công bằng",
              desc: "Bất kỳ ai cũng có thể nhận hỗ trợ hoặc đóng góp, không phân biệt hoàn cảnh.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l4 10H8l4-10zm0 20a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              ),
            },
            {
              title: "Đơn giản",
              desc: "Quy trình gây quỹ và theo dõi được thiết kế trực quan, dễ hiểu, ai cũng có thể tham gia.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l9 10-9 10L3 12l9-10z" />
                </svg>
              ),
            },
            {
              title: "Bền vững",
              desc: "Chúng tôi không chỉ mang đến bữa ăn trước mắt, mà còn tạo động lực để cộng đồng cùng nhau phát triển lâu dài.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-sky-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3l9 8v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V11l9-8z" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="flex flex-col items-center text-center relative"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-color">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2 max-w-sm">{item.desc}</p>
              {idx !== 3 && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 border-b border-gray-200"></div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
