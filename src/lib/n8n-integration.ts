export function getN8nWebhookUrl() {
  const url = process.env.N8N_WEBHOOK_URL?.trim()
  return url || null
}

export function isN8nConfigured() {
  return Boolean(getN8nWebhookUrl())
}

export async function callN8nWebhook<T = Record<string, unknown>>(
  payload: Record<string, unknown>,
  options?: { timeoutMs?: number },
) {
  const webhookUrl = getN8nWebhookUrl()
  if (!webhookUrl) return null

  const timeoutMs = options?.timeoutMs ?? 45000
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-clinvetia-n8n-secret": secret } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    })

    const data = (await response.json().catch(() => null)) as T | null

    return {
      ok: response.ok,
      status: response.status,
      data,
      error:
        !response.ok
          ? (typeof data === "object" &&
            data &&
            "error" in data &&
            typeof (data as { error?: unknown }).error === "string"
              ? (data as { error: string }).error
              : "N8N request failed")
          : null,
    }
  } catch (error) {
    return {
      ok: false,
      status: 502,
      data: null,
      error: error instanceof Error ? error.message : "N8N request failed",
    }
  } finally {
    clearTimeout(timeout)
  }
}
