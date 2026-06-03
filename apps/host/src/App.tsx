import { lazy, Suspense } from 'react'

const FederatedBadge = lazy(
  () => import('csr_remote/FederatedBadge'),
)

export function App() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="kicker">CSR host / SSR remote</p>
        <h1>One host view, two remote render paths.</h1>
        <p className="copy">
          The host is a client-rendered Rsbuild app. It displays a component-only
          SSR route from the TanStack Start remote and a CSR federated module
          from a separate remote.
        </p>

        <div className="remote-grid">
          <article className="remote-panel">
            <p className="panel-kicker">SSR remote route</p>
            <iframe
              className="ssr-frame"
              src="http://localhost:3001/ssr-remote"
              title="SSR remote rendered by TanStack Start"
            />
          </article>

          <article className="remote-panel">
            <p className="panel-kicker">CSR federated module</p>
            <div className="csr-slot">
              <Suspense
                fallback={<span className="loading">Loading remote...</span>}
              >
                <FederatedBadge
                  label="CSR host mounted remote"
                  detail="Remote CSR app loaded in the browser"
                />
              </Suspense>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
