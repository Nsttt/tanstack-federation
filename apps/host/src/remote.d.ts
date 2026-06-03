declare module 'tanstack_federation/FederatedBadge' {
  import type { ComponentType } from 'react'

  export type FederatedBadgeProps = {
    label?: string
    detail?: string
  }

  const FederatedBadge: ComponentType<FederatedBadgeProps>
  export default FederatedBadge
}
