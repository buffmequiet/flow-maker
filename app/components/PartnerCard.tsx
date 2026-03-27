"use client";

import Link from "next/link";
import { Partner } from "@/lib/types";
import { useState } from "react";

export default function PartnerCard({ partner }: { partner: Partner }) {
  const [active, setActive] = useState(partner.is_active !== false);
  const [loading, setLoading] = useState(false);

  async function toggleStatus() {
    setLoading(true);
    try {
      await fetch(`/api/partners/${partner.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !active }),
      });
      setActive((v) => !v);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 이미지 영역 */}
      <div className="h-36 bg-gray-100 relative">
        {partner.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.image_url}
            alt={partner.name_ko}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            이미지 없음
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button
            onClick={toggleStatus}
            disabled={loading}
            className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
              active
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {active ? "활성" : "비활성"}
          </button>
        </div>
      </div>

      <Link href={`/partners/${partner.id}`} className="block p-4 hover:bg-gray-50 transition-colors">
        <p className="font-semibold text-gray-900 text-sm">{partner.name_ko}</p>
        {partner.name_en && (
          <p className="text-xs text-gray-400 mt-0.5">{partner.name_en}</p>
        )}
        <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
          {partner.service_type}
        </span>
      </Link>
    </div>
  );
}
