export const DEMO_TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00",
] as const

export const DEMO_BLOCKED_TIME_SLOTS = DEMO_TIME_SLOTS.filter((time) => time < "17:00")

export const DEMO_BOOKABLE_TIME_SLOTS = DEMO_TIME_SLOTS.filter((time) => time >= "17:00")

const DEMO_TIME_SET = new Set<string>(DEMO_TIME_SLOTS)
const DEMO_BOOKABLE_TIME_SET = new Set<string>(DEMO_BOOKABLE_TIME_SLOTS)

export function isValidDemoTimeSlot(time: string) {
  return DEMO_TIME_SET.has(time)
}

export function isBookableDemoTimeSlot(time: string) {
  return DEMO_BOOKABLE_TIME_SET.has(time)
}
