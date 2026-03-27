import Link from "next/link";
import { getHotel, listPartners } from "@/lib/bkend";
import { Hotel, Partner } from "@/lib/types";
import { notFound } from "next/navigation";
import HotelDeleteButton from "@/components/HotelDeleteButton";

type Props = { params: Promise<{ id: string }> };

export default async function HotelDetailPage({ params }: Props) {
  const { id } = await params;
  let hotel: Hotel | null = null;
  let allPartners: Partner[] = [];

  try { hotel = await getHotel(id); } catch { notFound(); }
  if (!hotel) notFound();

  try { allPartners = await listPartners(); } catch { allPartners = []; }

  const tags = hotel.district_tags ?? [];
  const matchedPartners = allPartners.filter((p) =>
    p.district_tags?.some((t) => tags.includes(t))
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            <Link href="/hotels" className="hover:underline">호텔</Link> /
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
          {hotel.address && <p className="text-sm text-gray-400 mt-0.5">{hotel.address}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/hotels/${id}/edit`}
            className="border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            수정
          </Link>
          <HotelDeleteButton hotelId={id} />
        </div>
      </div>

      {/* 구 태그 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">구 태그</p>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">태그 없음</p>
        )}
      </div>

      {/* 매칭 제휴업체 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            매칭 제휴업체
          </p>
          <span className="text-xs text-gray-400">{matchedPartners.length}개</span>
        </div>
        {tags.length === 0 ? (
          <p className="text-sm text-gray-400">구 태그를 등록하면 업체가 자동 매칭됩니다.</p>
        ) : matchedPartners.length === 0 ? (
          <p className="text-sm text-gray-400">같은 구 태그를 가진 업체가 없습니다.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {matchedPartners.map((p) => (
              <Link key={p.id} href={`/partners/${p.id}`}
                className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.name_ko}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{p.service_type}</span>
                    {p.district_tags?.filter((t) => tags.includes(t)).map((t) => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  p.status === "제휴 완료" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {p.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
