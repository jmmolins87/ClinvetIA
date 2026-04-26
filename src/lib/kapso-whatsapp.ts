type WhatsAppSendResult =
  | { ok: true; provider: "kapso" | "meta"; skipped: false }
  | { ok: false; provider: "kapso" | "meta"; skipped: boolean }

function getTrimmedEnv(name: string) {
  const value = process.env[name]?.trim()
  return value || null
}

function joinUrl(...parts: string[]) {
  return parts
    .map((part, index) => (index === 0 ? part.replace(/\/+$/, "") : part.replace(/^\/+|\/+$/g, "")))
    .filter(Boolean)
    .join("/")
}

function getKapsoMetaProxyBaseUrl() {
  const explicitUrl = getTrimmedEnv("KAPSO_WHATSAPP_API_URL")
  if (explicitUrl) return explicitUrl.replace(/\/+$/, "")

  const apiBaseUrl = getTrimmedEnv("KAPSO_API_BASE_URL") || "https://api.kapso.ai"
  const graphVersion = getTrimmedEnv("META_GRAPH_VERSION") || "v24.0"
  return joinUrl(apiBaseUrl, "meta/whatsapp", graphVersion)
}

async function sendKapsoWhatsAppText(to: string, body: string): Promise<WhatsAppSendResult> {
  const apiKey = getTrimmedEnv("KAPSO_API_KEY")
  const phoneNumberId = getTrimmedEnv("KAPSO_WHATSAPP_PHONE_NUMBER_ID") || getTrimmedEnv("WHATSAPP_PHONE_NUMBER_ID")

  if (!apiKey || !phoneNumberId) {
    console.warn("Kapso WhatsApp send skipped: missing KAPSO_API_KEY or KAPSO_WHATSAPP_PHONE_NUMBER_ID")
    return { ok: false, provider: "kapso", skipped: true }
  }

  const res = await fetch(joinUrl(getKapsoMetaProxyBaseUrl(), encodeURIComponent(phoneNumberId), "messages"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
    cache: "no-store",
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    console.error("Kapso WhatsApp send failed", { status: res.status, detail, to })
    return { ok: false, provider: "kapso", skipped: false }
  }

  return { ok: true, provider: "kapso", skipped: false }
}

async function sendMetaWhatsAppText(to: string, body: string): Promise<WhatsAppSendResult> {
  const token = getTrimmedEnv("WHATSAPP_ACCESS_TOKEN")
  const phoneNumberId = getTrimmedEnv("WHATSAPP_PHONE_NUMBER_ID")
  const graphApiUrl = getTrimmedEnv("WHATSAPP_GRAPH_API_URL") || "https://graph.facebook.com/v20.0"

  if (!token || !phoneNumberId) {
    console.warn("Meta WhatsApp send skipped: missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID")
    return { ok: false, provider: "meta", skipped: true }
  }

  const res = await fetch(joinUrl(graphApiUrl, encodeURIComponent(phoneNumberId), "messages"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
    cache: "no-store",
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    console.error("Meta WhatsApp send failed", { status: res.status, detail, to })
    return { ok: false, provider: "meta", skipped: false }
  }

  return { ok: true, provider: "meta", skipped: false }
}

export async function sendWhatsAppText(to: string, body: string): Promise<WhatsAppSendResult> {
  const preferredProvider = getTrimmedEnv("WHATSAPP_SEND_PROVIDER") || (getTrimmedEnv("KAPSO_API_KEY") ? "kapso" : "meta")

  if (preferredProvider === "kapso") {
    const kapsoResult = await sendKapsoWhatsAppText(to, body)
    if (kapsoResult.ok || !kapsoResult.skipped) return kapsoResult
    return sendMetaWhatsAppText(to, body)
  }

  const metaResult = await sendMetaWhatsAppText(to, body)
  if (metaResult.ok || !metaResult.skipped) return metaResult
  return sendKapsoWhatsAppText(to, body)
}

export type { WhatsAppSendResult }
