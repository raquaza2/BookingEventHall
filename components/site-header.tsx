import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/venue", label: "Venue" },
  { href: "/book", label: "Book" },
  { href: "/admin/login", label: "Admin" }
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-[#f8f5ef]/80 backdrop-blur">
      <div className="shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-sm font-semibold uppercase tracking-[0.2em] text-white">
            GA
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Grand Aurora Hall</p>
            <p className="text-xs text-ink/65">Venue Booking</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-ink/75 transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/book"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-800"
        >
          Request Booking
        </Link>
      </div>
    </header>
  );
}
