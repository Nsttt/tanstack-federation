import type { FederatedBadgeProps } from 'csr_remote/FederatedBadge'

export default function FederatedBadge({ label, detail }: FederatedBadgeProps) {
  return (
    <span>
      {label ?? 'remote badge'}
      {detail ? <small>{detail}</small> : null}
    </span>
  )
}
