"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Partner, PARTNER_STATUSES, STATUS_STYLE,
  SERVICE_TYPES, SERVICE_MODES, LANGUAGES, PAYMENT_METHODS,
  DAYS, DEFAULT_HOURS, PriceItem, DayHours, ActivityLog,
  extractDistricts,
} from "@/lib/types";

type Props = { initial?: Partial<Partner>; partnerId?: string };

export default function PartnerForm({ initial, partnerId }: Props) {
  const router = useRouter();
  const isEdit = !!partnerId;

  // 상태
  const [status, setStatus] = useState(initial?.status ?? "발굴");
  // 기본 정보
  const [nameKo, setNameKo] = useState(initial?.name_ko ?? "");
  const [nameEn, setNameEn] = useState(initial?.name_en ?? "");
  const [serviceType, setServiceType] = useState(initial?.service_type ?? "");
  const [serviceMode, setServiceMode] = useState(initial?.service_mode ?? "내방형");
  const [languages, setLanguages] = useState<string[]>(initial?.languages ?? []);
  // 위치
  const [address, setAddress] = useState(initial?.address ?? "");
  const [districtTags, setDistrictTags] = useState<string[]>(initial?.district_tags ?? []);
  const [tagInput, setTagInput] = useState("");
  // 연락처
  const [contactPerson, setContactPerson] = useState(initial?.contact_person ?? "");
  const [contactPhone, setContactPhone] = useState(initial?.contact_phone ?? "");
  const [contactKakao, setContactKakao] = useState(initial?.contact_kakao ?? "");
  // 운영 정보
  const [hours, setHours] = useState<Record<string, DayHours>>(initial?.operating_hours ?? DEFAULT_HOURS);
  const [maxCapacity, setMaxCapacity] = useState(initial?.max_capacity ?? "");
  const [sameDayBooking, setSameDayBooking] = useState(initial?.same_day_booking ?? false);
  const [minLeadTime, setMinLeadTime] = useState(initial?.min_lead_time_hours ?? "");
  // 가격표
  const [priceItems, setPriceItems] = useState<PriceItem[]>(
    initial?.price_items?.length ? initial.price_items : [{ label: "", price_krw: "" }]
  );
  const [paymentMethods, setPaymentMethods] = useState<string[]>(initial?.payment_methods ?? []);
  // 제휴 정보
  const [commission, setCommission] = useState(initial?.commission_rate ?? "");
  const [contractStart, setContractStart] = useState(initial?.contract_start ?? "");
  const [contractEnd, setContractEnd] = useState(initial?.contract_end ?? "");
  // 이미지
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [imagePreview, setImagePreview] = useState(initial?.image_url ?? "");
  // 활동 로그
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(initial?.activity_log ?? []);
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [logNote, setLogNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // 주소 입력 시 구 태그 자동 파싱
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

  function toggleItem<T>(arr: T[], setArr: (v: T[]) => void, item: T) {
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  }

  function updateHour(day: string, field: keyof DayHours, value: string | boolean) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  function addPriceItem() {
    setPriceItems((prev) => [...prev, { label: "", price_krw: "" }]);
  }

  function updatePriceItem(idx: number, field: keyof PriceItem, value: string) {
    setPriceItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  function removePriceItem(idx: number) {
    setPriceItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function addLog() {
    if (!logNote.trim()) return;
    setActivityLog((prev) => [...prev, { date: logDate, note: logNote.trim() }]);
    setLogNote("");
    setLogDate(new Date().toISOString().slice(0, 10));
  }

  function removeLog(idx: number) {
    setActivityLog((prev) => prev.filter((_, i) => i !== idx));
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
      status,
      name_ko: nameKo,
      name_en: nameEn,
      service_type: serviceType,
      service_mode: serviceMode,
      languages,
      address,
      district_tags: districtTags,
      contact_person: contactPerson,
      contact_phone: contactPhone,
      contact_kakao: contactKakao,
      operating_hours: hours,
      max_capacity: maxCapacity === "" ? null : Number(maxCapacity),
      same_day_booking: sameDayBooking,
      min_lead_time_hours: minLeadTime === "" ? null : Number(minLeadTime),
      price_items: priceItems.filter((p) => p.label),
      payment_methods: paymentMethods,
      commission_rate: commission === "" ? null : Number(commission),
      contract_start: contractStart || null,
      contract_end: contractEnd || null,
      image_url: imageUrl,
      activity_log: activityLog,
      is_active: status === "제휴 완료",
    };

    try {
      const url = isEdit ? `/api/partners/${partnerId}` : "/api/partners";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error ?? "저장 실패");
      }
      router.push("/partners");
      router.refresh();
    } catch (e) {
      setError("저장 오류: " + (e instanceof Error ? e.message : "알 수 없는 오류"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* 1. 상태 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">제휴 상태</h2>
        <div className="flex flex-wrap gap-2">
          {PARTNER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                status === s
                  ? `${STATUS_STYLE[s]} border-transparent ring-2 ring-offset-1 ring-gray-400`
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* 2. 기본 정보 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">기본 정보</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">업체명 (한글) <span className="text-red-500">*</span></label>
              <input type="text" value={nameKo} onChange={(e) => setNameKo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="예: 강남 뷰티샵" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">업체명 (영어)</label>
              <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Gangnam Beauty" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">서비스 유형 <span className="text-red-500">*</span></label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="">선택</option>
                {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">서비스 제공 방식</label>
              <select value={serviceMode} onChange={(e) => setServiceMode(e.target.value as typeof serviceMode)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900">
                {SERVICE_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2">소통 가능 언어</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button key={lang} type="button"
                  onClick={() => toggleItem(languages, setLanguages, lang)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    languages.includes(lang)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 위치 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">위치</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">주소</label>
            <input type="text" value={address} onChange={(e) => handleAddressChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="서울시 강남구 테헤란로 123" />
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
        </div>
      </section>

      {/* 4. 연락처 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">연락처</h2>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">담당자명</label>
            <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="홍길동" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">전화번호</label>
              <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="010-0000-0000" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">카카오톡 ID</label>
              <input type="text" value={contactKakao} onChange={(e) => setContactKakao(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="kakao_id" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. 운영 정보 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">운영 정보</h2>
        <div className="space-y-4">
          {/* 운영시간 */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">운영시간</label>
            <div className="space-y-2">
              {DAYS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-5 text-sm text-gray-600 shrink-0">{label}</span>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={hours[key]?.closed ?? false}
                      onChange={(e) => updateHour(key, "closed", e.target.checked)} />
                    휴무
                  </label>
                  {!hours[key]?.closed && (
                    <>
                      <input type="text" value={hours[key]?.open ?? "09:00"}
                        onChange={(e) => updateHour(key, "open", e.target.value)}
                        placeholder="09:00"
                        className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none w-16 text-center" />
                      <span className="text-xs text-gray-400">~</span>
                      <input type="text" value={hours[key]?.close ?? "18:00"}
                        onChange={(e) => updateHour(key, "close", e.target.value)}
                        placeholder="18:00"
                        className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none w-16 text-center" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* 예약 설정 */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs text-gray-500 mb-1">동시 예약 max 인원</label>
              <input type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="예: 4" min={1} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">최소 예약 리드타임 (시간)</label>
              <input type="number" value={minLeadTime} onChange={(e) => setMinLeadTime(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="예: 2" min={0} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="same-day" checked={sameDayBooking}
              onChange={(e) => setSameDayBooking(e.target.checked)}
              className="rounded" />
            <label htmlFor="same-day" className="text-sm text-gray-700 cursor-pointer">당일 예약 가능</label>
          </div>
        </div>
      </section>

      {/* 6. 가격표 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">가격표</h2>
          <button type="button" onClick={addPriceItem}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            + 항목 추가
          </button>
        </div>
        <div className="space-y-2 mb-4">
          {priceItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input type="text" value={item.label} onChange={(e) => updatePriceItem(idx, "label", e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="항목명" />
              <input type="number" value={item.price_krw} onChange={(e) => updatePriceItem(idx, "price_krw", e.target.value)}
                className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="금액 (KRW)" />
              {priceItems.length > 1 && (
                <button type="button" onClick={() => removePriceItem(idx)}
                  className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
              )}
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2">결제 수단</label>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button key={m} type="button"
                onClick={() => toggleItem(paymentMethods, setPaymentMethods, m)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  paymentMethods.includes(m)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 제휴 정보 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">제휴 정보</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">제휴 수수료 (%)</label>
            <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="15" min={0} max={100} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">계약일</label>
            <input type="date" value={contractStart} onChange={(e) => setContractStart(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">계약 만료일</label>
            <input type="date" value={contractEnd} onChange={(e) => setContractEnd(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
        </div>
      </section>

      {/* 8. 이미지 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">이미지</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">이미지 URL</label>
            <input type="text" value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="https://..." />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
              파일 선택 (미리보기용)
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImagePreview(URL.createObjectURL(file));
              }} />
            <span className="text-xs text-gray-400">실제 업로드 없음</span>
          </div>
          {imagePreview && (
            <div className="rounded-lg overflow-hidden border border-gray-200 w-48 h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* 9. 활동 로그 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">활동 로그</h2>
        {/* 기존 로그 */}
        {activityLog.length > 0 && (
          <div className="mb-4 space-y-2">
            {[...activityLog].reverse().map((log, i) => (
              <div key={i} className="flex items-start gap-3 text-sm group">
                <span className="text-xs text-gray-400 shrink-0 mt-0.5 w-20">{log.date}</span>
                <span className="flex-1 text-gray-700">{log.note}</span>
                <button type="button"
                  onClick={() => removeLog(activityLog.length - 1 - i)}
                  className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-lg leading-none">×</button>
              </div>
            ))}
          </div>
        )}
        {/* 새 로그 추가 */}
        <div className="border-t border-gray-100 pt-4 flex gap-2">
          <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none w-36" />
          <input type="text" value={logNote} onChange={(e) => setLogNote(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLog(); } }}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="메모 입력 후 Enter 또는 추가 버튼" />
          <button type="button" onClick={addLog}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors shrink-0">
            추가
          </button>
        </div>
      </section>

      {/* 액션 */}
      <div className="flex items-center gap-3 pb-8">
        <button type="submit" disabled={submitting}
          className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
          {submitting ? "저장 중..." : isEdit ? "수정 저장" : "등록하기"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          취소
        </button>
      </div>
    </form>
  );
}
