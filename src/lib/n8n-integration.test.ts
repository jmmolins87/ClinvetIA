import { afterEach, describe, expect, it, vi } from "vitest"

import { callN8nWebhook, isN8nConfigured } from "@/lib/n8n-integration"

const ORIGINAL_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
const ORIGINAL_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET

afterEach(() => {
  if (typeof ORIGINAL_WEBHOOK_URL === "string") {
    process.env.N8N_WEBHOOK_URL = ORIGINAL_WEBHOOK_URL
  } else {
    delete process.env.N8N_WEBHOOK_URL
  }

  if (typeof ORIGINAL_WEBHOOK_SECRET === "string") {
    process.env.N8N_WEBHOOK_SECRET = ORIGINAL_WEBHOOK_SECRET
  } else {
    delete process.env.N8N_WEBHOOK_SECRET
  }

  vi.restoreAllMocks()
})

describe("isN8nConfigured", () => {
  it("returns false when webhook url is missing", () => {
    delete process.env.N8N_WEBHOOK_URL

    expect(isN8nConfigured()).toBe(false)
  })
})

describe("callN8nWebhook", () => {
  it("returns null when n8n is not configured", async () => {
    delete process.env.N8N_WEBHOOK_URL

    await expect(callN8nWebhook({ channel: "web" })).resolves.toBeNull()
  })

  it("sends the secret header when configured", async () => {
    process.env.N8N_WEBHOOK_URL = "https://n8n.example.com/webhook/clinvetia-ai"
    process.env.N8N_WEBHOOK_SECRET = "super-secret"

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )

    vi.stubGlobal("fetch", fetchMock)

    await callN8nWebhook({ channel: "web", message: "hola" })

    expect(fetchMock).toHaveBeenCalledWith(
      "https://n8n.example.com/webhook/clinvetia-ai",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-clinvetia-n8n-secret": "super-secret",
        }),
      }),
    )
  })
})
