import { afterEach, describe, expect, it } from "vitest"

import { authenticateAgentRequest } from "@/lib/agent-api-auth"

const ORIGINAL_ENV = process.env.AI_INTEGRATION_API_KEY

afterEach(() => {
  if (typeof ORIGINAL_ENV === "string") {
    process.env.AI_INTEGRATION_API_KEY = ORIGINAL_ENV
    return
  }

  delete process.env.AI_INTEGRATION_API_KEY
})

describe("authenticateAgentRequest", () => {
  it("accepts a request with a bearer token", () => {
    process.env.AI_INTEGRATION_API_KEY = "secret-token"

    const request = new Request("http://localhost/api/ai/dashboard", {
      headers: {
        Authorization: "Bearer secret-token",
      },
    })

    expect(authenticateAgentRequest(request)).toEqual({ ok: true })
  })

  it("accepts a request with x-api-key", () => {
    process.env.AI_INTEGRATION_API_KEY = "secret-token"

    const request = new Request("http://localhost/api/ai/calendar", {
      headers: {
        "x-api-key": "secret-token",
      },
    })

    expect(authenticateAgentRequest(request)).toEqual({ ok: true })
  })

  it("rejects a request when the key is missing", () => {
    process.env.AI_INTEGRATION_API_KEY = "secret-token"

    const request = new Request("http://localhost/api/ai/calendar")

    expect(authenticateAgentRequest(request)).toEqual({
      ok: false,
      status: 401,
      error: "Unauthorized",
    })
  })

  it("rejects a request when the integration key is not configured", () => {
    delete process.env.AI_INTEGRATION_API_KEY

    const request = new Request("http://localhost/api/ai/calendar", {
      headers: {
        Authorization: "Bearer anything",
      },
    })

    expect(authenticateAgentRequest(request)).toEqual({
      ok: false,
      status: 500,
      error: "AI integration API key is not configured",
    })
  })
})
