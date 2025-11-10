"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMap, useMapEvents } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// --- FIX leaflet default marker icons ---
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// --- Dynamic imports to prevent SSR errors ---
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });
const Rectangle = dynamic(() => import("react-leaflet").then((m) => m.Rectangle), { ssr: false });

// --- Types ---
type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// --- CONSTANT: HCM City bounding box ---
// Tọa độ khu vực nội thành và ngoại thành TP.HCM
const HCM_BOUNDS: [[number, number], [number, number]] = [
  [10.70, 106.50],
  [10.95, 106.85],
];


// --- Component: handle map click events ---
function MapClickHandler({
  onClick,
}: {
  onClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: (e) => {
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest("input") || target.closest("button") || target.closest("ul")) return;
      onClick(e);
    },
  });
  return null;
}

// --- Component: search bar integrated with Nominatim ---
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
          value + " Ho Chi Minh City"
        )}&addressdetails=1&limit=10&countrycodes=VN&bounded=1&viewbox=106.45,10.45,106.95,11.00`
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
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
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto w-[90%] max-w-md">
      <div className="bg-white shadow-lg rounded-lg relative">
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm địa điểm..."
          className="h-10 text-sm"
        />
        {showResults && results.length > 0 && (
          <ul className="absolute bg-white mt-1 w-full rounded-lg shadow border border-gray-200 max-h-48 overflow-auto z-50">
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

// --- MAIN COMPONENT ---
export default function LocationPicker({
  value,
  onChange,
  placeholder = "Chọn địa điểm",
  disabled = false,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState(value);
  const [position, setPosition] = useState<[number, number]>([10.762622, 106.660172]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync address when value changes from parent
  useEffect(() => {
    if (value && value !== address) {
      setAddress(value);
    }
  }, [value, address]);

  // Geocode address to position when dialog opens
  useEffect(() => {
    if (isOpen && address && address.trim() !== "") {
      const geocodeAddress = async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              address
            )}&limit=1&countrycodes=VN`
          );
          const data = await res.json();
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setPosition([lat, lon]);
          }
        } catch (err) {
          console.error("Geocoding error:", err);
        }
      };
      geocodeAddress();
    }
  }, [isOpen, address]);

  // --- Reverse geocoding (lat/lng -> address) ---
  const getAddressFromCoords = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    setError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi&addressdetails=1`
      );
      const data = await res.json();
      
      if (data.address) {
        // Build a more readable address from components
        const parts = [];
        
        // Add house number and road
        if (data.address.house_number) parts.push(data.address.house_number);
        if (data.address.road) parts.push(data.address.road);
        
        // Add ward/suburb
        if (data.address.suburb) parts.push(data.address.suburb);
        else if (data.address.quarter) parts.push(data.address.quarter);
        
        // Add district
        if (data.address.city_district) parts.push(data.address.city_district);
        else if (data.address.district) parts.push(data.address.district);
        
        // Add city
        if (data.address.city) parts.push(data.address.city);
        else if (data.address.province) parts.push(data.address.province);
        
        const formattedAddress = parts.length > 0 
          ? parts.join(", ") 
          : data.display_name;
        
        setAddress(formattedAddress);
        return formattedAddress;
      } else if (data.display_name) {
        setAddress(data.display_name);
        return data.display_name;
      } else {
        const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setAddress(fallback);
        return fallback;
      }
    } catch (err) {
      console.error("Reverse geocode error:", err);
      const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(fallback);
      return fallback;
    } finally {
      setLoadingAddress(false);
    }
  };

  // --- Handle map click ---
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;

    // Kiểm tra nếu nằm ngoài khu vực HCM
    const bounds = L.latLngBounds(HCM_BOUNDS[0], HCM_BOUNDS[1]);
    if (!bounds.contains([lat, lng])) {
      setError("⚠️ Vui lòng chọn vị trí trong khu vực Thành phố Hồ Chí Minh.");
      return;
    }

    setError(null);
    setPosition([lat, lng]);
    await getAddressFromCoords(lat, lng);
  };

  // --- Khi chọn từ ô tìm kiếm ---
  const handleSearchSelect = async (pos: [number, number], addr: string) => {
    const bounds = L.latLngBounds(HCM_BOUNDS[0], HCM_BOUNDS[1]);
    if (!bounds.contains(pos)) {
      setError("⚠️ Vui lòng chọn vị trí trong khu vực Thành phố Hồ Chí Minh.");
      return;
    }

    setError(null);
    setPosition(pos);
    setAddress(addr);
  };

  // --- Khi xác nhận ---
  const handleConfirm = () => {
    onChange(address);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          <Input
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly
            className="pr-10 cursor-pointer"
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </DialogTrigger>

      <DialogContent className="!max-w-[95vw] !max-h-[95vh] !w-[95vw] !h-[95vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>Chọn địa điểm tại Thành phố Hồ Chí Minh</DialogTitle>
        </DialogHeader>

        <div className="flex-1 px-6 pb-4 space-y-4 overflow-hidden flex flex-col">
          {/* Map */}
          <div className="flex-1 w-full rounded-lg overflow-hidden border relative min-h-0">
            <MapContainer
              center={position}
              zoom={13}
              className="h-full w-full z-0"
              maxBounds={HCM_BOUNDS}
              minZoom={11}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Giới hạn khu vực HCM */}
              <Rectangle
                bounds={HCM_BOUNDS}
                pathOptions={{
                  color: "#ad4e28",
                  weight: 3,
                  fillColor: "#ad4e28",
                  fillOpacity: 0.05,
                  dashArray: "10, 10",
                }}
                interactive={false}
              />

              <MapSearch onSelect={handleSearchSelect} />
              <MapClickHandler onClick={handleMapClick} />

              <Marker position={position}>
                <Popup>📍 Vị trí đã chọn</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 font-medium">{error}</div>
          )}

          {/* Address Input */}
          <div className="space-y-2 flex-shrink-0">
            <label className="text-sm font-medium text-gray-700">
              Địa chỉ
              {loadingAddress && (
                <span className="ml-2 text-xs text-blue-600 animate-pulse">
                  ⏳ Đang tải...
                </span>
              )}
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={loadingAddress ? "Đang lấy địa chỉ..." : "Click vào bản đồ để chọn vị trí"}
              className="h-10"
              disabled={loadingAddress}
            />
            <p className="text-xs text-gray-500">
              💡 Click vào bản đồ hoặc tìm kiếm để chọn địa điểm
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex justify-end gap-2 px-6 pb-6 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#ad4e28] text-white hover:bg-[#9c4624]"
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
