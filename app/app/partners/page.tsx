import Link from "next/link";
import { listPartners } from "@/lib/bkend";
import { Partner, SERVICE_TYPES } from "@/lib/types";
import PartnerCard from "@/components/PartnerCard";

type Props = { searchParams: Promise<{ type?: string }> };

export default async function PartnersPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const activeType = type && SERVICE_TYPES.includes(type as (typeof SERVICE_TYPES)[number]) ? type : undefined;

  let partners: Partner[] = [];
  try {
    partners = await listPartners(activeType);
  } catch {
    partners = [];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">제휴업체</h1>
          <p className="text-sm text-gray-500 mt-1">총 {partners.length}개</p>
        </div>
        <Link
          href="/partners/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          업체 등록
        </Link>
      </div>

      {/* 유형 필터 탭 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/partners"
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeType
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          전체
        </Link>
        {SERVICE_TYPES.map((t) => (
          <Link
            key={t}
            href={`/partners?type=${t}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeType === t
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      {partners.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          등록된 업체가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((p) => (
            <PartnerCard key={p.id} partner={p} />
          ))}
        </div>
      )}
    </div>
  );
}
