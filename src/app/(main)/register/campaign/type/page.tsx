"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateForm } from "@/store/slices/campaign-form-slice";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/use-category";
import { useMap, useMapEvents } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { toast } from "sonner";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

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
const Polygon = dynamic(() => import("react-leaflet").then((m) => m.Polygon), {
  ssr: false,
});

const HCM_BOUNDS = {
  north: 10.9,
  south: 10.65,
  west: 106.55,
  east: 106.85,
};

function MapClickHandler({
  onClick,
}: {
  onClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: (e) => {
      const target = e.originalEvent.target as HTMLElement;

      if (
        target.closest("input") ||
        target.closest("button") ||
        target.closest("ul")
      ) {
        return;
      }
      onClick(e);
    },
  });
  return null;
}

function MapSearch({
  onSelect,
}: {
  onSelect: (pos: [number, number], addr: string) => void;
}) {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&addressdetails=1&limit=10&countrycodes=VN&viewbox=106.55,10.90,106.85,10.65&bounded=1`
      );

      const data: NominatimResult[] = await res.json();

      const filtered = data.filter(
        (r) =>
          r.display_name.includes("Hồ Chí Minh") ||
          r.display_name.includes("Ho Chi Minh")
      );

      setResults(filtered);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelect = (r: NominatimResult) => {
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    const pos: [number, number] = [lat, lon];
    map.setView(pos, 15);
    onSelect(pos, r.display_name);
    setQuery(r.display_name);
    setShowResults(false);
  };

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto w-[600px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white shadow-lg rounded-lg relative">
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm địa chỉ trong TP.HCM..."
          className="h-10 text-sm"
        />

        {showResults && results.length > 0 && (
          <ul className="absolute bg-white mt-1 w-full rounded-lg shadow border border-gray-200 max-h-56 overflow-auto z-50">
            {results.map((r, i) => (
              <li
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(r);
                }}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {r.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function HCMPolygon() {
  const polygonPoints: [number, number][] = [
    [HCM_BOUNDS.north, HCM_BOUNDS.west],
    [HCM_BOUNDS.north, HCM_BOUNDS.east],
    [HCM_BOUNDS.south, HCM_BOUNDS.east],
    [HCM_BOUNDS.south, HCM_BOUNDS.west],
  ];
  return (
    <Polygon
      positions={polygonPoints}
      pathOptions={{
        color: "#ad4e28",
        weight: 2,
        fillColor: "#ad4e28",
        fillOpacity: 0.1,
      }}
    />
  );
}

export default function CreateCampaignStepType() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { categories, loading, error } = useCategories();

  const [selected, setSelected] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const [position, setPosition] = useState<[number, number]>([
    10.762622, 106.660172,
  ]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;

    const isInsideHCM =
      lat <= HCM_BOUNDS.north &&
      lat >= HCM_BOUNDS.south &&
      lng >= HCM_BOUNDS.west &&
      lng <= HCM_BOUNDS.east;

    if (!isInsideHCM) {
      toast.warning("Vui lòng chọn vị trí trong khu vực TP. Hồ Chí Minh!");
      return;
    }

    setPosition([lat, lng]);
    setLoadingAddress(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`
      );
      const data = await res.json();
      setAddress(data.display_name || "");
    } catch (err) {
      console.error("Reverse geocode error:", err);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleSearchSelect = (pos: [number, number], addr: string) => {
    setPosition(pos);
    setAddress(addr);
  };

  const handleNextStep = () => {
    if (!selected || !address) return;
    dispatch(updateForm({ categoryId: selected, location: address }));
    router.push("/register/campaign/goal");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-18">
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start lg:divide-x lg:divide-gray-200">
          <div className="lg:col-span-1 lg:sticky lg:top-20 pr-8">
            <p className="text-sm text-gray-500 mb-3">Bước 1</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-snug">
              Chọn vị trí chiến dịch cùng{" "}
              <strong className="text-color">FoodFund</strong>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Tìm kiếm hoặc chạm vào bản đồ để chọn địa điểm trong khu vực{" "}
              <strong className="text-color">TP. Hồ Chí Minh</strong>.
            </p>
          </div>

          <div className="lg:col-span-2 space-y-10 pl-8">
            <div className="space-y-3 relative">
              <h2 className="text-xl font-semibold text-color mb-3">
                Chọn địa điểm trên bản đồ
              </h2>

              <div className="h-[400px] w-full rounded-xl overflow-hidden shadow relative">
                <MapContainer
                  center={position}
                  zoom={13}
                  className="h-full w-full z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapSearch onSelect={handleSearchSelect} />

                  <HCMPolygon />

                  <MapClickHandler onClick={handleMapClick} />

                  <Marker position={position}>
                    <Popup>Vị trí đã chọn</Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <Input
                  value={loadingAddress ? "Đang lấy địa chỉ..." : address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Địa chỉ tự động hiển thị sau khi chọn hoặc tìm kiếm"
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-color">
                Chọn loại chiến dịch
              </h2>

              {loading && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                  <p>Đang tải danh mục...</p>
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelected(cat.id)}
                      className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                        selected === cat.id
                          ? "btn-color text-white shadow-md scale-105"
                          : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                className={`w-full h-12 text-base font-semibold ${
                  !selected || !address
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-color text-white"
                }`}
                disabled={!selected || !address}
                onClick={handleNextStep}
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
