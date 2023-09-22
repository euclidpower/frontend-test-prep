import matchers from '@testing-library/jest-dom/matchers'
import { expect, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/setup-server'
import 'whatwg-fetch'

expect.extend(matchers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => { server.resetHandlers(), cleanup() })

server.events.on('unhandledException', (error, req) =>
  console.error(`An unhandled exception ocurred when mocking\n\t${req.method} ${req.url}\n\n${error.stack}`),
)
