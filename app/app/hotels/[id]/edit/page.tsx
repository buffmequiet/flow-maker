import { getHotel } from "@/lib/bkend";
import { Hotel } from "@/lib/types";
import HotelForm from "@/components/HotelForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditHotelPage({ params }: Props) {
  const { id } = await params;
  let hotel: Hotel | null = null;
  try { hotel = await getHotel(id); } catch { notFound(); }
  if (!hotel) notFound();

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">호텔 수정</h1>
        <p className="text-sm text-gray-500 mt-1">{hotel.name}</p>
      </div>
      <HotelForm initial={hotel} hotelId={id} />
    </div>
  );
}
