import { NextRequest, NextResponse } from "next/server";
import { listPartners, createPartner } from "@/lib/bkend";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? undefined;
  try {
    const partners = await listPartners(type);
    return NextResponse.json({ partners });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await createPartner(data);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "등록 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
