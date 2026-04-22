import Image from "next/image";
import Link from "next/link";
import { getVenue, parseJsonList } from "@/lib/venue";
import { TIME_SLOTS } from "@/lib/time-slots";
import { venueHighlights, venueStats } from "@/lib/site-data";

export default async function HomePage() {
  const venue = await getVenue();
  const gallery = venue ? parseJsonList(venue.galleryImages) : [];

  return (
    <main>
      <section className="shell py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[36px] bg-hero-grid p-8 text-white shadow-soft sm:p-12">
            <p className="eyebrow !text-white/75">Single Venue Booking</p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Book a hall that feels as polished as the event you are planning.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
              {venue?.description ??
                "Explore a realistic venue experience, pick a fixed event slot, and submit your booking request in minutes."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-sand"
              >
                Request a booking
              </Link>
              <Link
                href="/venue"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore the venue
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {venueStats.map((item) => (
              <div key={item.label} className="panel p-6">
                <p className="text-sm text-ink/60">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-ink">{item.value}</p>
              </div>
            ))}
            <div className="panel overflow-hidden sm:col-span-2">
              <Image
                src={gallery[0] ?? venue?.heroImage ?? ""}
                alt="Venue setup"
                width={1200}
                height={720}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-full min-h-[240px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
          <div className="panel p-8">
            <p className="eyebrow">Why This Venue</p>
            <h2 className="section-title mt-3">Practical details for real event planning</h2>
            <div className="mt-6 space-y-4">
              {venueHighlights.map((item) => (
                <div key={item} className="rounded-3xl border border-ink/10 bg-[#fcfbf7] p-4">
                  <p className="text-sm leading-7 text-ink/75">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-8">
            <p className="eyebrow">Fixed Time Slots</p>
            <h2 className="section-title mt-3">A simple schedule that keeps booking approval fast</h2>
            <div className="mt-6 grid gap-4">
              {TIME_SLOTS.map((slot) => (
                <div key={slot.id} className="rounded-3xl border border-brand-100 bg-brand-50/70 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-ink">{slot.label}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-sm text-ink/65">
                      {slot.start} - {slot.end}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-ink/70">{slot.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-10">
        <div className="panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1fr,0.85fr]">
            <div className="p-8 sm:p-10">
              <p className="eyebrow">Ready To Request</p>
              <h2 className="section-title mt-3">Move from browsing to a booking request without friction</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink/70">
                Guests choose a date, select a curated time slot, and submit details for admin review. The admin
                dashboard then keeps every request organized by status.
              </p>
              <Link
                href="/book"
                className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-800"
              >
                Start booking
              </Link>
            </div>
            <div className="bg-[#e9e0cf] p-8 sm:p-10">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Flow 01</p>
                  <p className="mt-3 text-lg font-semibold text-ink">Choose venue details</p>
                </div>
                <div className="rounded-3xl bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Flow 02</p>
                  <p className="mt-3 text-lg font-semibold text-ink">Pick date and slot</p>
                </div>
                <div className="rounded-3xl bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Flow 03</p>
                  <p className="mt-3 text-lg font-semibold text-ink">Admin reviews the request</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
