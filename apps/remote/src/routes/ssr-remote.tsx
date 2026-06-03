import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ssr-remote')({
  component: SsrRemote,
})

function SsrRemote() {
  return (
    <main
      className="ssr-embed-page flex min-h-screen items-center justify-center p-4"
      data-ssr-origin="tanstack-start-remote"
    >
      <section className="island-shell w-full max-w-xl rounded-2xl p-6">
        <p className="island-kicker mb-3">SSR remote</p>
        <h1 className="display-title mb-4 text-3xl leading-tight font-bold text-[var(--sea-ink)]">
          Rendered by TanStack Start before the host loads it.
        </h1>
        <p className="m-0 text-sm leading-6 text-[var(--sea-ink-soft)]">
          This panel is served by the remote app at request time, then displayed
          inside the CSR host.
        </p>
      </section>
    </main>
  )
}
