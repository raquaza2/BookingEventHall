import { z } from "zod";
import { TIME_SLOTS } from "@/lib/time-slots";

const slotIds = TIME_SLOTS.map((slot) => slot.id) as [string, ...string[]];

export const bookingFormSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number.")
    .max(20, "Please enter a valid phone number."),
  eventType: z.string().trim().min(2, "Please tell us the event type."),
  guestCount: z.coerce
    .number()
    .int("Guest count must be a whole number.")
    .min(10, "Minimum guest count is 10.")
    .max(500, "Guest count must be under 500."),
  bookingDate: z
    .string()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Please choose a valid date."),
  slotId: z.enum(slotIds, {
    message: "Please choose a time slot."
  }),
  notes: z.string().trim().max(500, "Notes must be under 500 characters.").optional().or(z.literal(""))
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid admin email."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["approved", "rejected"])
});

export const availabilityQuerySchema = z.object({
  date: z
    .string()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid date supplied.")
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

