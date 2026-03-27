import Link from "next/link";
import { getPartner } from "@/lib/bkend";
import { Partner, DAYS } from "@/lib/types";
import DeleteButton from "@/components/DeleteButton";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function PartnerDetailPage({ params }: Props) {
  const { id } = await params;
  let partner: Partner | null = null;
  try {
    partner = await getPartner(id);
  } catch {
    notFound();
  }
  if (!partner) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            <Link href="/partners" className="hover:underline">제휴업체</Link> /
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{partner.name_ko}</h1>
          {partner.name_en && (
            <p className="text-sm text-gray-400 mt-0.5">{partner.name_en}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/partners/${id}/edit`}
            className="border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            수정
          </Link>
          <DeleteButton partnerId={id} />
        </div>
      </div>

      <div className="space-y-5">
        {/* 이미지 */}
        {partner.image_url && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={partner.image_url} alt={partner.name_ko} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">기본 정보</p>
          <Row label="서비스 유형">
            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {partner.service_type}
            </span>
          </Row>
          <Row label="상태">
            <span className={`text-xs px-2 py-0.5 rounded-full ${partner.is_active !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {partner.is_active !== false ? "활성" : "비활성"}
            </span>
          </Row>
          <Row label="등록일">{new Date(partner.createdAt).toLocaleDateString("ko-KR")}</Row>
        </div>

        {/* 연락처 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">연락처</p>
          <Row label="전화번호">{partner.contact_phone || "-"}</Row>
          <Row label="카카오톡">{partner.contact_kakao || "-"}</Row>
        </div>

        {/* 운영시간 */}
        {partner.operating_hours && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">운영시간</p>
            <div className="space-y-1.5">
              {DAYS.map(({ key, label }) => {
                const h = partner.operating_hours?.[key];
                return (
                  <div key={key} className="flex items-center gap-4 text-sm">
                    <span className="w-4 text-gray-600">{label}</span>
                    {h?.closed ? (
                      <span className="text-gray-400">휴무</span>
                    ) : (
                      <span className="text-gray-700">{h?.open ?? "-"} ~ {h?.close ?? "-"}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 가격표 */}
        {partner.price_items?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">가격표</p>
            <div className="space-y-2">
              {partner.price_items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">
                    {Number(item.price_krw).toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 수수료 & 메모 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">기타</p>
          <Row label="제휴 수수료">{partner.commission_rate != null ? `${partner.commission_rate}%` : "-"}</Row>
          {partner.memo && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">메모</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{partner.memo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{children}</span>
    </div>
  );
}
