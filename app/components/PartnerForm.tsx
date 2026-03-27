"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Partner, SERVICE_TYPES, DAYS, DEFAULT_HOURS, PriceItem, DayHours } from "@/lib/types";

type Props = {
  initial?: Partial<Partner>;
  partnerId?: string;
};

export default function PartnerForm({ initial, partnerId }: Props) {
  const router = useRouter();
  const isEdit = !!partnerId;

  const [nameKo, setNameKo] = useState(initial?.name_ko ?? "");
  const [nameEn, setNameEn] = useState(initial?.name_en ?? "");
  const [serviceType, setServiceType] = useState(initial?.service_type ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [imagePreview, setImagePreview] = useState(initial?.image_url ?? "");
  const [contactPhone, setContactPhone] = useState(initial?.contact_phone ?? "");
  const [contactKakao, setContactKakao] = useState(initial?.contact_kakao ?? "");
  const [hours, setHours] = useState<Record<string, DayHours>>(
    initial?.operating_hours ?? DEFAULT_HOURS
  );
  const [priceItems, setPriceItems] = useState<PriceItem[]>(
    initial?.price_items?.length ? initial.price_items : [{ label: "", price_krw: "" }]
  );
  const [commission, setCommission] = useState(initial?.commission_rate ?? "");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    // 실제 업로드 없음 — 데모용 미리보기만
  }

  function updateHour(day: string, field: keyof DayHours, value: string | boolean) {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  function addPriceItem() {
    setPriceItems((prev) => [...prev, { label: "", price_krw: "" }]);
  }

  function updatePriceItem(idx: number, field: keyof PriceItem, value: string) {
    setPriceItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  }

  function removePriceItem(idx: number) {
    setPriceItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameKo || !serviceType) {
      setError("업체명(한글)과 서비스 유형은 필수입니다.");
      return;
    }
    setError("");
    setSubmitting(true);

    const payload = {
      name_ko: nameKo,
      name_en: nameEn,
      service_type: serviceType,
      image_url: imageUrl,
      contact_phone: contactPhone,
      contact_kakao: contactKakao,
      operating_hours: hours,
      price_items: priceItems.filter((p) => p.label),
      commission_rate: commission === "" ? null : Number(commission),
      memo,
      is_active: true,
      created_at: isEdit ? initial?.createdAt : new Date().toISOString(),
    };

    try {
      const url = isEdit ? `/api/partners/${partnerId}` : "/api/partners";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("저장 실패");
      router.push("/partners");
      router.refresh();
    } catch {
      setError("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* 1. 기본 정보 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">기본 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              업체명 (한글) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameKo}
              onChange={(e) => setNameKo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="예: 강남 뷰티샵"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">업체명 (영어)</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="예: Gangnam Beauty Shop"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              서비스 유형 <span className="text-red-500">*</span>
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">선택</option>
              {SERVICE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 2. 이미지 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">이미지</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">이미지 URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value);
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              파일 선택 (미리보기용)
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <span className="text-xs text-gray-400">실제 업로드 없음 — 미리보기만 가능</span>
          </div>
          {imagePreview && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 w-48 h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* 3. 연락처 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">연락처</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">전화번호</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="010-0000-0000"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">카카오톡 ID</label>
            <input
              type="text"
              value={contactKakao}
              onChange={(e) => setContactKakao(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="kakao_id"
            />
          </div>
        </div>
      </section>

      {/* 4. 운영시간 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">운영시간</h2>
        <div className="space-y-2">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-6 text-sm text-gray-600 shrink-0">{label}</span>
              <input
                type="checkbox"
                checked={hours[key]?.closed ?? false}
                onChange={(e) => updateHour(key, "closed", e.target.checked)}
                id={`closed-${key}`}
              />
              <label htmlFor={`closed-${key}`} className="text-xs text-gray-500 w-8 shrink-0">
                휴무
              </label>
              {!hours[key]?.closed && (
                <>
                  <input
                    type="time"
                    value={hours[key]?.open ?? "09:00"}
                    onChange={(e) => updateHour(key, "open", e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"
                  />
                  <span className="text-xs text-gray-400">~</span>
                  <input
                    type="time"
                    value={hours[key]?.close ?? "18:00"}
                    onChange={(e) => updateHour(key, "close", e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. 가격표 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">가격표</h2>
          <button
            type="button"
            onClick={addPriceItem}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            + 항목 추가
          </button>
        </div>
        <div className="space-y-2">
          {priceItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updatePriceItem(idx, "label", e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="항목명 (예: 기본 마사지 60분)"
              />
              <input
                type="number"
                value={item.price_krw}
                onChange={(e) => updatePriceItem(idx, "price_krw", e.target.value)}
                className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="금액 (KRW)"
              />
              {priceItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePriceItem(idx)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. 수수료 & 메모 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">기타</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">제휴 수수료 (%)</label>
            <input
              type="number"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="예: 15"
              min={0}
              max={100}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">내부 메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              placeholder="운영자 전용 메모..."
            />
          </div>
        </div>
      </section>

      {/* 액션 */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {submitting ? "저장 중..." : isEdit ? "수정 저장" : "등록하기"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
