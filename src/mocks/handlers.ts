import { HttpResponse, http } from 'msw'
import { DateTime } from 'luxon'

const slots = createSlots()

export const handlers = [
  http.get('/slots', ({ request }) => {
    const url = new URL(request.url)

    const filteredSlots = slots.filter(isAvailable).filter(slot => {
      const day = url.searchParams.get('day')
      return day ? slot.starts.startsWith(day) : true
    })
    return HttpResponse.json(filteredSlots)
  }),

  http.post('/slots/take', async ({ request }) => {
    const { starts } = await request.json() as { starts: string }
    const slot = slots.find((slot) => starts === slot.starts)
    if (slot) {
      slot.taken = true
      return HttpResponse.json(slot)
    } else {
      return new HttpResponse(null, { status: 404 })
    }
  }),
]

function isAvailable(slot: Slot): boolean {
  return !slot.taken
}

function createSlots() {
  const days = Array.from({ length: 5 }).map((_, days) => DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).plus({ days }))
  return days.flatMap(createDay)
}

function createDay(baseDate: DateTime): Slot[] {
  const times = ['9:30', '11:00', '14:00', '15:30', '17:00', '18:30']
  return times.map(time => createSlotFor(time, baseDate)).filter(isInFuture)
}

function isInFuture(slot: Slot): boolean {
  return DateTime.fromISO(slot.starts) > DateTime.now()
}

function createSlotFor(startTime: string, baseDate: DateTime): Slot {
  const [hour, minute] = startTime.split(':').map((n) => Number(n))
  const starts = baseDate.set({ hour, minute, second: 0 })
  return {
    starts: starts.toISO(),
    ends: starts.plus({ minutes: 80 }).toISO(),
    taken: false,
  }
}
