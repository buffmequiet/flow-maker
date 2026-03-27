import Link from "next/link";
import { listPartners } from "@/lib/bkend";
import { SERVICE_TYPES } from "@/lib/types";

export default async function DashboardPage() {
  let partners: { service_type: string; is_active: boolean }[] = [];
  try {
    partners = await listPartners();
  } catch {
    partners = [];
  }

  const total = partners.length;
  const active = partners.filter((p) => p.is_active !== false).length;

  const byType = SERVICE_TYPES.map((type) => ({
    type,
    count: partners.filter((p) => p.service_type === type).length,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">제휴업체 현황</p>
        </div>
        <Link
          href="/partners/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          업체 등록
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">전체 업체</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">활성 업체</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{active}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm font-medium text-gray-700 mb-4">서비스 유형별</p>
        <div className="space-y-3">
          {byType.map(({ type, count }) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{type}</span>
              <span className="text-sm font-semibold text-gray-900">{count}개</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
