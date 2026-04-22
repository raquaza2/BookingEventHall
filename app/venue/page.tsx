import Image from "next/image";
import Link from "next/link";
import { getVenue, parseJsonList } from "@/lib/venue";
import { TIME_SLOTS } from "@/lib/time-slots";
import { venueFaqs } from "@/lib/site-data";

export default async function VenuePage() {
  const venue = await getVenue();

  if (!venue) {
    return (
      <main className="shell py-16">
        <div className="panel p-8 text-center text-ink/70">Venue content has not been seeded yet.</div>
      </main>
    );
  }

  const amenities = parseJsonList(venue.amenities);
  const rules = parseJsonList(venue.houseRules);
  const gallery = parseJsonList(venue.galleryImages);

  return (
    <main className="shell py-10 sm:py-14">
      <section className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div>
          <p className="eyebrow">Venue Details</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{venue.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72">{venue.description}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Metric label="Location" value={venue.location} />
            <Metric label="Capacity" value={`${venue.capacity} guests`} />
            <Metric label="Pricing" value={venue.priceLabel} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/book"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-800"
            >
              Request this venue
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink/35"
            >
              Admin login
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[venue.heroImage, ...gallery].slice(0, 4).map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={`overflow-hidden rounded-[28px] ${index === 0 ? "sm:col-span-2" : ""}`}
            >
              <Image
                src={image}
                alt={`Venue gallery ${index + 1}`}
                width={1200}
                height={index === 0 ? 720 : 480}
                sizes={index === 0 ? "(min-width: 640px) 100vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                className={`w-full object-cover ${index === 0 ? "h-[320px]" : "h-[200px]"}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="panel p-8">
          <p className="eyebrow">Amenities</p>
          <div className="mt-5 grid gap-3">
            {amenities.map((item) => (
              <div key={item} className="rounded-3xl bg-[#fbfaf7] px-4 py-4 text-sm text-ink/75">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-8">
          <p className="eyebrow">House Rules</p>
          <div className="mt-5 space-y-3">
            {rules.map((item) => (
              <div key={item} className="rounded-3xl border border-ink/10 bg-white px-4 py-4 text-sm text-ink/75">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="panel p-8">
          <p className="eyebrow">Available Event Blocks</p>
          <h2 className="section-title mt-3">Curated time slots for faster approvals</h2>
          <div className="mt-6 grid gap-4">
            {TIME_SLOTS.map((slot) => (
              <div key={slot.id} className="rounded-3xl border border-brand-100 bg-brand-50/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">{slot.label}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-ink/65">
                    {slot.start} - {slot.end}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-ink/70">{slot.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-8">
          <p className="eyebrow">FAQ</p>
          <div className="mt-5 space-y-4">
            {venueFaqs.map((item) => (
              <div key={item.question} className="rounded-3xl bg-[#fbfaf7] p-5">
                <p className="font-semibold text-ink">{item.question}</p>
                <p className="mt-2 text-sm leading-7 text-ink/70">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-5">
      <p className="text-sm text-ink/55">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
