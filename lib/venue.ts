import { prisma } from "@/lib/prisma";

export async function getVenue() {
  return prisma.venue.findFirst({
    orderBy: {
      createdAt: "asc"
    }
  });
}

export function parseJsonList(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

