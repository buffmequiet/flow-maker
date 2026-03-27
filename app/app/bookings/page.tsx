import Link from "next/link";
import { listBookings } from "@/lib/bkend";
import { Booking, BOOKING_STATUS_STYLE } from "@/lib/types";

export default async function BookingsPage() {
  let bookings: Booking[] = [];
  try { bookings = await listBookings(); } catch { bookings = []; }

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {bookings.length}건</p>
        </div>
        <Link href="/bookings/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          예약 등록
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">등록된 예약이 없습니다.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">관광객</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">호텔</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">서비스</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">매칭 업체</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">예약 일시</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <Link href={`/bookings/${b.id}`} className="block">
                      <p className="font-medium text-gray-900">{b.tourist_name}</p>
                      {b.tourist_contact && <p className="text-xs text-gray-400">{b.tourist_contact}</p>}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.hotel_name || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{b.service_type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.partner_name || <span className="text-gray-300">미배정</span>}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {b.requested_datetime
                      ? new Date(b.requested_datetime).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${BOOKING_STATUS_STYLE[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
