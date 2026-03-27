"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HotelDeleteButton({ hotelId }: { hotelId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`/api/hotels/${hotelId}`, { method: "DELETE" });
      router.push("/hotels");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">정말 삭제?</span>
        <button onClick={handleDelete} disabled={loading}
          className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-50">
          {loading ? "삭제 중..." : "확인"}
        </button>
        <button onClick={() => setConfirm(false)}
          className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">취소</button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirm(true)}
      className="text-sm text-red-400 hover:text-red-600 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
      삭제
    </button>
  );
}
