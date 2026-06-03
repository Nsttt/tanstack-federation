import { describe, expect, it } from 'vitest'
import { getRouter } from './router'

describe('router', () => {
  it('registers the app routes', () => {
    const router = getRouter()

    expect(router.routesByPath['/']).toBeDefined()
    expect(router.routesByPath['/about']).toBeDefined()
  })
})
