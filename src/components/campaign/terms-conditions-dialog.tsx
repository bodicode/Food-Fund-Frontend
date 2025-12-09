"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Shield, Scale, FileText } from "lucide-react";

interface TermsConditionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export function TermsConditionsDialog({
  open,
  onOpenChange,
  onAccept,
}: TermsConditionsDialogProps) {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptResponsibility, setAcceptResponsibility] = useState(false);
  const [understandConsequences, setUnderstandConsequences] = useState(false);

  const canProceed = acceptTerms && acceptResponsibility && understandConsequences;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  const handleAccept = () => {
    if (canProceed) {
      onAccept();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setAcceptTerms(false);
    setAcceptResponsibility(false);
    setUnderstandConsequences(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        onWheel={(e) => e.stopPropagation()} // ✅ chặn scroll bubble ra body
      >
        {/* Header cố định */}
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Scale className="w-6 h-6 text-orange-500" />
            Điều khoản & Chính sách Miễn trừ Trách nhiệm
          </DialogTitle>
        </DialogHeader>

        {/* ✅ Body có scroll nội bộ */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 overscroll-contain">
          <div className="space-y-6 text-sm">
            {/* Platform Role */}
            <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Vai trò của FoodFund
              </h3>
              <p className="text-gray-700 leading-relaxed">
                FoodFund là nền tảng kết nối giữa người quyên góp (Donor) và người gây quỹ (Fundraiser).
                Chúng tôi <strong>KHÔNG</strong> phải là tổ chức từ thiện, đơn vị quản lý quỹ,
                hay bên đảm bảo tính xác thực của chiến dịch.
              </p>
            </section>

            {/* Fundraiser Responsibilities */}
            <section className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-base mb-3 text-orange-600">
                Trách nhiệm của Người tạo chiến dịch (Fundraiser)
              </h3>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">1. Thông tin chính xác</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                    <li>Mọi thông tin cung cấp phải trung thực, chính xác</li>
                    <li>Chịu trách nhiệm pháp lý về tính xác thực của chiến dịch</li>
                    <li>Cung cấp CCCD/CMND hợp lệ khi đăng ký tổ chức</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">2. Sử dụng quỹ đúng mục đích</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                    <li>Sử dụng 100% tiền quyên góp đúng mục đích đã công bố</li>
                    <li>Cung cấp báo cáo minh bạch về việc sử dụng quỹ</li>
                    <li>Lưu giữ chứng từ, hóa đơn liên quan</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <h4 className="font-semibold text-red-700 mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    3. Trách nhiệm pháp lý
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                    <li>Chịu hoàn toàn trách nhiệm trước pháp luật Việt Nam</li>
                    <li>Hành vi gian lận sẽ bị truy cứu hình sự theo <strong>Điều 174 BLHS 2015</strong></li>
                    <li>Phải hoàn trả toàn bộ số tiền đã nhận và bồi thường thiệt hại</li>
                    <li>Thông tin CCCD sẽ được cung cấp cho cơ quan chức năng nếu có vi phạm</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Platform Rights */}
            <section className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-base mb-3 text-purple-600">
                Quyền của FoodFund
              </h3>

              <div className="space-y-2 text-gray-700">
                <p><strong>Kiểm duyệt & Tạm dừng:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Xem xét, kiểm duyệt mọi chiến dịch trước khi công khai</li>
                  <li>Tạm dừng/hủy chiến dịch nếu phát hiện dấu hiệu bất thường</li>
                  <li>Yêu cầu bổ sung tài liệu xác minh bất cứ lúc nào</li>
                </ul>

                <p className="mt-3"><strong>Xử lý khi phát hiện gian lận:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Đóng băng tài khoản và chiến dịch ngay lập tức</li>
                  <li>Báo cáo cơ quan công an, ngân hàng</li>
                  <li>Cung cấp thông tin CCCD/CMND cho cơ quan chức năng</li>
                  <li>Phối hợp điều tra và xử lý pháp lý</li>
                  <li>Nỗ lực hoàn tiền cho người quyên góp (không đảm bảo 100%)</li>
                </ul>
              </div>
            </section>

            {/* Donor Rights */}
            <section className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-base mb-2 text-green-700">
                Quyền & Trách nhiệm của Người quyên góp (Donor)
              </h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Rủi ro tự chịu:</strong> Bạn tự đánh giá và quyết định quyên góp.
                  Platform không đảm bảo 100% tính xác thực của mọi chiến dịch.</p>

                <p><strong>Quyền khiếu nại:</strong> Được báo cáo chiến dịch đáng ngờ,
                  yêu cầu minh bạch hóa, và được hỗ trợ khiếu nại nếu phát hiện gian lận.</p>

                <p><strong>Hoàn tiền:</strong> Chỉ được hoàn tiền khi chiến dịch bị hủy trước khi kết thúc,
                  phát hiện gian lận và thu hồi được tiền, hoặc lỗi kỹ thuật từ hệ thống.</p>
              </div>
            </section>

            {/* Fraud Handling Process */}
            <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-5 h-5" />
                Quy trình xử lý Gian lận/Scam
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>Đóng băng ngay:</strong> Khóa tài khoản, đóng băng chiến dịch, ngừng giao dịch</li>
                <li><strong>Báo cơ quan:</strong> Báo Công an, thông báo ngân hàng phong tỏa tài khoản</li>
                <li><strong>Thông báo Donor:</strong> Email/thông báo cho người đã quyên góp về tình hình</li>
                <li><strong>Xử lý pháp lý:</strong> Phối hợp điều tra, thu hồi tiền, hoàn tiền theo tỷ lệ thu hồi được</li>
              </ol>
            </section>

            {/* Platform Disclaimer */}
            <section className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Miễn trừ trách nhiệm của FoodFund
              </h3>
              <p className="text-gray-700 mb-2">FoodFund <strong>KHÔNG</strong> chịu trách nhiệm về:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Hành vi gian lận của fundraiser</li>
                <li>Thiệt hại tài chính nếu không thu hồi được tiền từ fundraiser</li>
                <li>Chất lượng thực tế của chiến dịch</li>
                <li>Tranh chấp giữa fundraiser và donor</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Platform chỉ chịu trách nhiệm: Nỗ lực xác minh thông tin cơ bản,
                hỗ trợ quy trình pháp lý khi có gian lận, và bảo mật thông tin người dùng.
              </p>
            </section>
          </div>
        </div>

        {/* Checkboxes cố định */}
        <div className="flex-shrink-0 px-6 py-4 border-t bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="accept-terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <label
              htmlFor="accept-terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Tôi đã đọc và đồng ý với Điều khoản & Chính sách
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="accept-responsibility"
              checked={acceptResponsibility}
              onCheckedChange={(checked) => setAcceptResponsibility(checked as boolean)}
            />
            <label
              htmlFor="accept-responsibility"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Tôi cam kết thông tin chiến dịch là trung thực, sử dụng quỹ đúng mục đích,
              và chịu trách nhiệm pháp lý hoàn toàn
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="understand-consequences"
              checked={understandConsequences}
              onCheckedChange={(checked) => setUnderstandConsequences(checked as boolean)}
            />
            <label
              htmlFor="understand-consequences"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Tôi hiểu rằng hành vi gian lận sẽ bị truy cứu hình sự và thông tin CCCD
              của tôi sẽ được cung cấp cho cơ quan chức năng nếu có vi phạm
            </label>
          </div>
        </div>

        {/* Footer cố định */}
        <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 border-t bg-white dark:bg-zinc-900 gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!canProceed}
            className="btn-color"
          >
            Tôi đồng ý và tiếp tục
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
