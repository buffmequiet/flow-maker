import { getBooking, listHotels, listPartners } from "@/lib/bkend";
import { Booking, Hotel, Partner } from "@/lib/types";
import BookingForm from "@/components/BookingForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditBookingPage({ params }: Props) {
  const { id } = await params;
  let booking: Booking | null = null;
  let hotels: Hotel[] = [];
  let partners: Partner[] = [];

  try { booking = await getBooking(id); } catch { notFound(); }
  if (!booking) notFound();
  try { hotels = await listHotels(); } catch { hotels = []; }
  try { partners = await listPartners(); } catch { partners = []; }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">예약 수정</h1>
        <p className="text-sm text-gray-500 mt-1">{booking.tourist_name}</p>
      </div>
      <BookingForm initial={booking} bookingId={id} hotels={hotels} partners={partners} />
    </div>
  );
}
