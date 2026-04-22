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
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.35rem] bg-[linear-gradient(160deg,#1d221b_0%,#43522f_55%,#b66b4a_100%)] shadow-[0_16px_32px_rgba(29,34,27,0.2)]">
            <span className="absolute inset-[1px] rounded-[1.25rem] border border-white/15" />
            <span className="absolute left-2.5 top-2.5 h-4 w-4 rounded-full border border-white/20" />
            <span className="relative flex items-end gap-[2px]">
              <span className="text-[0.92rem] font-semibold uppercase leading-none tracking-[0.14em] text-white">
                G
              </span>
              <span className="mb-[1px] text-[0.7rem] font-medium uppercase leading-none tracking-[0.24em] text-sand">
                A
              </span>
            </span>
          </span>
          <div>
            <p className="text-base font-semibold tracking-[-0.02em] text-ink">Grand Aurora Hall</p>
            <p className="text-[0.7rem] uppercase tracking-[0.26em] text-ink/50">Venue Booking</p>
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
