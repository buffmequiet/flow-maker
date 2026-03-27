import Link from "next/link";
import { listPartners, listHotels } from "@/lib/bkend";
import { Partner, Hotel, SERVICE_TYPES, PARTNER_STATUSES, STATUS_STYLE, daysAgo } from "@/lib/types";

export default async function DashboardPage() {
  let partners: Partner[] = [];
  let hotels: Hotel[] = [];
  try { partners = await listPartners(); } catch { partners = []; }
  try { hotels = await listHotels(); } catch { hotels = []; }

  // 상태별
  const byStatus = PARTNER_STATUSES.map((s) => ({
    status: s,
    count: partners.filter((p) => p.status === s).length,
  })).filter(({ count }) => count > 0);

  // 유형별
  const byType = SERVICE_TYPES.map((t) => ({
    type: t,
    count: partners.filter((p) => p.service_type === t).length,
  }));

  // C. 액션 항목 ─────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const expiringContracts = partners.filter(
    (p) => p.contract_end && p.contract_end >= today && p.contract_end <= in30 && p.status === "제휴 완료"
  );

  const stalePending = partners.filter((p) => {
    if (p.status !== "접촉 중" && p.status !== "협의 중") return false;
    const logs = p.activity_log ?? [];
    if (logs.length === 0) return true;
    const latest = logs[logs.length - 1].date;
    return daysAgo(latest) >= 7;
  });

  // D. 커버리지 갭 ────────────────────────────────────────
  const completedPartners = partners.filter((p) => p.status === "제휴 완료");
  const hotelDistricts = [...new Set(hotels.flatMap((h) => h.district_tags ?? []))];
  const gaps = hotelDistricts.filter(
    (d) => !completedPartners.some((p) => p.district_tags?.includes(d))
  );

  const actionCount = expiringContracts.length + stalePending.length + gaps.length;

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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">전체 제휴업체</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{partners.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">제휴 완료</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {partners.filter((p) => p.status === "제휴 완료").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">등록 호텔</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{hotels.length}</p>
        </div>
      </div>

      {/* C. 액션 항목 */}
      {actionCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <p className="text-sm font-semibold text-amber-800 mb-3">오늘 확인할 것 ({actionCount})</p>
          <div className="space-y-2">
            {expiringContracts.map((p) => (
              <Link key={p.id} href={`/partners/${p.id}`}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 hover:shadow-sm transition-shadow">
                <div>
                  <span className="text-sm font-medium text-gray-900">{p.name_ko}</span>
                  <span className="ml-2 text-xs text-amber-600">계약 만료 {p.contract_end}</span>
                </div>
                <span className="text-xs text-gray-400">계약 임박</span>
              </Link>
            ))}
            {stalePending.map((p) => {
              const logs = p.activity_log ?? [];
              const latest = logs.length > 0 ? logs[logs.length - 1].date : null;
              const days = latest ? daysAgo(latest) : null;
              return (
                <Link key={p.id} href={`/partners/${p.id}`}
                  className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 hover:shadow-sm transition-shadow">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{p.name_ko}</span>
                    <span className="ml-2 text-xs text-orange-600">
                      {days !== null ? `${days}일째 응답 없음` : "활동 기록 없음"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{p.status}</span>
                </Link>
              );
            })}
            {gaps.map((district) => (
              <Link key={district} href="/partners/new"
                className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 hover:shadow-sm transition-shadow">
                <div>
                  <span className="text-sm font-medium text-gray-900">{district}구</span>
                  <span className="ml-2 text-xs text-red-500">제휴 완료 업체 없음</span>
                </div>
                <span className="text-xs text-gray-400">커버리지 갭</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 상태별 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
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

        {/* 유형별 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
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

      {/* D. 커버리지 갭 전체 */}
      {hotelDistricts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">구별 커버리지</p>
          <div className="space-y-2">
            {hotelDistricts.map((district) => {
              const matched = completedPartners.filter((p) => p.district_tags?.includes(district));
              const hasGap = matched.length === 0;
              return (
                <div key={district} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{district}구</span>
                  {hasGap ? (
                    <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">업체 없음</span>
                  ) : (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      제휴 {matched.length}개
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
