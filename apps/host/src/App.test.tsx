import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the host shell and remote slot', async () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'One dev command, two federation runtimes.',
      }),
    ).toBeDefined()
    expect(await screen.findByText('CSR host mounted remote')).toBeDefined()
  })
})
