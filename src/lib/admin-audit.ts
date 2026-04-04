import { AdminAudit } from "@/models/AdminAudit"
import { dbConnect } from "@/lib/db"

export async function recordAdminAudit(params: {
  adminId?: string | null
  actorType?: "admin" | "system" | "external"
  actorLabel?: string | null
  action: string
  targetType: string
  targetId: string
  metadata?: Record<string, unknown>
}) {
  await dbConnect()
  await AdminAudit.create({
    adminId: params.adminId ?? null,
    actorType: params.actorType ?? (params.adminId ? "admin" : "system"),
    actorLabel: params.actorLabel ?? null,
    action: params.action,
    targetType: params.targetType,
    targetId: params.targetId,
    metadata: params.metadata ?? {},
  })
}

export async function recordLatestMailboxObservation(params: {
  adminId: string
  mailbox: "self" | "shared"
  mailboxEmail: string
  latestMessageId: string
  latestSubject?: string | null
  latestFrom?: string | null
  count: number
  source: "real" | "db" | "demo"
}) {
  await dbConnect()
  const targetId = `${params.mailbox}:${params.mailboxEmail}:inbox`
  const latest = await AdminAudit.findOne({
    action: "OBSERVE_MAILBOX_INBOX",
    targetType: "mailbox",
    targetId,
  })
    .sort({ createdAt: -1 })
    .lean<{ metadata?: { latestMessageId?: string | null } } | null>()

  if (latest?.metadata?.latestMessageId === params.latestMessageId) {
    return false
  }

  await recordAdminAudit({
    adminId: params.adminId,
    action: "OBSERVE_MAILBOX_INBOX",
    targetType: "mailbox",
    targetId,
    metadata: {
      mailbox: params.mailbox,
      mailboxEmail: params.mailboxEmail,
      latestMessageId: params.latestMessageId,
      latestSubject: params.latestSubject ?? null,
      latestFrom: params.latestFrom ?? null,
      count: params.count,
      source: params.source,
    },
  })

  return true
}
