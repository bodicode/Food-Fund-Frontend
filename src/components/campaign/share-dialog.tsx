"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  campaignUrl: string;
  campaignDescription?: string;
}

export function ShareDialog({
  isOpen,
  onClose,
  campaignTitle,
  campaignUrl,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      campaignUrl
    )}&quote=${encodeURIComponent(campaignTitle)}`;
    window.open(facebookShareUrl, "facebook-share", "width=600,height=400");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E77731] to-[#ad4e28] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Lan tỏa yêu thương đến cộng đồng</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-800 font-semibold mb-4">
              Bằng cách chia sẻ chiến dịch <span className="font-bold">{campaignTitle}</span>, bạn sẽ góp phần giúp đỡ những hoàn cảnh khó khăn.
            </p>
            <p className="text-sm text-gray-600">Chia sẻ</p>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleShareFacebook}
              className="flex-1 bg-[#1877F2] hover:bg-[#165FD8] text-white rounded-full py-3 flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Hoặc sao chép liên kết</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={campaignUrl}
                readOnly
                className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-600 truncate"
              />
              <Button
                onClick={handleCopyLink}
                className={`px-6 font-semibold transition-all ${copied
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-[#E77731] hover:bg-[#ad4e28] text-white"
                  }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Sao chép
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
