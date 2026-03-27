"use client";

import Link from "next/link";
import { useState } from "react";
import { Partner, PartnerStatus, PARTNER_STATUSES, STATUS_STYLE } from "@/lib/types";

export default function PartnerCard({ partner }: { partner: Partner }) {
  const [status, setStatus] = useState<PartnerStatus>(partner.status ?? "발굴");
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(next: PartnerStatus) {
    setSaving(true);
    setStatus(next);
    await fetch(`/api/partners/${partner.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next, is_active: next === "제휴 완료" }),
    });
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
      <div className="h-28 bg-gray-100 relative">
        {partner.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.image_url} alt={partner.name_ko} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">이미지 없음</div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/partners/${partner.id}`} className="block mb-3">
          <p className="font-semibold text-gray-900 text-sm truncate">{partner.name_ko}</p>
          {partner.name_en && <p className="text-xs text-gray-400 mt-0.5 truncate">{partner.name_en}</p>}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{partner.service_type}</span>
            {partner.district_tags?.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </Link>

        {/* 상태 빠른 변경 */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as PartnerStatus)}
          disabled={saving}
          className={`w-full text-xs font-medium rounded-lg px-2 py-1.5 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 ${STATUS_STYLE[status]}`}
        >
          {PARTNER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
