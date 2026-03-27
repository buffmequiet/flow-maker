"use client";

import Link from "next/link";
import { Partner, STATUS_STYLE } from "@/lib/types";

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
      <div className="h-32 bg-gray-100 relative">
        {partner.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.image_url} alt={partner.name_ko} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">이미지 없음</div>
        )}
      </div>
      <Link href={`/partners/${partner.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{partner.name_ko}</p>
            {partner.name_en && <p className="text-xs text-gray-400 mt-0.5 truncate">{partner.name_en}</p>}
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[partner.status] ?? "bg-gray-100 text-gray-500"}`}>
            {partner.status ?? "-"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{partner.service_type}</span>
          {partner.district_tags?.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </Link>
    </div>
  );
}
