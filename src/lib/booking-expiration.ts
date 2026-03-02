import { Booking } from "@/models/Booking"

export async function expireOverdueBookings() {
  const now = new Date()
  return Booking.updateMany(
    {
      status: { $in: ["pending", "confirmed"] },
      demoExpiresAt: { $lte: now },
    },
    { $set: { status: "expired" } }
  )
}
