export function SsrRemotePanel() {
  return (
    <section
      className="ssr-remote-card"
      data-ssr-origin="tanstack-start-remote"
    >
      <p className="island-kicker">SSR remote</p>
      <h1 className="display-title">
        Rendered by TanStack Start before the host loads it.
      </h1>
      <p>
        This is a component-only SSR surface from the TanStack Start remote.
      </p>
    </section>
  )
}
