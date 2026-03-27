import Link from "next/link";
import { getPartner } from "@/lib/bkend";
import { Partner, DAYS, STATUS_STYLE } from "@/lib/types";
import DeleteButton from "@/components/DeleteButton";
import CopyButton from "@/components/CopyButton";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function PartnerDetailPage({ params }: Props) {
  const { id } = await params;
  let partner: Partner | null = null;
  try { partner = await getPartner(id); } catch { notFound(); }
  if (!partner) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            <Link href="/partners" className="hover:underline">제휴업체</Link> /
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{partner.name_ko}</h1>
          {partner.name_en && <p className="text-sm text-gray-400 mt-0.5">{partner.name_en}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/partners/${id}/edit`}
            className="border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
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

        {/* 상태 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">제휴 상태</p>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_STYLE[partner.status] ?? "bg-gray-100 text-gray-500"}`}>
            {partner.status ?? "-"}
          </span>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">기본 정보</p>
          <Row label="서비스 유형">
            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{partner.service_type}</span>
          </Row>
          <Row label="서비스 방식">{partner.service_mode || "-"}</Row>
          <Row label="소통 가능 언어">{partner.languages?.join(", ") || "-"}</Row>
        </div>

        {/* 위치 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">위치</p>
          <Row label="주소">{partner.address || "-"}</Row>
          <Row label="구 태그">
            <div className="flex flex-wrap gap-1">
              {partner.district_tags?.length
                ? partner.district_tags.map((t) => (
                    <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{t}</span>
                  ))
                : "-"}
            </div>
          </Row>
        </div>

        {/* 연락처 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">연락처</p>
          <Row label="담당자">{partner.contact_person || "-"}</Row>
          <Row label="전화번호">
            <span className="flex items-center gap-2">
              {partner.contact_phone || "-"}
              {partner.contact_phone && <CopyButton text={partner.contact_phone} />}
            </span>
          </Row>
          <Row label="카카오톡">
            <span className="flex items-center gap-2">
              {partner.contact_kakao || "-"}
              {partner.contact_kakao && <CopyButton text={partner.contact_kakao} />}
            </span>
          </Row>
        </div>

        {/* 운영 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">운영 정보</p>
          {partner.operating_hours && (
            <div className="mb-3 space-y-1.5">
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
          )}
          <div className="pt-3 border-t border-gray-50 space-y-0">
            <Row label="동시 예약 max">{partner.max_capacity != null ? `${partner.max_capacity}명` : "-"}</Row>
            <Row label="당일 예약">{partner.same_day_booking ? "가능" : "불가"}</Row>
            <Row label="최소 리드타임">{partner.min_lead_time_hours != null ? `${partner.min_lead_time_hours}시간 전` : "-"}</Row>
          </div>
        </div>

        {/* 가격표 */}
        {partner.price_items?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">가격표</p>
            <div className="space-y-2 mb-3">
              {partner.price_items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">{Number(item.price_krw).toLocaleString()}원</span>
                </div>
              ))}
            </div>
            {partner.payment_methods?.length > 0 && (
              <div className="flex gap-1.5 pt-3 border-t border-gray-50 flex-wrap">
                {partner.payment_methods.map((m) => (
                  <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 제휴 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">제휴 정보</p>
          <Row label="수수료">{partner.commission_rate != null ? `${partner.commission_rate}%` : "-"}</Row>
          <Row label="계약일">{partner.contract_start || "-"}</Row>
          <Row label="계약 만료일">{partner.contract_end || "-"}</Row>
        </div>

        {/* 활동 로그 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">활동 로그</p>
          {partner.activity_log?.length > 0 ? (
            <div className="space-y-2.5">
              {[...partner.activity_log].reverse().map((log, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-xs text-gray-400 shrink-0 mt-0.5 w-20">{log.date}</span>
                  <span className="text-gray-700">{log.note}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">기록 없음</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 text-right">{children}</span>
    </div>
  );
}
