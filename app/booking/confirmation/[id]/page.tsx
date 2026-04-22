import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function BookingConfirmationPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id }
  });

  if (!booking) {
    notFound();
  }

  return (
    <main className="shell py-14">
      <div className="mx-auto max-w-3xl panel p-8 sm:p-10">
        <p className="eyebrow">Booking Submitted</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Your venue request is now pending</h1>
        <p className="mt-5 text-base leading-8 text-ink/72">
          The admin team can now review your request and decide whether to approve or reject the selected slot.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="text-sm font-medium text-ink">Current status</span>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-8 grid gap-4 rounded-[28px] bg-[#fbfaf7] p-6 sm:grid-cols-2">
          <Summary label="Booking ID" value={booking.id} />
          <Summary label="Guest" value={booking.customerName} />
          <Summary label="Email" value={booking.email} />
          <Summary label="Phone" value={booking.phone} />
          <Summary label="Event" value={booking.eventType} />
          <Summary label="Guest count" value={`${booking.guestCount} attendees`} />
          <Summary label="Date" value={formatDate(booking.bookingDate)} />
          <Summary label="Time slot" value={booking.slotLabel} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/venue"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-800"
          >
            Back to venue details
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink/35"
          >
            Submit another request
          </Link>
        </div>
      </div>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">{label}</p>
      <p className="mt-2 text-sm text-ink/75">{value}</p>
    </div>
  );
}

