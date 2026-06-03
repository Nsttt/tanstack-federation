import { createFileRoute } from '@tanstack/react-router'
import { SsrRemotePanel } from '../components/SsrRemotePanel'

export const Route = createFileRoute('/ssr-remote')({
  component: SsrRemote,
})

function SsrRemote() {
  return (
    <main className="ssr-component-route">
      <SsrRemotePanel />
    </main>
  )
}
