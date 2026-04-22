import clsx from "clsx";

const styles = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800"
} as const;

export function StatusBadge({ status }: { status: keyof typeof styles }) {
  return (
    <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize", styles[status])}>
      {status}
    </span>
  );
}

