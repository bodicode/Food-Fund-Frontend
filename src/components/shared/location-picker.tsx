"use client";

import { useState } from "react";
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

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Dynamic imports
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

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

function MapClickHandler({ onClick }: { onClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: (e) => {
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest("input") || target.closest("button") || target.closest("ul")) {
        return;
      }
      onClick(e);
    },
  });
  return null;
}

function MapSearch({ onSelect }: { onSelect: (pos: [number, number], addr: string) => void }) {
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
        )}&addressdetails=1&limit=10&countrycodes=VN`
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

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    setLoadingAddress(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`
      );
      const data = await res.json();
      const newAddress = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setAddress(newAddress);
    } catch (err) {
      console.error("Reverse geocode error:", err);
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleSearchSelect = (pos: [number, number], addr: string) => {
    setPosition(pos);
    setAddress(addr);
  };

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

      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Chọn địa điểm</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4">
          {/* Map */}
          <div className="h-80 w-full rounded-lg overflow-hidden border relative">
            <MapContainer center={position} zoom={13} className="h-full w-full z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapSearch onSelect={handleSearchSelect} />
              <MapClickHandler onClick={handleMapClick} />
              <Marker position={position}>
                <Popup>📍 Vị trí đã chọn</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
            <Input
              value={loadingAddress ? "Đang lấy địa chỉ..." : address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ sẽ hiển thị sau khi chọn vị trí"
              className="h-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} className="bg-[#ad4e28] text-white hover:bg-[#9c4624]">
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}