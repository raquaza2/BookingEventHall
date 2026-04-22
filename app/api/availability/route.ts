import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TIME_SLOTS } from "@/lib/time-slots";
import { availabilityQuerySchema } from "@/lib/validation";

function startOfDay(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function endOfDay(date: string) {
  return new Date(`${date}T23:59:59.999Z`);
}

export async function GET(request: NextRequest) {
  const parsed = availabilityQuerySchema.safeParse({
    date: request.nextUrl.searchParams.get("date")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid date." }, { status: 400 });
  }

  const approvedBookings = await prisma.booking.findMany({
    where: {
      bookingDate: {
        gte: startOfDay(parsed.data.date),
        lte: endOfDay(parsed.data.date)
      },
      status: "approved"
    },
    select: {
      slotId: true
    }
  });

  const approvedSlotIds = new Set(approvedBookings.map((booking) => booking.slotId));

  return NextResponse.json({
    slots: TIME_SLOTS.map((slot) => ({
      ...slot,
      isAvailable: !approvedSlotIds.has(slot.id)
    }))
  });
}

