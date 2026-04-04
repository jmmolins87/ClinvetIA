import { NextResponse } from "next/server"
import { z } from "zod"
import { dbConnect } from "@/lib/db"
import { User } from "@/models/User"
import { verifyPassword } from "@/lib/auth"
import { createAdminSession, getAdminCookieName } from "@/lib/admin-auth"
import { type AdminRole } from "@/lib/admin-roles"
import { verifyRecaptchaToken } from "@/lib/recaptcha-server"
import { recordAdminAudit } from "@/lib/admin-audit"

interface LoginUser {
  _id: { toString(): string }
  email: string
  name: string
  role: string
  passwordHash: string
  status: "active" | "disabled"
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  recaptchaToken: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = loginSchema.parse(body)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null
    const recaptcha = await verifyRecaptchaToken({
      token: parsed.recaptchaToken,
      action: "admin_login",
      minScore: 0.5,
      ip,
    })
    if (!recaptcha.ok) {
      await recordAdminAudit({
        actorType: "external",
        actorLabel: parsed.email.trim().toLowerCase(),
        action: "ADMIN_LOGIN_REJECTED",
        targetType: "admin_auth",
        targetId: parsed.email.trim().toLowerCase(),
        metadata: { reason: recaptcha.reason || "recaptcha_failed", ip },
      })
      return NextResponse.json({ error: recaptcha.reason || "reCAPTCHA validation failed" }, { status: 400 })
    }

    await dbConnect()

    const rawUser = await User.findOne({ email: parsed.email }).lean<LoginUser>()
    const user = Array.isArray(rawUser) ? rawUser[0] : rawUser
    if (!user) {
      await recordAdminAudit({
        actorType: "external",
        actorLabel: parsed.email.trim().toLowerCase(),
        action: "ADMIN_LOGIN_REJECTED",
        targetType: "admin_auth",
        targetId: parsed.email.trim().toLowerCase(),
        metadata: { reason: "user_not_found", ip },
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.status !== "active") {
      await recordAdminAudit({
        adminId: String(user._id),
        actorLabel: user.email,
        action: "ADMIN_LOGIN_REJECTED",
        targetType: "admin_auth",
        targetId: String(user._id),
        metadata: { reason: "user_disabled", email: user.email, ip },
      })
      return NextResponse.json({ error: "User disabled" }, { status: 403 })
    }

    if (!verifyPassword(parsed.password, user.passwordHash)) {
      await recordAdminAudit({
        adminId: String(user._id),
        actorLabel: user.email,
        action: "ADMIN_LOGIN_REJECTED",
        targetType: "admin_auth",
        targetId: String(user._id),
        metadata: { reason: "invalid_password", email: user.email, ip },
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const userId = String(user._id)

    const session = await createAdminSession({
      adminId: userId,
      role: user.role as AdminRole,
    })

    const res = NextResponse.json({
      id: userId,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    res.cookies.set(getAdminCookieName(), session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: session.expiresAt,
      path: "/",
    })

    await recordAdminAudit({
      adminId: userId,
      actorLabel: user.email,
      action: "ADMIN_LOGIN_SUCCESS",
      targetType: "admin_session",
      targetId: session.token,
      metadata: { email: user.email, role: user.role, ip },
    })

    return res
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
