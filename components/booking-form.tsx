"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingFormValues } from "@/lib/validation";
import { TIME_SLOTS } from "@/lib/time-slots";
import { todayISODate } from "@/lib/utils";

type AvailabilitySlot = {
  id: string;
  label: string;
  start: string;
  end: string;
  description: string;
  isAvailable: boolean;
};

type FormErrors = Partial<Record<keyof BookingFormValues | "form", string>>;

const initialForm: BookingFormValues = {
  customerName: "",
  email: "",
  phone: "",
  eventType: "",
  guestCount: 100,
  bookingDate: todayISODate(),
  slotId: TIME_SLOTS[0].id,
  notes: ""
};

export function BookingForm() {
  const router = useRouter();
  const [form, setForm] = useState<BookingFormValues>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const selectedSlotRef = useRef(form.slotId);

  useEffect(() => {
    selectedSlotRef.current = form.slotId;
  }, [form.slotId]);

  useEffect(() => {
    async function fetchAvailability() {
      setLoadingAvailability(true);
      setErrors((current) => ({ ...current, form: undefined }));

      try {
        const response = await fetch(`/api/availability?date=${form.bookingDate}`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load time slots.");
        }

        setAvailability(payload.slots);

        const selected = payload.slots.find((slot: AvailabilitySlot) => slot.id === selectedSlotRef.current);
        if (!selected?.isAvailable) {
          const nextAvailable = payload.slots.find((slot: AvailabilitySlot) => slot.isAvailable);
          setForm((current) => ({
            ...current,
            slotId: nextAvailable?.id ?? current.slotId
          }));
        }
      } catch (error) {
        setErrors((current) => ({
          ...current,
          form: error instanceof Error ? error.message : "Unable to load time slots."
        }));
      } finally {
        setLoadingAvailability(false);
      }
    }

    fetchAvailability();
  }, [form.bookingDate]);

  useEffect(() => {
    if (availability.length === 0) {
      return;
    }

    const selected = availability.find((slot) => slot.id === form.slotId);
    if (!selected?.isAvailable) {
      const nextAvailable = availability.find((slot) => slot.isAvailable);
      setForm((current) => ({
        ...current,
        slotId: nextAvailable?.id ?? current.slotId
      }));
    }
  }, [availability, form.slotId]);

  const selectedSlot = useMemo(
    () => availability.find((slot) => slot.id === form.slotId),
    [availability, form.slotId]
  );

  function updateField<K extends keyof BookingFormValues>(key: K, value: BookingFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = await response.json();

      if (!response.ok) {
        if (payload.fieldErrors) {
          setErrors(payload.fieldErrors);
        }

        throw new Error(payload.error ?? "Unable to submit booking request.");
      }

      router.push(`/booking/confirmation/${payload.bookingId}`);
      router.refresh();
    } catch (error) {
      setErrors((current) => ({
        ...current,
        form: error instanceof Error ? error.message : "Unable to submit booking request."
      }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.customerName}>
          <input
            value={form.customerName}
            onChange={(event) => updateField("customerName", event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none ring-0 transition focus:border-brand-500"
            placeholder="Aisha Karim"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Phone" error={errors.phone}>
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            placeholder="+60 12-345 6789"
          />
        </Field>

        <Field label="Event type" error={errors.eventType}>
          <input
            value={form.eventType}
            onChange={(event) => updateField("eventType", event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
            placeholder="Wedding reception"
          />
        </Field>

        <Field label="Guest count" error={errors.guestCount}>
          <input
            type="number"
            min={10}
            max={500}
            value={form.guestCount}
            onChange={(event) => updateField("guestCount", Number(event.target.value))}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
          />
        </Field>

        <Field label="Preferred date" error={errors.bookingDate}>
          <input
            type="date"
            min={todayISODate()}
            value={form.bookingDate}
            onChange={(event) => updateField("bookingDate", event.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
          />
        </Field>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Time slot</label>
          {loadingAvailability ? <span className="text-xs text-ink/55">Checking availability...</span> : null}
        </div>

        <div className="grid gap-3">
          {(availability.length > 0 ? availability : TIME_SLOTS).map((slot) => {
            const isAvailable = "isAvailable" in slot ? slot.isAvailable : true;
            const isSelected = form.slotId === slot.id;

            return (
              <label
                key={slot.id}
                className={`rounded-3xl border p-4 transition ${
                  isSelected ? "border-brand-600 bg-brand-50" : "border-ink/10 bg-white"
                } ${!isAvailable ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:border-brand-300"}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="slotId"
                    value={slot.id}
                    checked={isSelected}
                    onChange={() => updateField("slotId", slot.id)}
                    disabled={!isAvailable}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">{slot.label}</p>
                      <span className="rounded-full bg-ink/5 px-2 py-1 text-xs text-ink/60">
                        {slot.start} - {slot.end}
                      </span>
                      {!isAvailable ? (
                        <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">
                          Unavailable
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-ink/65">{slot.description}</p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {errors.slotId ? <p className="mt-2 text-sm text-rose-600">{errors.slotId}</p> : null}
      </div>

      <Field label="Additional notes" error={errors.notes} className="mt-6">
        <textarea
          rows={4}
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-brand-500"
          placeholder="Share setup requirements, event flow, or anything the venue should know."
        />
      </Field>

      <div className="mt-6 rounded-3xl bg-sand/70 p-5">
        <p className="text-sm font-semibold text-ink">Request summary</p>
        <p className="mt-2 text-sm text-ink/70">
          {form.bookingDate} {selectedSlot ? `• ${selectedSlot.label} (${selectedSlot.start} - ${selectedSlot.end})` : ""}
        </p>
        <p className="mt-2 text-sm text-ink/70">
          Your request will be saved as <span className="font-semibold text-amber-700">pending</span> until the admin reviews it.
        </p>
      </div>

      {errors.form ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errors.form}</p> : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/60">Only approved bookings block the chosen slot.</p>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Submit booking request"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
