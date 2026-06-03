import { loadRemote } from '@module-federation/runtime'
import { useEffect, useState, type ComponentType } from 'react'

export type FederatedBadgeProps = {
  label?: string
  detail?: string
}

type FederatedBadgeModule = {
  default: ComponentType<FederatedBadgeProps>
}

export function FederatedBadgeSlot(props: FederatedBadgeProps) {
  const [RemoteBadge, setRemoteBadge] =
    useState<ComponentType<FederatedBadgeProps> | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadRemote<FederatedBadgeModule>('csr_remote/FederatedBadge')
      .then((remoteModule) => {
        if (!cancelled && remoteModule?.default) {
          setRemoteBadge(() => remoteModule.default)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (failed) {
    return <span className="loading">Remote unavailable</span>
  }

  if (!RemoteBadge) {
    return <span className="loading">Loading remote...</span>
  }

  return <RemoteBadge {...props} />
}
