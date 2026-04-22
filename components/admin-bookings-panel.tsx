"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatDateTime } from "@/lib/utils";

type DashboardBooking = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  eventType: string;
  guestCount: number;
  bookingDate: string;
  slotId: string;
  slotLabel: string;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

type DashboardProps = {
  initialBookings: DashboardBooking[];
};

export function AdminBookingsPanel({ initialBookings }: DashboardProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState<"all" | DashboardBooking["status"]>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [activeBookingId, setActiveBookingId] = useState(initialBookings[0]?.id ?? "");
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" ? true : booking.status === statusFilter;
      const matchesDate = dateFilter ? booking.bookingDate.startsWith(dateFilter) : true;
      return matchesStatus && matchesDate;
    });
  }, [bookings, statusFilter, dateFilter]);

  const activeBooking =
    filteredBookings.find((booking) => booking.id === activeBookingId) ?? filteredBookings[0] ?? null;

  async function updateStatus(bookingId: string, status: "approved" | "rejected") {
    setBusyId(bookingId);
    setError("");

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to update booking.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? { ...booking, status: payload.booking.status } : booking
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update booking.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <section className="panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink">Manage incoming bookings</h1>
            <p className="mt-2 text-sm text-ink/65">
              Review pending requests and keep approved event slots accurate.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "all" | DashboardBooking["status"])}
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
            />
          </div>
        </div>

        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <div className="mt-6 overflow-hidden rounded-3xl border border-ink/10">
          <div className="hidden grid-cols-[1.1fr,0.95fr,0.8fr,0.7fr] gap-4 bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 md:grid">
            <span>Guest</span>
            <span>Schedule</span>
            <span>Event</span>
            <span>Status</span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white px-4 py-10 text-center text-sm text-ink/60">
              No bookings match the selected filters.
            </div>
          ) : (
            <div className="divide-y divide-ink/10 bg-white">
              {filteredBookings.map((booking) => (
                <button
                  type="button"
                  key={booking.id}
                  onClick={() => setActiveBookingId(booking.id)}
                  className={`grid w-full gap-3 px-4 py-4 text-left transition md:grid-cols-[1.1fr,0.95fr,0.8fr,0.7fr] ${
                    activeBooking?.id === booking.id ? "bg-brand-50" : "hover:bg-[#faf8f1]"
                  }`}
                >
                  <div>
                    <p className="font-medium text-ink">{booking.customerName}</p>
                    <p className="text-sm text-ink/60">{booking.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-ink">{formatDate(booking.bookingDate)}</p>
                    <p className="text-sm text-ink/60">{booking.slotLabel}</p>
                  </div>
                  <div>
                    <p className="font-medium text-ink">{booking.eventType}</p>
                    <p className="text-sm text-ink/60">{booking.guestCount} guests</p>
                  </div>
                  <div>
                    <StatusBadge status={booking.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <aside className="panel p-6">
        {activeBooking ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Booking Detail</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{activeBooking.customerName}</h2>
              </div>
              <StatusBadge status={activeBooking.status} />
            </div>

            <div className="mt-6 space-y-4 text-sm text-ink/70">
              <Detail label="Event">{activeBooking.eventType}</Detail>
              <Detail label="Guests">{activeBooking.guestCount} attendees</Detail>
              <Detail label="Date">{formatDate(activeBooking.bookingDate)}</Detail>
              <Detail label="Time slot">{activeBooking.slotLabel}</Detail>
              <Detail label="Email">{activeBooking.email}</Detail>
              <Detail label="Phone">{activeBooking.phone}</Detail>
              <Detail label="Submitted">{formatDateTime(activeBooking.createdAt)}</Detail>
              <Detail label="Notes">{activeBooking.notes || "No extra notes provided."}</Detail>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => updateStatus(activeBooking.id, "approved")}
                disabled={busyId === activeBooking.id || activeBooking.status === "approved"}
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyId === activeBooking.id ? "Saving..." : "Approve"}
              </button>
              <button
                type="button"
                onClick={() => updateStatus(activeBooking.id, "rejected")}
                disabled={busyId === activeBooking.id || activeBooking.status === "rejected"}
                className="rounded-full bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyId === activeBooking.id ? "Saving..." : "Reject"}
              </button>
            </div>
          </>
        ) : (
          <div className="grid min-h-[300px] place-items-center text-center text-sm text-ink/60">
            Select a booking request to view its details.
          </div>
        )}
      </aside>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">{label}</p>
      <p className="mt-1 text-sm leading-6 text-ink/75">{children}</p>
    </div>
  );
}

