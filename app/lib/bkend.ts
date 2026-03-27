const API_URL = process.env.BKEND_API_URL!;
const API_KEY = process.env.BKEND_API_KEY!;
const PARTNERS_TABLE = "fm_partners";
const HOTELS_TABLE = "fm_hotels";
const BOOKINGS_TABLE = "fm_bookings";

function headers() {
  return { "X-API-Key": API_KEY, "Content-Type": "application/json" };
}

// ── Partners ──────────────────────────────────────────────

export async function listPartners(serviceType?: string) {
  let url = `${API_URL}/v1/data/${PARTNERS_TABLE}?limit=200`;
  if (serviceType) {
    const f = encodeURIComponent(JSON.stringify({ service_type: serviceType }));
    url += `&andFilters=${f}`;
  }
  const res = await fetch(url, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error("목록 조회 실패");
  const json = await res.json();
  return json.data?.items ?? [];
}

export async function getPartner(id: string) {
  const res = await fetch(`${API_URL}/v1/data/${PARTNERS_TABLE}/${id}`, {
    headers: headers(), cache: "no-store",
  });
  if (!res.ok) throw new Error("업체 조회 실패");
  const json = await res.json();
  return json.data ?? null;
}

export async function createPartner(data: object) {
  const res = await fetch(`${API_URL}/v1/data/${PARTNERS_TABLE}`, {
    method: "POST", headers: headers(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("업체 등록 실패");
  return res.json();
}

export async function updatePartner(id: string, data: object) {
  const res = await fetch(`${API_URL}/v1/data/${PARTNERS_TABLE}/${id}`, {
    method: "PUT", headers: headers(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("업체 수정 실패");
  return res.json();
}

export async function deletePartner(id: string) {
  const res = await fetch(`${API_URL}/v1/data/${PARTNERS_TABLE}/${id}`, {
    method: "DELETE", headers: headers(),
  });
  if (!res.ok) throw new Error("업체 삭제 실패");
  return res.json();
}

// ── Hotels ────────────────────────────────────────────────

export async function listHotels() {
  const res = await fetch(`${API_URL}/v1/data/${HOTELS_TABLE}?limit=200`, {
    headers: headers(), cache: "no-store",
  });
  if (!res.ok) throw new Error("호텔 목록 조회 실패");
  const json = await res.json();
  return json.data?.items ?? [];
}

export async function getHotel(id: string) {
  const res = await fetch(`${API_URL}/v1/data/${HOTELS_TABLE}/${id}`, {
    headers: headers(), cache: "no-store",
  });
  if (!res.ok) throw new Error("호텔 조회 실패");
  const json = await res.json();
  return json.data ?? null;
}

export async function createHotel(data: object) {
  const res = await fetch(`${API_URL}/v1/data/${HOTELS_TABLE}`, {
    method: "POST", headers: headers(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("호텔 등록 실패");
  return res.json();
}

export async function updateHotel(id: string, data: object) {
  const res = await fetch(`${API_URL}/v1/data/${HOTELS_TABLE}/${id}`, {
    method: "PUT", headers: headers(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("호텔 수정 실패");
  return res.json();
}

export async function deleteHotel(id: string) {
  const res = await fetch(`${API_URL}/v1/data/${HOTELS_TABLE}/${id}`, {
    method: "DELETE", headers: headers(),
  });
  if (!res.ok) throw new Error("호텔 삭제 실패");
  return res.json();
}

// ── Bookings ──────────────────────────────────────────────

export async function listBookings() {
  const res = await fetch(`${API_URL}/v1/data/${BOOKINGS_TABLE}?limit=200`, {
    headers: headers(), cache: "no-store",
  });
  if (!res.ok) throw new Error("예약 목록 조회 실패");
  const json = await res.json();
  return json.data?.items ?? [];
}

export async function getBooking(id: string) {
  const res = await fetch(`${API_URL}/v1/data/${BOOKINGS_TABLE}/${id}`, {
    headers: headers(), cache: "no-store",
  });
  if (!res.ok) throw new Error("예약 조회 실패");
  const json = await res.json();
  return json.data ?? null;
}

export async function createBooking(data: object) {
  const res = await fetch(`${API_URL}/v1/data/${BOOKINGS_TABLE}`, {
    method: "POST", headers: headers(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("예약 등록 실패");
  return res.json();
}

export async function updateBooking(id: string, data: object) {
  const res = await fetch(`${API_URL}/v1/data/${BOOKINGS_TABLE}/${id}`, {
    method: "PUT", headers: headers(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("예약 수정 실패");
  return res.json();
}

export async function deleteBooking(id: string) {
  const res = await fetch(`${API_URL}/v1/data/${BOOKINGS_TABLE}/${id}`, {
    method: "DELETE", headers: headers(),
  });
  if (!res.ok) throw new Error("예약 삭제 실패");
  return res.json();
}
