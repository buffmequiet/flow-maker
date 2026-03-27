const API_URL = process.env.BKEND_API_URL!;
const API_KEY = process.env.BKEND_API_KEY!;
const TABLE = "fm_partners";

function headers() {
  return { "X-API-Key": API_KEY, "Content-Type": "application/json" };
}

export async function listPartners(serviceType?: string) {
  let url = `${API_URL}/v1/data/${TABLE}?limit=100`;
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
  const res = await fetch(`${API_URL}/v1/data/${TABLE}/${id}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("업체 조회 실패");
  const json = await res.json();
  return json.data ?? null;
}

export async function createPartner(data: object) {
  const res = await fetch(`${API_URL}/v1/data/${TABLE}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("업체 등록 실패");
  return res.json();
}

export async function updatePartner(id: string, data: object) {
  const res = await fetch(`${API_URL}/v1/data/${TABLE}/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("업체 수정 실패");
  return res.json();
}

export async function deletePartner(id: string) {
  const res = await fetch(`${API_URL}/v1/data/${TABLE}/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("업체 삭제 실패");
  return res.json();
}
