import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the CSR remote demo surface', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Browser-only federated component.',
      }),
    ).toBeDefined()
    expect(
      screen.getByText('Rendered directly by the CSR remote app'),
    ).toBeDefined()
  })
})
