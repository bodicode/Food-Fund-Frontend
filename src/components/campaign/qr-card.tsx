import Image from "next/image";

export function QRCard() {
  return (
    <div className="bg-color-base p-6 rounded-2xl shadow-md border text-center">
      <h3 className="font-semibold text-gray-800 mb-3">Quét mã QR để ủng hộ</h3>
      <Image
        src="/images/qr-code.png"
        alt="QR Code"
        width={180}
        height={180}
        className="mx-auto mb-3"
      />
    </div>
  );
}
