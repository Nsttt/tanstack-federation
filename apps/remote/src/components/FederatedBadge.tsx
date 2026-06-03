export type FederatedBadgeProps = {
  label?: string
  detail?: string
}

export default function FederatedBadge({
  label = 'Rsbuild remote',
  detail = 'Exposed through Module Federation',
}: FederatedBadgeProps) {
  return (
    <aside className="inline-flex max-w-full items-center gap-3 rounded-full border border-[rgba(23,58,64,0.18)] bg-white/65 px-4 py-2 text-sm text-[var(--sea-ink)] shadow-[0_12px_30px_rgba(30,90,72,0.1)] backdrop-blur">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[linear-gradient(135deg,#56c6be,#f2b84b)]" />
      <span className="min-w-0">
        <strong className="font-semibold">{label}</strong>
        <span className="mx-2 text-[var(--sea-ink-soft)]">/</span>
        <span className="text-[var(--sea-ink-soft)]">{detail}</span>
      </span>
    </aside>
  )
}
