import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const federatedBadgeMock = fileURLToPath(
  new URL('./src/test/FederatedBadge.mock.tsx', import.meta.url),
)

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      'csr_remote/FederatedBadge': federatedBadgeMock,
    },
  },
})
