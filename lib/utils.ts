export function formatDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(value);
}

export function formatDateTime(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(value);
}

export function toISODateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function todayISODate() {
  return toISODateOnly(new Date());
}

