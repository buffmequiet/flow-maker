import { NextRequest, NextResponse } from "next/server";
import { getPartner, updatePartner, deletePartner } from "@/lib/bkend";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const partner = await getPartner(id);
    return NextResponse.json({ partner });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const data = await req.json();
    const result = await updatePartner(id, data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const result = await deletePartner(id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
