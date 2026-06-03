import { lazy, Suspense } from 'react'

const FederatedBadge = lazy(
  () => import('tanstack_federation/FederatedBadge'),
)

export function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="kicker">CSR host / SSR remote</p>
        <h1>One dev command, two federation runtimes.</h1>
        <p className="copy">
          This host is a client-rendered Rsbuild app. It consumes the TanStack
          Start remote running on its own Rsbuild server.
        </p>
        <div className="remote-slot">
          <Suspense fallback={<span className="loading">Loading remote...</span>}>
            <FederatedBadge
              label="CSR host mounted remote"
              detail="Remote served by SSR TanStack Start"
            />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
