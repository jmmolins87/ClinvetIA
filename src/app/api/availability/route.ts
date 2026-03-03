import { NextResponse } from "next/server"
import { z } from "zod"
import { dbConnect } from "@/lib/db"
import { Booking } from "@/models/Booking"
import { DEMO_BLOCKED_TIME_SLOTS, DEMO_TIME_SLOTS } from "@/lib/demo-schedule"

const querySchema = z.object({
  date: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.string().datetime()])
    .optional(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const parsed = querySchema.parse({ date: searchParams.get("date") || undefined })

    if (!parsed.date) {
      return NextResponse.json({ slots: DEMO_TIME_SLOTS, unavailable: DEMO_BLOCKED_TIME_SLOTS })
    }

    const date = parsed.date.includes("T")
      ? new Date(parsed.date)
      : new Date(`${parsed.date}T00:00:00.000Z`)
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 })
    }

    const start = new Date(date)
    start.setHours(0, 0, 0, 0)

    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    await dbConnect()

    const bookings = await Booking.find({ date: { $gte: start, $lte: end }, status: "confirmed" })
      .select("time")
      .lean()

    const unavailable = Array.from(new Set([...bookings.map((b) => b.time), ...DEMO_BLOCKED_TIME_SLOTS]))

    return NextResponse.json({ slots: DEMO_TIME_SLOTS, unavailable })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    )
  }
}
