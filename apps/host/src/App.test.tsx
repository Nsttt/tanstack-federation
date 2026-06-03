import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

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
