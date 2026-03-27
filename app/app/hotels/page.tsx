import Link from "next/link";
import { listHotels } from "@/lib/bkend";
import { Hotel } from "@/lib/types";

export default async function HotelsPage() {
  let hotels: Hotel[] = [];
  try { hotels = await listHotels(); } catch { hotels = []; }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">호텔</h1>
          <p className="text-sm text-gray-500 mt-1">총 {hotels.length}개</p>
        </div>
        <Link href="/hotels/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          호텔 등록
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">등록된 호텔이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((hotel) => (
            <Link key={hotel.id} href={`/hotels/${hotel.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <p className="font-semibold text-gray-900">{hotel.name}</p>
              {hotel.address && <p className="text-xs text-gray-400 mt-1 truncate">{hotel.address}</p>}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {hotel.district_tags?.map((tag) => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
