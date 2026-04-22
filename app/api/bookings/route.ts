import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSlotById } from "@/lib/time-slots";
import { todayISODate } from "@/lib/utils";
import { bookingFormSchema } from "@/lib/validation";

function startOfDay(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function endOfDay(date: string) {
  return new Date(`${date}T23:59:59.999Z`);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingFormSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        error: "Please fix the highlighted fields.",
        fieldErrors: Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] ?? "Invalid value."])
        )
      },
      { status: 400 }
    );
  }

  const slot = getSlotById(parsed.data.slotId);
  if (!slot) {
    return NextResponse.json({ error: "Selected slot was not found." }, { status: 400 });
  }

  if (parsed.data.bookingDate < todayISODate()) {
    return NextResponse.json({ error: "Booking date must be today or later." }, { status: 400 });
  }
  const bookingDate = new Date(`${parsed.data.bookingDate}T00:00:00.000Z`);

  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      bookingDate: {
        gte: startOfDay(parsed.data.bookingDate),
        lte: endOfDay(parsed.data.bookingDate)
      },
      slotId: parsed.data.slotId,
      status: "approved"
    }
  });

  if (conflictingBooking) {
    return NextResponse.json(
      {
        error: "That slot has already been approved for this date. Please choose another time."
      },
      { status: 409 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      customerName: parsed.data.customerName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      eventType: parsed.data.eventType,
      guestCount: parsed.data.guestCount,
      bookingDate,
      slotId: slot.id,
      slotLabel: `${slot.label} (${slot.start} - ${slot.end})`,
      notes: parsed.data.notes || null
    }
  });

  return NextResponse.json({ bookingId: booking.id }, { status: 201 });
}
