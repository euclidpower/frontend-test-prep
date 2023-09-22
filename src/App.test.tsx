import { render, screen } from "./utils/test-utils"
import App from "./App"
import { DateTime } from "luxon"

it('should list and select available slots', async () => {
  const { user } = render(<App />)
  const lastAvailableEveningSlot = await screen.findByRole<HTMLInputElement>('radio', { name: /6:30/, checked: false })

  await user.click(lastAvailableEveningSlot)

  expect(lastAvailableEveningSlot).toBeChecked()
  const expectedDate = DateTime.now().set({ hour: 18, minute: 30, second: 0, millisecond: 0 }).toISO()
  expect(lastAvailableEveningSlot.form).toHaveFormValues({ starts: expectedDate })
})

it('should validate a time must be selected', async () => {
  const { user } = render(<App />)

  await user.click(await screen.findByRole('button', { name: 'Request meeting' }))

  expect(await screen.findByText('You need to pick a time before continuing')).toBeVisible()
})
