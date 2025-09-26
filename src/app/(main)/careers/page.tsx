"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Job = {
  title: string;
  category: string;
  desc: string;
  responsibilities: string[];
  requirements: string[];
};

export default function CareersPage() {
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobs: Job[] = [
    {
      title: "Nhân viên Bếp",
      category: "Bếp & Vận chuyển",
      desc: "Tham gia chuẩn bị nguyên liệu, chế biến và đóng gói các suất ăn dinh dưỡng cho cộng đồng. Bạn sẽ là một phần quan trọng trong việc đảm bảo mỗi bữa ăn đều chất lượng và an toàn vệ sinh.",
      responsibilities: [
        "Chuẩn bị nguyên liệu và nấu các suất ăn theo hướng dẫn",
        "Đóng gói và kiểm tra chất lượng thực phẩm",
        "Đảm bảo vệ sinh an toàn thực phẩm trong quá trình làm việc",
      ],
      requirements: [
        "Có sức khỏe tốt, chịu khó",
        "Ưu tiên ứng viên có kinh nghiệm làm bếp hoặc chế biến thực phẩm",
        "Tinh thần làm việc nhóm cao",
      ],
    },
    {
      title: "Nhân viên Vận chuyển",
      category: "Bếp & Vận chuyển",
      desc: "Đảm nhận việc vận chuyển các suất ăn từ bếp đến điểm phát cho người dân. Vai trò này giúp đảm bảo sự kết nối kịp thời và an toàn giữa FoodFund và cộng đồng nhận hỗ trợ.",
      responsibilities: [
        "Nhận và vận chuyển suất ăn từ bếp đến điểm phát",
        "Giữ gìn an toàn thực phẩm trong suốt quá trình vận chuyển",
        "Hỗ trợ phối hợp với các tình nguyện viên tại điểm phát",
      ],
      requirements: [
        "Có phương tiện cá nhân là một lợi thế",
        "Tinh thần trách nhiệm cao",
        "Kỹ năng giao tiếp và phối hợp nhóm tốt",
      ],
    },
    {
      title: "Quản trị viên",
      category: "Quản lý & Điều phối",
      desc: "Phụ trách giám sát, đánh giá và duyệt các dự án quỹ của FoodFund. Đây là vị trí quan trọng trong việc đảm bảo nguồn lực được phân bổ hợp lý và mang lại hiệu quả tối đa cho cộng đồng.",
      responsibilities: [
        "Theo dõi và quản lý các dự án quỹ đang triển khai",
        "Phối hợp với đội bếp và vận chuyển để đảm bảo tiến độ",
        "Đánh giá, duyệt và báo cáo kết quả dự án",
      ],
      requirements: [
        "Tốt nghiệp chuyên ngành quản lý, kinh tế hoặc liên quan",
        "Có kỹ năng lãnh đạo và quản lý dự án",
        "Ưu tiên ứng viên từng tham gia hoạt động thiện nguyện",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-color-base h-[100vh] flex flex-col justify-center items-center text-center text-color">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold drop-shadow-lg"
        >
          Hãy cùng FoodFund tạo nên khác biệt
        </motion.h1>
        <p className="mt-4 text-lg max-w-xl">
          Xây dựng sự nghiệp gắn liền với giá trị cộng đồng.
        </p>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Văn hóa FoodFund</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-12">
            Tại FoodFund, chúng tôi tin rằng sự sẻ chia không chỉ nằm trong từng
            bữa ăn, mà còn trong cách chúng tôi đồng hành, hỗ trợ và phát triển
            lẫn nhau. Văn hóa FoodFund là sự kết hợp giữa{" "}
            <span className="font-semibold">ý nghĩa cộng đồng</span>,{" "}
            <span className="font-semibold">sự gắn kết</span> và{" "}
            <span className="font-semibold">tinh thần đổi mới</span>.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">Sẻ chia & Gắn kết</h3>
              <p className="text-gray-600">
                Chúng tôi xây dựng môi trường làm việc nơi mọi người đều cảm
                thấy được lắng nghe, hỗ trợ và cùng nhau hướng tới một mục tiêu
                chung.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">Tác động cộng đồng</h3>
              <p className="text-gray-600">
                Mỗi công việc tại FoodFund đều góp phần trực tiếp vào việc mang
                đến những bữa ăn dinh dưỡng và niềm vui cho cộng đồng khó khăn.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">
                Đổi mới & Phát triển
              </h3>
              <p className="text-gray-600">
                Chúng tôi khuyến khích sáng tạo và học hỏi liên tục để mỗi thành
                viên đều có cơ hội phát triển sự nghiệp song song với lan tỏa
                giá trị tốt đẹp.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Vị trí tuyển dụng
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => {
                setSelectedJob(job);
                setOpen(true);
              }}
              className="cursor-pointer"
            >
              <div className="relative rounded-2xl p-[2px] shadow-lg hover:shadow-2xl transition-all">
                <Card className="rounded-2xl h-full bg-white hover:bg-gray-50 transition-colors">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        {job.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 flex-1">{job.desc}</p>

                    <Button className="mt-6 w-full btn-color">
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl h-[85vh] flex flex-col">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.title}</DialogTitle>
                <p className="text-gray-600">{selectedJob.desc}</p>
              </DialogHeader>

              <div
                className="flex-1 overflow-y-auto pr-2 space-y-6 text-gray-700"
                onWheel={(e) => e.stopPropagation()}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                <div>
                  <h4 className="font-semibold mb-2">Nhiệm vụ chính</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.responsibilities.map(
                      (r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Yêu cầu ứng viên</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.requirements.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>

                <form className="space-y-4">
                  <Input placeholder="Họ và tên" />
                  <Input placeholder="Email" type="email" />
                  <Input placeholder="Số điện thoại" type="tel" />
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn vị trí" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((j, idx) => (
                        <SelectItem key={idx} value={j.title}>
                          {j.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="w-full btn-color">
                    Gửi đơn ứng tuyển
                  </Button>
                </form>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
