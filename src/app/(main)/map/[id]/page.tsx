"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { campaignService } from "@/services/campaign.service";
import { Campaign } from "@/types/api/campaign";
import { Loader } from "@/components/animate-ui/icons/loader";

delete (
  L.Icon.Default.prototype as unknown as {
    _getIconUrl?: unknown;
  }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

type LatLng = [number, number];

export default function CampaignMapPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [pos, setPos] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);

  const fmtVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(n);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await campaignService.getCampaignById(id as string);
        setCampaign(data);

        if (data?.location) {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            data.location
          )}&countrycodes=VN&limit=1`;

          const res = await fetch(url, {
            headers: {
              "Accept-Language": "vi",
              "User-Agent": "FoodFund/1.0 (foodfund.vn)",
            },
          });

          const geo = await res.json();
          if (geo?.length > 0) {
            setPos([parseFloat(geo[0].lat), parseFloat(geo[0].lon)]);
          }
        }
      } catch (err) {
        console.error("Lỗi khi load chiến dịch:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader animate loop className="h-8 w-8 text-color" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Không tìm thấy chiến dịch.
      </div>
    );
  }

  const raised = Number(campaign.receivedAmount || 0);
  const target = Number(campaign.targetAmount || 1);
  const progress = Math.min(Math.round((raised / target) * 100), 100);

  return (
    <div className="relative flex flex-col md:flex-row">
      <div className="absolute overflow-y-hidden md:w-[420px] w-full top-[80px] left-0 h-[calc(100vh-158px)] bg-white border-r border-gray-200 p-5 z-10">
        <h2 className="text-lg font-semibold mb-1 text-gray-800">
          Chi tiết chiến dịch
        </h2>

        <div className="rounded-xl overflow-hidden shadow">
          <Image
            src={campaign.coverImage || "/images/default-cover.jpg"}
            alt={campaign.title}
            width={600}
            height={300}
            className="object-cover w-full h-[200px]"
          />
        </div>

        <div className="mt-3">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {campaign.category?.title || "Khác"}
          </span>
        </div>

        <h1 className="text-lg font-bold text-gray-900 mt-2">
          {campaign.title}
        </h1>

        {campaign.location && (
          <div className="mt-1 text-sm text-gray-600 flex items-start gap-1">
            <span>📍</span>
            <span>{campaign.location}</span>
          </div>
        )}

        <p className="text-sm mt-2 text-gray-700">
          Tạo bởi{" "}
          <span className="font-semibold text-[#ad4e28]">
            {campaign.creator?.full_name || "Tổ chức thiện nguyện"}
          </span>
        </p>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1 text-green-600 font-medium">
            🎯 Mục tiêu chiến dịch
          </div>
          <span className="font-semibold">{fmtVND(target)}</span>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span>Đã đạt được</span>
          <span className="font-semibold text-[#ad4e28]">
            {fmtVND(raised)} ({progress}%)
          </span>
        </div>

        <div className="mt-2 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 bg-[#f97316] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                campaign.location || ""
              )}`;
              window.open(mapUrl, "_blank");
            }}
            className="flex-1 border border-[#ad4e28] text-[#ad4e28] py-2 rounded-lg font-medium hover:bg-[#ad4e28]/10 transition"
          >
            Chỉ đường
          </button>
          <button
            onClick={() => router.push(`/campaign/${campaign.id}`)}
            className="flex-1 bg-[#ad4e28] text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      <div className="flex-1 md:ml-[420px] h-[calc(100vh-72px)] mt-[72px] md:mt-0 relative z-0">
        {pos ? (
          <MapContainer center={pos} zoom={14} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={pos}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{campaign.title}</div>
                  <div className="text-xs text-gray-500">
                    {campaign.location}
                  </div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Không tìm thấy vị trí
          </div>
        )}
      </div>
    </div>
  );
}
