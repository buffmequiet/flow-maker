"use client";

import { useState } from "react";
import { BookingStatus, BOOKING_STATUS_STYLE } from "@/lib/types";

export default function BookingStatusSelect({ bookingId, current }: { bookingId: string; current: BookingStatus }) {
  const [status, setStatus] = useState<BookingStatus>(current);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: BookingStatus) {
    setSaving(true);
    setStatus(next);
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {(["요청", "확정", "완료", "취소"] as BookingStatus[]).map((s) => (
        <button key={s} onClick={() => handleChange(s)} disabled={saving}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors disabled:opacity-50 ${
            status === s
              ? `${BOOKING_STATUS_STYLE[s]} border-transparent ring-2 ring-offset-1 ring-gray-300`
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
          }`}>
          {s}
        </button>
      ))}
    </div>
  );
}
