export type DayHours = {
  open: string;
  close: string;
  closed: boolean;
};

export type PriceItem = {
  label: string;
  price_krw: number | string;
};

export type ActivityLog = {
  date: string;
  note: string;
};

export type Partner = {
  id: string;
  // 상태
  status: PartnerStatus;
  // 기본 정보
  name_ko: string;
  name_en: string;
  service_type: string;
  service_mode: "방문형" | "내방형" | "혼합";
  languages: string[];
  // 위치
  address: string;
  district_tags: string[];
  // 연락처
  contact_person: string;
  contact_phone: string;
  contact_kakao: string;
  // 운영 정보
  operating_hours: Record<string, DayHours>;
  max_capacity: number | string;
  same_day_booking: boolean;
  min_lead_time_hours: number | string;
  // 가격표
  price_items: PriceItem[];
  payment_methods: string[];
  // 제휴 정보
  commission_rate: number | string;
  contract_start: string;
  contract_end: string;
  // 이미지
  image_url: string;
  // 로그
  activity_log: ActivityLog[];
  // 메타
  is_active: boolean;
  createdAt: string;
};

export type Hotel = {
  id: string;
  name: string;
  address: string;
  district_tags: string[];
  createdAt: string;
};

export type PartnerStatus =
  | "발굴"
  | "접촉 중"
  | "협의 중"
  | "제휴 완료"
  | "일시 중단"
  | "제휴 해지";

export const PARTNER_STATUSES: PartnerStatus[] = [
  "발굴",
  "접촉 중",
  "협의 중",
  "제휴 완료",
  "일시 중단",
  "제휴 해지",
];

export const STATUS_STYLE: Record<PartnerStatus, string> = {
  "발굴": "bg-gray-100 text-gray-600",
  "접촉 중": "bg-yellow-100 text-yellow-700",
  "협의 중": "bg-orange-100 text-orange-700",
  "제휴 완료": "bg-green-100 text-green-700",
  "일시 중단": "bg-red-100 text-red-500",
  "제휴 해지": "bg-gray-100 text-gray-400",
};

export const SERVICE_TYPES = ["K뷰티", "마사지", "택시", "밴", "기타"] as const;

export const SERVICE_MODES = ["방문형", "내방형", "혼합"] as const;

export const LANGUAGES = ["영어", "중국어", "일본어", "스페인어", "기타"] as const;

export const PAYMENT_METHODS = ["현금", "카드", "계좌이체", "기타"] as const;

export const DAYS = [
  { key: "mon", label: "월" },
  { key: "tue", label: "화" },
  { key: "wed", label: "수" },
  { key: "thu", label: "목" },
  { key: "fri", label: "금" },
  { key: "sat", label: "토" },
  { key: "sun", label: "일" },
] as const;

export const DEFAULT_HOURS: Record<string, DayHours> = Object.fromEntries(
  ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((d) => [
    d,
    { open: "09:00", close: "18:00", closed: false },
  ])
);

export function extractDistricts(address: string): string[] {
  const matches = address.match(/([가-힣]+)구/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.replace("구", "")))];
}
