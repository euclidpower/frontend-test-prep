import { render } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'

const customRender = (ui: React.ReactElement, options = {}) => {
  return {
    ...render(ui, {
      // wrap provider(s) here if needed
      wrapper: ({ children }) => children,
      ...options,
    }),
    get user() {
      return userEvent.setup()
    }
  }
}

export * from '@testing-library/react'
// override render export
export { customRender as render }
