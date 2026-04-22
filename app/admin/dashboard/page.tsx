import { AdminBookingsPanel } from "@/components/admin-bookings-panel";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const bookings = await prisma.booking.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  });

  return (
    <main className="shell py-10 sm:py-14">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-ink/55">Signed in as {admin.email}</p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminBookingsPanel
        initialBookings={bookings.map((booking) => ({
          ...booking,
          bookingDate: booking.bookingDate.toISOString(),
          createdAt: booking.createdAt.toISOString()
        }))}
      />
    </main>
  );
}

