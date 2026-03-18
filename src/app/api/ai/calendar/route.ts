import { NextResponse } from "next/server"
import { getAgentCalendarPayload, parseCalendarFilters } from "@/lib/agent-api"
import { authenticateAgentRequest } from "@/lib/agent-api-auth"

export async function GET(req: Request) {
  const auth = authenticateAgentRequest(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = new URL(req.url)
  const filters = parseCalendarFilters(searchParams)
  const payload = await getAgentCalendarPayload(filters)

  return NextResponse.json(payload)
}
