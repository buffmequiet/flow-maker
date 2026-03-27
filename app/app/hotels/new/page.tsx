import HotelForm from "@/components/HotelForm";

export default function NewHotelPage() {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">호텔 등록</h1>
        <p className="text-sm text-gray-500 mt-1">새 호텔을 등록합니다.</p>
      </div>
      <HotelForm />
    </div>
  );
}
