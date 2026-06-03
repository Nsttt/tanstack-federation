import type { FederatedBadgeProps } from 'tanstack_federation/FederatedBadge'

export default function FederatedBadge({ label, detail }: FederatedBadgeProps) {
  return (
    <span>
      {label ?? 'remote badge'}
      {detail ? <small>{detail}</small> : null}
    </span>
  )
}
