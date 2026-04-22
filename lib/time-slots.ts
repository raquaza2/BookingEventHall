export type TimeSlot = {
  id: string;
  label: string;
  start: string;
  end: string;
  description: string;
};

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: "morning",
    label: "Morning Setup + Event",
    start: "09:00",
    end: "13:00",
    description: "Ideal for solemnizations, workshops, and corporate sessions."
  },
  {
    id: "afternoon",
    label: "Afternoon Celebration",
    start: "14:30",
    end: "18:30",
    description: "Best for lunch receptions, launches, and community gatherings."
  },
  {
    id: "evening",
    label: "Evening Signature Event",
    start: "19:30",
    end: "23:00",
    description: "Designed for dinners, weddings, and after-dark brand moments."
  }
];

export function getSlotById(slotId: string) {
  return TIME_SLOTS.find((slot) => slot.id === slotId);
}

