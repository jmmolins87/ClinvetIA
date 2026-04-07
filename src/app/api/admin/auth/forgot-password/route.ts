import { NextRequest, NextResponse } from "next/server"

function resolveAuthServerForgotPasswordUrl() {
  const explicitUrl = process.env.AUTHSERVER_FORGOT_PASSWORD_URL?.trim()
  if (explicitUrl) return explicitUrl

  const baseUrl = process.env.AUTHSERVER_URL?.trim()
  if (!baseUrl) return null

  return `${baseUrl.replace(/\/+$/, "")}/forgot-password`
}

export async function GET(req: NextRequest) {
  const target = resolveAuthServerForgotPasswordUrl()
  if (!target) {
    return NextResponse.json({ error: "Authserver forgot password URL not configured" }, { status: 503 })
  }

  const requestUrl = new URL(req.url)
  const email = requestUrl.searchParams.get("email")?.trim()
  const redirectUrl = new URL(target)

  if (email) {
    redirectUrl.searchParams.set("email", email)
  }

  return NextResponse.redirect(redirectUrl)
}
