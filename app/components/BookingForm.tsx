"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Booking, Hotel, Partner, SERVICE_TYPES } from "@/lib/types";

type Props = {
  initial?: Partial<Booking>;
  bookingId?: string;
  hotels: Hotel[];
  partners: Partner[];
};

export default function BookingForm({ initial, bookingId, hotels, partners }: Props) {
  const router = useRouter();
  const isEdit = !!bookingId;

  const [touristName, setTouristName] = useState(initial?.tourist_name ?? "");
  const [touristContact, setTouristContact] = useState(initial?.tourist_contact ?? "");
  const [hotelId, setHotelId] = useState(initial?.hotel_id ?? "");
  const [serviceType, setServiceType] = useState(initial?.service_type ?? "");
  const [partnerId, setPartnerId] = useState(initial?.partner_id ?? "");
  const [requestedDatetime, setRequestedDatetime] = useState(initial?.requested_datetime ?? "");
  const [status, setStatus] = useState(initial?.status ?? "요청");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredPartners = serviceType
    ? partners.filter((p) => p.service_type === serviceType && p.status === "제휴 완료")
    : partners.filter((p) => p.status === "제휴 완료");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!touristName || !serviceType) {
      setError("관광객 이름과 서비스 유형은 필수입니다.");
      return;
    }
    setError("");
    setSubmitting(true);

    const selectedHotel = hotels.find((h) => h.id === hotelId);
    const selectedPartner = partners.find((p) => p.id === partnerId);

    const payload = {
      status,
      tourist_name: touristName,
      tourist_contact: touristContact,
      hotel_id: hotelId,
      hotel_name: selectedHotel?.name ?? "",
      service_type: serviceType,
      partner_id: partnerId,
      partner_name: selectedPartner?.name_ko ?? "",
      requested_datetime: requestedDatetime,
      notes,
      created_at: isEdit ? initial?.createdAt : new Date().toISOString(),
    };

    try {
      const url = isEdit ? `/api/bookings/${bookingId}` : "/api/bookings";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      router.push("/bookings");
      router.refresh();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">예약 정보</h2>

        {/* 상태 */}
        <div>
          <label className="block text-xs text-gray-500 mb-2">예약 상태</label>
          <div className="flex gap-2">
            {(["요청", "확정", "완료", "취소"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  status === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 관광객 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">관광객 이름 <span className="text-red-500">*</span></label>
            <input type="text" value={touristName} onChange={(e) => setTouristName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="John Smith" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">연락처</label>
            <input type="text" value={touristContact} onChange={(e) => setTouristContact(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="전화번호 또는 이메일" />
          </div>
        </div>

        {/* 호텔 */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">호텔</label>
          <select value={hotelId} onChange={(e) => setHotelId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">선택 안 함</option>
            {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>

        {/* 서비스 유형 */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">서비스 유형 <span className="text-red-500">*</span></label>
          <select value={serviceType} onChange={(e) => { setServiceType(e.target.value); setPartnerId(""); }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">선택</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* 매칭 업체 */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">매칭 업체</label>
          <select value={partnerId} onChange={(e) => setPartnerId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">미배정</option>
            {filteredPartners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name_ko}{p.district_tags?.length ? ` (${p.district_tags.join(", ")})` : ""}
              </option>
            ))}
          </select>
          {serviceType && filteredPartners.length === 0 && (
            <p className="text-xs text-red-400 mt-1">해당 유형의 제휴 완료 업체가 없습니다.</p>
          )}
        </div>

        {/* 예약 일시 */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">예약 일시</label>
          <input type="datetime-local" value={requestedDatetime} onChange={(e) => setRequestedDatetime(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>

        {/* 메모 */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">메모</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="특이사항, 요청사항 등..." />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting}
          className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
          {submitting ? "저장 중..." : isEdit ? "수정 저장" : "예약 등록"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors">취소</button>
      </div>
    </form>
  );
}
