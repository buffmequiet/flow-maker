import { NextRequest, NextResponse } from "next/server";
import { getHotel, updateHotel, deleteHotel } from "@/lib/bkend";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const hotel = await getHotel(id);
    return NextResponse.json({ hotel });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const data = await req.json();
    const result = await updateHotel(id, data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const result = await deleteHotel(id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
