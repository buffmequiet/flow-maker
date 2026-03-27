export type DayHours = {
  open: string;
  close: string;
  closed: boolean;
};

export type PriceItem = {
  label: string;
  price_krw: number | string;
};

export type Partner = {
  id: string;
  name_ko: string;
  name_en: string;
  service_type: string;
  image_url: string;
  contact_phone: string;
  contact_kakao: string;
  operating_hours: Record<string, DayHours>;
  price_items: PriceItem[];
  commission_rate: number | string;
  memo: string;
  is_active: boolean;
  createdAt: string;
};

export const SERVICE_TYPES = ["K뷰티", "마사지", "택시", "밴", "기타"] as const;

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
