"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel, extractDistricts } from "@/lib/types";

type Props = { initial?: Partial<Hotel>; hotelId?: string };

export default function HotelForm({ initial, hotelId }: Props) {
  const router = useRouter();
  const isEdit = !!hotelId;

  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [districtTags, setDistrictTags] = useState<string[]>(initial?.district_tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleAddressChange(val: string) {
    setAddress(val);
    const parsed = extractDistricts(val);
    if (parsed.length > 0) {
      setDistrictTags((prev) => [...new Set([...prev, ...parsed])]);
    }
  }

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t) return;
    setDistrictTags((prev) => [...new Set([...prev, t])]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setDistrictTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) { setError("호텔명은 필수입니다."); return; }
    setError("");
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/hotels/${hotelId}` : "/api/hotels";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address, district_tags: districtTags }),
      });
      if (!res.ok) throw new Error();
      router.push("/hotels");
      router.refresh();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">호텔 정보</h2>
        <div>
          <label className="block text-xs text-gray-500 mb-1">호텔명 <span className="text-red-500">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="예: 그랜드 하얏트 서울" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">주소</label>
          <input type="text" value={address} onChange={(e) => handleAddressChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="서울시 용산구 소월로 322" />
          <p className="text-xs text-gray-400 mt-1">"OO구" 입력 시 태그 자동 생성</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2">구 태그</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {districtTags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 leading-none">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="직접 추가 (Enter)" />
            <button type="button" onClick={() => addTag(tagInput)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              추가
            </button>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting}
          className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
          {submitting ? "저장 중..." : isEdit ? "수정 저장" : "등록하기"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors">취소</button>
      </div>
    </form>
  );
}
