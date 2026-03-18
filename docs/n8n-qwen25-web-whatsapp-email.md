# n8n + Qwen2.5:3b

Workflow export:

- `n8n/clinvetia-qwen25-web-whatsapp-email.json`

Canales incluidos:

- `web`
- `whatsapp`
- `email`

Telegram no está incluido porque este repo todavía no tiene integración propia de Telegram.

## Variables necesarias

- `CLINVETIA_BASE_URL`
- `AI_INTEGRATION_API_KEY`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`

Valores recomendados:

```env
CLINVETIA_BASE_URL=http://localhost:3000
AI_INTEGRATION_API_KEY=tu_clave_larga
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=qwen2.5:3b
BREVO_SENDER_EMAIL=info@clinvetia.com
BREVO_SENDER_NAME=Clinvetia
```

## Entrada del webhook

Ruta del workflow:

- `POST /webhook/clinvetia-ai`

Payload para chat web:

```json
{
  "channel": "web",
  "message": "Cuantas citas confirmadas tengo hoy?",
  "history": [],
  "locale": "es"
}
```

Payload para WhatsApp:

```json
{
  "channel": "whatsapp",
  "message": "Quiero saber mis próximas citas",
  "phone": "34600111222",
  "history": [],
  "locale": "es"
}
```

Payload para email:

```json
{
  "channel": "email",
  "message": "Redacta una respuesta amable para confirmar la demo del jueves.",
  "to": "cliente@clinica.com",
  "customerName": "Laura",
  "subject": "Confirmación de demo",
  "locale": "es"
}
```

## Cómo encaja con Clinvetia

El workflow usa:

- `GET /api/ai/dashboard`
- `GET /api/ai/calendar`

Ambos endpoints requieren `AI_INTEGRATION_API_KEY`.

## Nota práctica

Para que el chat web use n8n de verdad, hay que cambiar el frontend o crear un proxy en Next.js para que en vez de llamar a `/api/chat/assistant` llame a este webhook de n8n.

Para WhatsApp, puedes:

- apuntar Meta directamente al webhook de n8n, o
- dejar Meta apuntando a Next.js y adaptar `src/app/api/whatsapp/webhook/route.ts` para reenviar a n8n

Para email, este workflow envía por Brevo directamente. No depende de la sesión de admin del dashboard.
