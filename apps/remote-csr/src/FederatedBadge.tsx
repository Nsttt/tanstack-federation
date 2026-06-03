export type FederatedBadgeProps = {
  label?: string
  detail?: string
}

export default function FederatedBadge({
  label = 'CSR remote',
  detail = 'Exposed through Module Federation',
}: FederatedBadgeProps) {
  return (
    <aside className="federated-badge">
      <span className="badge-dot" />
      <span className="badge-copy">
        <strong>{label}</strong>
        <span className="badge-separator">/</span>
        <span>{detail}</span>
      </span>
    </aside>
  )
}
