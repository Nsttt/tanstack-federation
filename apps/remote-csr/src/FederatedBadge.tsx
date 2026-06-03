import './FederatedBadge.css'

export type FederatedBadgeProps = {
  label?: string
  detail?: string
}

export default function FederatedBadge({
  label = 'CSR remote',
  detail = 'Exposed through Module Federation',
}: FederatedBadgeProps) {
  return (
    <aside className="mf-csr-card" aria-label="CSR federated remote status">
      <div className="mf-csr-chrome" aria-hidden="true">
        <span className="mf-csr-window-dot" />
        <span className="mf-csr-window-dot" />
        <span className="mf-csr-window-dot" />
        <span className="mf-csr-live">live</span>
      </div>

      <div className="mf-csr-heading">
        <span className="mf-csr-signal" aria-hidden="true" />
        <div className="mf-csr-copy">
          <strong>{label}</strong>
          <span>{detail}</span>
        </div>
      </div>

      <dl className="mf-csr-metrics">
        <div>
          <dt>runtime</dt>
          <dd>browser</dd>
        </div>
        <div>
          <dt>handoff</dt>
          <dd>suspense</dd>
        </div>
        <div>
          <dt>remote</dt>
          <dd>3002</dd>
        </div>
      </dl>

      <div className="mf-csr-trace" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </aside>
  )
}
