import { NextRequest, NextResponse } from "next/server";
import { getBooking, updateBooking, deleteBooking } from "@/lib/bkend";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const booking = await getBooking(id);
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const data = await req.json();
    const result = await updateBooking(id, data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const data = await req.json();
    const result = await updateBooking(id, data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "상태 변경 실패" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const result = await deleteBooking(id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
