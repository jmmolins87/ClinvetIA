import { NextResponse } from "next/server"
import { AdminSession } from "@/models/AdminSession"
import { dbConnect } from "@/lib/db"
import { getAdminCookieName } from "@/lib/admin-auth"
import { resetDemoBookingsState } from "@/lib/admin-demo-bookings-state"
import { resetDemoMailMessages } from "@/lib/admin-demo-mail-state"
import { recordAdminAudit } from "@/lib/admin-audit"

function getCookie(req: Request, name: string) {
  const header = req.headers.get("cookie")
  if (!header) return null
  const parts = header.split(";")
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=")
    if (k === name) return decodeURIComponent(rest.join("="))
  }
  return null
}

export async function POST(req: Request) {
  const cookieName = getAdminCookieName()
  const token = getCookie(req, cookieName)
  const isExplicitDemoLogout = req.headers.get("x-clinvetia-demo-logout") === "1"
  let shouldResetDemoState = isExplicitDemoLogout

  if (token) {
    await dbConnect()
    const session = await AdminSession.findOneAndDelete({ token }).lean<{ role?: string; adminId?: string | { toString(): string } } | null>()
    if (session?.adminId) {
      await recordAdminAudit({
        adminId: typeof session.adminId === "string" ? session.adminId : session.adminId.toString(),
        action: "ADMIN_LOGOUT",
        targetType: "admin_session",
        targetId: token,
        metadata: { role: session.role || null, explicitDemoLogout: isExplicitDemoLogout },
      })
    }
    shouldResetDemoState = shouldResetDemoState || session?.role === "demo"
  }

  if (shouldResetDemoState) {
    resetDemoBookingsState()
    resetDemoMailMessages()
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  })

  return res
}
