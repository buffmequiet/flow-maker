import { NextRequest, NextResponse } from "next/server";
import { updatePartner } from "@/lib/bkend";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = await updatePartner(id, body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "상태 변경 실패" }, { status: 500 });
  }
}
