"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { Map, MapPin } from "lucide-react";

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
  const [showSidebar, setShowSidebar] = useState(true);

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
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-50 to-white">
        <Loader animate loop className="h-10 w-10 text-color" />
        <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-6xl">🗺️</div>
        <p className="text-gray-500 font-medium">Không tìm thấy chiến dịch.</p>
        <button
          onClick={() => router.push('/s')}
          className="px-6 py-2 bg-[#ad4e28] text-white rounded-full font-medium hover:opacity-90 transition"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const raised = Number(campaign.receivedAmount || 0);
  const target = Number(campaign.targetAmount || 1);

  return (
    <div className="relative flex flex-col lg:flex-row h-screen">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden fixed top-20 right-4 z-30 bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:bg-gray-50 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {showSidebar ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <div
        className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 fixed lg:absolute overflow-y-auto lg:w-[440px] w-[90%] max-w-[400px] top-[65px] left-0 h-[100vh] lg:h-[calc(100vh-65px)] bg-white/95 backdrop-blur-md lg:border-r border-gray-200 p-4 sm:p-6 z-20 lg:z-10 hide-scrollbar`}
      >

        <div className="rounded-2xl overflow-hidden shadow-md ring-1 ring-gray-200">
          <Image
            src={campaign.coverImage || "/images/default-cover.jpg"}
            alt={campaign.title}
            width={600}
            height={300}
            className="object-cover w-full h-[180px] sm:h-[220px]"
          />
        </div>

        <div className="mt-4">
          <span className="text-xs font-semibold bg-gradient-to-r from-orange-100 to-amber-100 text-[#ad4e28] px-3 py-1.5 rounded-full border border-orange-200">
            {campaign.category?.title || "Khác"}
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-gray-900 mt-3 leading-tight">
          {campaign.title}
        </h1>

        {campaign.location && (
          <div className="mt-3 text-sm text-gray-600 flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
            <span className="text-lg"><MapPin className="mr-1 w-4 h-4 inline" /></span>
            <span className="flex-1">{campaign.location}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                campaign.location || ""
              )}`;
              window.open(mapUrl, "_blank");
            }}
            className="flex-1 border-2 border-[#ad4e28] text-[#ad4e28] py-3 rounded-xl font-semibold hover:bg-[#ad4e28]/10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span><Map className="inline mr-1 w-4 h-4" /> Chỉ đường</span>
          </button>
          <button
            onClick={() => router.push(`/campaign/${campaign.id}`)}
            className="flex-1 bg-gradient-to-r from-[#ad4e28] to-[#8b3e20] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-10 top-[65px]"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="flex-1 lg:ml-[100px] h-[100vh] relative z-0 pt-16">
        {pos ? (
          <MapContainer center={pos} zoom={14} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={pos}>
              <Popup>
                <div className="space-y-2 p-2">
                  <div className="font-bold text-base text-gray-900">{campaign.title}</div>
                  <div className="text-sm text-gray-600 flex items-start gap-1">
                    <span>📍</span>
                    <span>{campaign.location}</span>
                  </div>
                  <button
                    onClick={() => router.push(`/campaign/${campaign.id}`)}
                    className="w-full mt-2 bg-[#ad4e28] text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-6xl">🗺️</div>
            <p className="font-medium">Không tìm thấy vị trí</p>
          </div>
        )}
      </div>
    </div>
  );
}
