import { NextRequest, NextResponse } from "next/server";
import { listBookings, createBooking } from "@/lib/bkend";

export async function GET() {
  try {
    const bookings = await listBookings();
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await createBooking(data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "등록 실패" }, { status: 500 });
  }
}
