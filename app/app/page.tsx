import Link from "next/link";
import { listPartners, listHotels } from "@/lib/bkend";
import { Partner, Hotel, SERVICE_TYPES, PARTNER_STATUSES, STATUS_STYLE } from "@/lib/types";

export default async function DashboardPage() {
  let partners: Partner[] = [];
  let hotels: Hotel[] = [];
  try { partners = await listPartners(); } catch { partners = []; }
  try { hotels = await listHotels(); } catch { hotels = []; }

  const byStatus = PARTNER_STATUSES.map((s) => ({
    status: s,
    count: partners.filter((p) => p.status === s).length,
  })).filter(({ count }) => count > 0);

  const byType = SERVICE_TYPES.map((type) => ({
    type,
    count: partners.filter((p) => p.service_type === type).length,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">운영 현황</p>
        </div>
        <Link href="/partners/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          업체 등록
        </Link>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">전체 제휴업체</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{partners.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">제휴 완료</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {partners.filter((p) => p.status === "제휴 완료").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">등록 호텔</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{hotels.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 상태별 현황 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">업체 상태별</p>
          {byStatus.length === 0 ? (
            <p className="text-sm text-gray-400">등록된 업체가 없습니다.</p>
          ) : (
            <div className="space-y-2.5">
              {byStatus.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[status]}`}>{status}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}개</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 유형별 현황 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">서비스 유형별</p>
          <div className="space-y-2.5">
            {byType.map(({ type, count }) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <span className="text-sm font-semibold text-gray-900">{count}개</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
