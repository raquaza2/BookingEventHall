import { BookingForm } from "@/components/booking-form";
import { TIME_SLOTS } from "@/lib/time-slots";

export default function BookPage() {
  return (
    <main className="shell py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <section className="space-y-6">
          <div>
            <p className="eyebrow">Booking Request</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Submit a venue request in one clean flow
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-ink/70">
              Choose your date, select an event block, and send the details the admin team needs to review your
              booking.
            </p>
          </div>

          <div className="panel p-6">
            <p className="text-sm font-semibold text-ink">What happens next</p>
            <div className="mt-4 grid gap-3">
              <Step title="1. Submit request" description="Share your event details and preferred slot." />
              <Step title="2. Admin review" description="The booking stays pending until the team reviews it." />
              <Step title="3. Final status" description="Approved bookings block the slot. Rejected ones free it up." />
            </div>
          </div>

          <div className="panel p-6">
            <p className="text-sm font-semibold text-ink">Today’s slot structure</p>
            <div className="mt-4 space-y-3">
              {TIME_SLOTS.map((slot) => (
                <div key={slot.id} className="rounded-3xl border border-ink/10 bg-[#fbfaf7] p-4">
                  <p className="font-medium text-ink">{slot.label}</p>
                  <p className="mt-1 text-sm text-ink/60">
                    {slot.start} - {slot.end}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BookingForm />
      </div>
    </main>
  );
}

function Step({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl bg-[#fbfaf7] p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm leading-7 text-ink/68">{description}</p>
    </div>
  );
}

