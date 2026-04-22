import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateBookingStatusSchema } from "@/lib/validation";

function startOfDay(date: Date) {
  const value = new Date(date);
  value.setUTCHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date: Date) {
  const value = new Date(date);
  value.setUTCHours(23, 59, 59, 999);
  return value;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateBookingStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid status." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id }
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking was not found." }, { status: 404 });
  }

  if (parsed.data.status === "approved") {
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        id: {
          not: id
        },
        bookingDate: {
          gte: startOfDay(booking.bookingDate),
          lte: endOfDay(booking.bookingDate)
        },
        slotId: booking.slotId,
        status: "approved"
      }
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          error: "Another booking has already been approved for this date and slot."
        },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status }
  });

  return NextResponse.json({
    booking: {
      ...updated,
      bookingDate: updated.bookingDate.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    }
  });
}
