import FederatedBadge from './FederatedBadge'

export function App() {
  return (
    <main className="remote-shell">
      <p className="kicker">CSR remote</p>
      <h1>Browser-only federated component.</h1>
      <FederatedBadge detail="Rendered directly by the CSR remote app" />
    </main>
  )
}
