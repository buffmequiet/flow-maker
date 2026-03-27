"use client";

import { useState, useMemo } from "react";
import { Partner, PartnerStatus, PARTNER_STATUSES, SERVICE_TYPES } from "@/lib/types";
import PartnerCard from "@/components/PartnerCard";

export default function PartnerListClient({ partners }: { partners: Partner[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PartnerStatus | "전체">("전체");
  const [typeFilter, setTypeFilter] = useState<string>("전체");
  const [districtFilter, setDistrictFilter] = useState<string>("전체");

  const allDistricts = useMemo(() => {
    const tags = partners.flatMap((p) => p.district_tags ?? []);
    return ["전체", ...Array.from(new Set(tags)).sort()];
  }, [partners]);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name_ko?.toLowerCase().includes(q) && !p.name_en?.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== "전체" && p.status !== statusFilter) return false;
      if (typeFilter !== "전체" && p.service_type !== typeFilter) return false;
      if (districtFilter !== "전체" && !p.district_tags?.includes(districtFilter)) return false;
      return true;
    });
  }, [partners, search, statusFilter, typeFilter, districtFilter]);

  return (
    <div>
      {/* 검색 + 필터 */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="업체명 검색..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <div className="flex flex-wrap gap-2">
          {/* 상태 필터 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PartnerStatus | "전체")}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
          >
            <option value="전체">상태: 전체</option>
            {PARTNER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* 유형 필터 */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
          >
            <option value="전체">유형: 전체</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* 구 태그 필터 */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
          >
            {allDistricts.map((d) => (
              <option key={d} value={d}>{d === "전체" ? "지역: 전체" : d}</option>
            ))}
          </select>

          {(search || statusFilter !== "전체" || typeFilter !== "전체" || districtFilter !== "전체") && (
            <button
              onClick={() => { setSearch(""); setStatusFilter("전체"); setTypeFilter("전체"); setDistrictFilter("전체"); }}
              className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">{filtered.length}개</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">검색 결과가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => <PartnerCard key={p.id} partner={p} />)}
        </div>
      )}
    </div>
  );
}
