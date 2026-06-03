import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

vi.mock('@module-federation/runtime', () => ({
  loadRemote: vi.fn(async () => ({
    default: ({
      label,
      detail,
    }: {
      label?: string
      detail?: string
    }) => (
      <aside>
        <strong>{label}</strong>
        <span>{detail}</span>
      </aside>
    ),
  })),
}))

describe('App', () => {
  it('renders the host shell and remote slot', async () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'One host view, two remote render paths.',
      }),
    ).toBeDefined()
    expect(
      screen.getByTitle('SSR remote rendered by TanStack Start'),
    ).toBeDefined()
    expect(await screen.findByText('CSR host mounted remote')).toBeDefined()
  })
})
