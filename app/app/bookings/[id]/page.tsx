import Link from "next/link";
import { getBooking } from "@/lib/bkend";
import { Booking, BOOKING_STATUS_STYLE } from "@/lib/types";
import { notFound } from "next/navigation";
import BookingDeleteButton from "@/components/BookingDeleteButton";
import BookingStatusSelect from "@/components/BookingStatusSelect";
import CopyButton from "@/components/CopyButton";

type Props = { params: Promise<{ id: string }> };

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  let booking: Booking | null = null;
  try { booking = await getBooking(id); } catch { notFound(); }
  if (!booking) notFound();

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            <Link href="/bookings" className="hover:underline">예약 관리</Link> /
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{booking.tourist_name}</h1>
          {booking.tourist_contact && <p className="text-sm text-gray-400 mt-0.5">{booking.tourist_contact}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/bookings/${id}/edit`}
            className="border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            수정
          </Link>
          <BookingDeleteButton bookingId={id} />
        </div>
      </div>

      <div className="space-y-4">
        {/* 상태 빠른 변경 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">예약 상태</p>
          <BookingStatusSelect bookingId={id} current={booking.status} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">예약 내용</p>
          <Row label="호텔">{booking.hotel_name || "-"}</Row>
          <Row label="서비스">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{booking.service_type}</span>
          </Row>
          <Row label="매칭 업체">
            {booking.partner_id ? (
              <Link href={`/partners/${booking.partner_id}`} className="text-blue-600 hover:underline text-sm">
                {booking.partner_name}
              </Link>
            ) : <span className="text-gray-400">미배정</span>}
          </Row>
          <Row label="예약 일시">
            {booking.requested_datetime
              ? new Date(booking.requested_datetime).toLocaleString("ko-KR")
              : "-"}
          </Row>
          <Row label="관광객 연락처">
            <span className="flex items-center gap-2">
              {booking.tourist_contact || "-"}
              {booking.tourist_contact && <CopyButton text={booking.tourist_contact} />}
            </span>
          </Row>
        </div>

        {booking.notes && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">메모</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{children}</span>
    </div>
  );
}
