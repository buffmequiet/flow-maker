import { listHotels, listPartners } from "@/lib/bkend";
import { Hotel, Partner } from "@/lib/types";
import BookingForm from "@/components/BookingForm";

export default async function NewBookingPage() {
  let hotels: Hotel[] = [];
  let partners: Partner[] = [];
  try { hotels = await listHotels(); } catch { hotels = []; }
  try { partners = await listPartners(); } catch { partners = []; }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">예약 등록</h1>
        <p className="text-sm text-gray-500 mt-1">새 예약을 등록합니다.</p>
      </div>
      <BookingForm hotels={hotels} partners={partners} />
    </div>
  );
}
