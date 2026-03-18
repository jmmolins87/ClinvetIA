type AgentAuthSuccess = {
  ok: true
}

type AgentAuthFailure = {
  ok: false
  status: 401 | 500
  error: string
}

function getBearerToken(req: Request) {
  const authorization = req.headers.get("authorization")?.trim()
  if (!authorization) return null

  const [scheme, token] = authorization.split(/\s+/, 2)
  if (!scheme || !token) return null
  if (scheme.toLowerCase() !== "bearer") return null
  return token.trim() || null
}

function getRequestApiKey(req: Request) {
  return req.headers.get("x-api-key")?.trim() || getBearerToken(req)
}

export function getAgentApiKey() {
  const apiKey = process.env.AI_INTEGRATION_API_KEY?.trim()
  return apiKey || null
}

export function authenticateAgentRequest(req: Request): AgentAuthSuccess | AgentAuthFailure {
  const configuredApiKey = getAgentApiKey()
  if (!configuredApiKey) {
    return {
      ok: false,
      status: 500,
      error: "AI integration API key is not configured",
    }
  }

  const requestApiKey = getRequestApiKey(req)
  if (!requestApiKey || requestApiKey !== configuredApiKey) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized",
    }
  }

  return { ok: true }
}
