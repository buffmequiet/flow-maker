import Link from "next/link";
import { listPartners } from "@/lib/bkend";
import { Partner } from "@/lib/types";
import PartnerListClient from "@/components/PartnerListClient";

export default async function PartnersPage() {
  let partners: Partner[] = [];
  try { partners = await listPartners(); } catch { partners = []; }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">제휴업체</h1>
          <p className="text-sm text-gray-500 mt-1">총 {partners.length}개</p>
        </div>
        <Link href="/partners/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          업체 등록
        </Link>
      </div>
      <PartnerListClient partners={partners} />
    </div>
  );
}
