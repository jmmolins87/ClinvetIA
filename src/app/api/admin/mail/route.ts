import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin-auth"
import { isSuperAdmin } from "@/lib/admin-auth"
import { dbConnect } from "@/lib/db"
import { AdminMailboxMessage } from "@/models/AdminMailboxMessage"
import { canUseSharedMailbox, getSharedMailboxEmail, SHARED_MAILBOX_DEFAULT } from "@/lib/admin-mailbox"
import { listDemoMailMessages, moveDemoMailMessages } from "@/lib/admin-demo-mail-state"
import { canUseRealMailbox, listRealMailboxMessages, moveRealMailboxMessages } from "@/lib/real-mailbox"

const querySchema = z.object({
  mailbox: z.enum(["self", "shared"]).default("self"),
  folder: z.enum(["inbox", "sent", "trash"]).default("inbox"),
  conversationWith: z.string().optional(),
  q: z.string().optional(),
  status: z.enum(["all", "received", "sent", "failed"]).default("all"),
  hasError: z.enum(["all", "yes", "no"]).default("all"),
  to: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
})

function normalizeEmail(value: string | undefined | null) {
  return (value || "").trim().toLowerCase()
}

function matchesConversationParticipant(
  message: {
    from: { readonly email: string }
    to: ReadonlyArray<{ readonly email: string }>
  },
  participantEmail: string,
  mailboxEmail: string
) {
  const participant = normalizeEmail(participantEmail)
  const mailbox = normalizeEmail(mailboxEmail)
  const fromEmail = normalizeEmail(message.from?.email)
  const toEmails = (message.to || []).map((item) => normalizeEmail(item.email))

  const isInbound = fromEmail === participant && toEmails.includes(mailbox)
  const isOutbound = fromEmail === mailbox && toEmails.includes(participant)
  return isInbound || isOutbound
}

const moveSchema = z.object({
  action: z.literal("move"),
  ids: z.array(z.string().min(1)).min(1).max(100),
  mailbox: z.enum(["self", "shared"]).optional(),
  sourceFolder: z.enum(["inbox", "sent", "trash"]).optional(),
  folder: z.enum(["inbox", "sent", "trash"]),
})

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const parsed = querySchema.parse({
    mailbox: searchParams.get("mailbox") || "self",
    folder: searchParams.get("folder") || "inbox",
    conversationWith: searchParams.get("conversationWith") || undefined,
    q: searchParams.get("q") || undefined,
    status: searchParams.get("status") || "all",
    hasError: searchParams.get("hasError") || "all",
    to: searchParams.get("to") || undefined,
    fromDate: searchParams.get("fromDate") || undefined,
    toDate: searchParams.get("toDate") || undefined,
    page: searchParams.get("page") || 1,
    pageSize: searchParams.get("pageSize") || 25,
  })
  const isActorSuperAdmin = isSuperAdmin(auth.data.admin.role)
  const effectiveMailbox = isActorSuperAdmin ? "shared" : parsed.mailbox

  const canAccessShared = canUseSharedMailbox(auth.data.admin.role)
  if (effectiveMailbox === "shared" && !canAccessShared) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (auth.data.admin.role === "demo") {
    const demoSelf = auth.data.admin.email.trim().toLowerCase()
    const demoMailboxEmail = effectiveMailbox === "shared" ? getSharedMailboxEmail() : demoSelf
    const q = parsed.q?.trim().toLowerCase() || ""
    const toNeedle = parsed.to?.trim().toLowerCase() || ""
    const fromDate = parsed.fromDate ? new Date(parsed.fromDate) : null
    const toDate = parsed.toDate ? new Date(parsed.toDate) : null
    if (fromDate && !Number.isNaN(fromDate.getTime())) fromDate.setHours(0, 0, 0, 0)
    if (toDate && !Number.isNaN(toDate.getTime())) toDate.setHours(23, 59, 59, 999)

    const demoSource = parsed.conversationWith
      ? ([
        ...listDemoMailMessages({ demoUserEmail: demoSelf, mailboxEmail: demoMailboxEmail, folder: "inbox" }),
        ...listDemoMailMessages({ demoUserEmail: demoSelf, mailboxEmail: demoMailboxEmail, folder: "sent" }),
      ])
      : listDemoMailMessages({
        demoUserEmail: demoSelf,
        mailboxEmail: demoMailboxEmail,
        folder: parsed.folder,
      })

    const filtered = demoSource
      .filter((item) =>
        parsed.conversationWith
          ? matchesConversationParticipant(item, parsed.conversationWith, demoMailboxEmail)
          : true
      )
      .filter((item) => (parsed.status === "all" ? true : item.status === parsed.status))
      .filter((item) => {
        if (parsed.hasError === "yes") return Boolean(item.error)
        if (parsed.hasError === "no") return !item.error
        return true
      })
      .filter((item) => (toNeedle ? item.to.some((recipient) => recipient.email.toLowerCase().includes(toNeedle)) : true))
      .filter((item) => {
        if (!q) return true
        const haystack = `${item.subject} ${item.body} ${item.preview} ${item.from.email} ${item.to.map((t) => t.email).join(" ")}`
        return haystack.toLowerCase().includes(q)
      })
      .filter((item) => {
        const createdAt = new Date(item.createdAt)
        if (fromDate && !Number.isNaN(fromDate.getTime()) && createdAt < fromDate) return false
        if (toDate && !Number.isNaN(toDate.getTime()) && createdAt > toDate) return false
        return true
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

    const total = filtered.length
    const skip = (parsed.page - 1) * parsed.pageSize
    const messages = filtered.slice(skip, skip + parsed.pageSize)

    return NextResponse.json({
      messages,
      pagination: {
        page: parsed.page,
        pageSize: parsed.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsed.pageSize)),
      },
      mailboxes: {
        self: demoSelf,
        shared: canAccessShared ? getSharedMailboxEmail() : null,
      },
      capabilities: {
        canAccessShared,
      },
      adminRole: auth.data.admin.role,
      isSuperAdmin: isSuperAdmin(auth.data.admin.role),
      isDemo: true,
    })
  }

  const ownMailbox = auth.data.admin.email.trim().toLowerCase()
  const sharedMailbox = getSharedMailboxEmail()
  const sharedMailboxAliases = Array.from(new Set([sharedMailbox, SHARED_MAILBOX_DEFAULT]))
  const selectedMailboxEmail = effectiveMailbox === "shared" ? sharedMailbox : ownMailbox

  if (canUseRealMailbox({ mailbox: effectiveMailbox, mailboxEmail: selectedMailboxEmail, adminEmail: ownMailbox })) {
    try {
      let messages: Awaited<ReturnType<typeof listRealMailboxMessages>>["messages"] = []
      let total = 0

      if (parsed.conversationWith) {
        const conversationWith = parsed.conversationWith
        const [inboxData, sentData] = await Promise.all([
          listRealMailboxMessages({
            mailbox: effectiveMailbox,
            mailboxEmail: selectedMailboxEmail,
            adminEmail: ownMailbox,
            folder: "inbox",
            includeBody: true,
            status: "all",
            hasError: "all",
            page: 1,
            pageSize: 200,
          }),
          listRealMailboxMessages({
            mailbox: effectiveMailbox,
            mailboxEmail: selectedMailboxEmail,
            adminEmail: ownMailbox,
            folder: "sent",
            includeBody: true,
            status: "all",
            hasError: "all",
            page: 1,
            pageSize: 200,
          }),
        ])

        const merged = [...inboxData.messages, ...sentData.messages]
          .filter((item) => matchesConversationParticipant(item, conversationWith, selectedMailboxEmail))
          .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))

        total = merged.length
        const skip = (parsed.page - 1) * parsed.pageSize
        messages = merged.slice(skip, skip + parsed.pageSize)
      } else {
        const listData = await listRealMailboxMessages({
          mailbox: effectiveMailbox,
          mailboxEmail: selectedMailboxEmail,
          adminEmail: ownMailbox,
          folder: parsed.folder,
          includeBody: Boolean(parsed.q?.trim()),
          q: parsed.q,
          status: parsed.status,
          hasError: parsed.hasError,
          to: parsed.to,
          fromDate: parsed.fromDate,
          toDate: parsed.toDate,
          page: parsed.page,
          pageSize: parsed.pageSize,
        })
        messages = listData.messages
        total = listData.total
      }

      return NextResponse.json({
        messages,
        pagination: {
          page: parsed.page,
          pageSize: parsed.pageSize,
          total,
          totalPages: Math.max(1, Math.ceil(total / parsed.pageSize)),
        },
        mailboxes: {
          self: ownMailbox,
          shared: canAccessShared ? sharedMailbox : null,
        },
        capabilities: {
          canAccessShared,
        },
        adminRole: auth.data.admin.role,
        isSuperAdmin: isSuperAdmin(auth.data.admin.role),
        isDemo: false,
      })
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "MAILBOX_REAL_FETCH_FAILED" },
        { status: 502 }
      )
    }
  }

  await dbConnect()

  const filter: Record<string, unknown> = {
    mailboxEmail:
      effectiveMailbox === "shared"
        ? { $in: sharedMailboxAliases }
        : ownMailbox,
    ...(parsed.conversationWith
      ? { folder: { $in: ["inbox", "sent"] } }
      : { folder: parsed.folder }),
  }

  const q = parsed.q?.trim()
  if (q && !parsed.conversationWith) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    filter.$or = [
      { subject: regex },
      { body: regex },
      { preview: regex },
      { "from.email": regex },
      { "from.name": regex },
      { "to.email": regex },
      { "to.name": regex },
    ]
  }

  if (parsed.status !== "all" && !parsed.conversationWith) {
    filter.status = parsed.status
  }
  if (parsed.hasError === "yes" && !parsed.conversationWith) {
    filter.error = { $ne: null }
  } else if (parsed.hasError === "no" && !parsed.conversationWith) {
    filter.error = null
  }
  const toFilter = parsed.to?.trim()
  if (toFilter && !parsed.conversationWith) {
    const regex = new RegExp(toFilter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    filter["to.email"] = regex
  }
  const createdAtFilter: Record<string, Date> = {}
  const fromDate = parsed.fromDate ? new Date(parsed.fromDate) : null
  const toDate = parsed.toDate ? new Date(parsed.toDate) : null
  if (fromDate && !Number.isNaN(fromDate.getTime())) {
    fromDate.setHours(0, 0, 0, 0)
    createdAtFilter.$gte = fromDate
  }
  if (toDate && !Number.isNaN(toDate.getTime())) {
    toDate.setHours(23, 59, 59, 999)
    createdAtFilter.$lte = toDate
  }
  if (Object.keys(createdAtFilter).length > 0 && !parsed.conversationWith) {
    filter.createdAt = createdAtFilter
  }

  if (parsed.conversationWith) {
    const participantRegex = new RegExp(
      normalizeEmail(parsed.conversationWith).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    )
    filter.$or = [
      { "from.email": participantRegex },
      { "to.email": participantRegex },
    ]
  }

  const skip = (parsed.page - 1) * parsed.pageSize
  const [messages, total] = await Promise.all([
    AdminMailboxMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsed.pageSize).lean(),
    AdminMailboxMessage.countDocuments(filter),
  ])

  return NextResponse.json({
    messages: messages.map((message) => ({
      id: String(message._id),
      mailboxType: message.mailboxType,
      mailboxEmail: message.mailboxEmail,
      folder: message.folder,
      direction: message.direction,
      status: message.status,
      from: message.from,
      to: message.to ?? [],
      subject: message.subject,
      body: message.body,
      preview: message.preview,
      relatedType: message.relatedType ?? null,
      relatedId: message.relatedId ?? null,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      error: message.error ?? null,
      createdBy: message.createdBy ?? null,
    })),
    pagination: {
      page: parsed.page,
      pageSize: parsed.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / parsed.pageSize)),
    },
    mailboxes: {
      self: ownMailbox,
      shared: canAccessShared ? sharedMailbox : null,
    },
    capabilities: {
      canAccessShared,
    },
    adminRole: auth.data.admin.role,
    isSuperAdmin: isSuperAdmin(auth.data.admin.role),
    isDemo: false,
  })
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = moveSchema.parse(body)
    const isActorSuperAdmin = isSuperAdmin(auth.data.admin.role)
    if (auth.data.admin.role === "demo") {
      const demoSelf = auth.data.admin.email.trim().toLowerCase()
      moveDemoMailMessages({
        ids: parsed.ids,
        folder: parsed.folder,
        demoUserEmail: demoSelf,
      })
      return NextResponse.json({ ok: true, demo: true })
    }
    const canAccessShared = canUseSharedMailbox(auth.data.admin.role)
    const ownMailbox = auth.data.admin.email.trim().toLowerCase()
    const sharedMailbox = getSharedMailboxEmail()
    const sourceFolder = parsed.sourceFolder || "inbox"
    const mailboxMode = isActorSuperAdmin ? "shared" : (parsed.mailbox || "self")
    if (mailboxMode === "shared" && !canAccessShared) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const mailboxEmail = mailboxMode === "shared" ? sharedMailbox : ownMailbox
    const hasImapIds = parsed.ids.some((id) => id.startsWith("imap:"))
    if (hasImapIds) {
      if (!canUseRealMailbox({ mailbox: mailboxMode, mailboxEmail, adminEmail: ownMailbox })) {
        return NextResponse.json({ error: "MAILBOX_REAL_NOT_CONFIGURED" }, { status: 400 })
      }
      await moveRealMailboxMessages({
        mailbox: mailboxMode,
        mailboxEmail,
        adminEmail: ownMailbox,
        sourceFolder,
        targetFolder: parsed.folder,
        ids: parsed.ids,
      })
      return NextResponse.json({ ok: true, provider: "real" })
    }

    const sharedMailboxAliases = new Set([sharedMailbox, SHARED_MAILBOX_DEFAULT])

    await dbConnect()
    const messages = await AdminMailboxMessage.find({ _id: { $in: parsed.ids } })
      .select("_id mailboxEmail")
      .lean()

    const forbidden = messages.find((message) => {
      const mailboxEmail = String(message.mailboxEmail || "").toLowerCase()
      if (mailboxEmail === ownMailbox) return false
      if (sharedMailboxAliases.has(mailboxEmail) && canAccessShared) return false
      return true
    })
    if (forbidden) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const sharedAliases = new Set([sharedMailbox, SHARED_MAILBOX_DEFAULT])
    const allShared = messages.length > 0 && messages.every((message) => sharedAliases.has(String(message.mailboxEmail || "").toLowerCase()))
    const allOwn = messages.length > 0 && messages.every((message) => String(message.mailboxEmail || "").toLowerCase() === ownMailbox)
    const messageMailboxMode = allShared ? "shared" : "self"
    const messageMailboxEmail = allShared ? sharedMailbox : ownMailbox

    if ((allShared || allOwn) && canUseRealMailbox({ mailbox: messageMailboxMode, mailboxEmail: messageMailboxEmail, adminEmail: ownMailbox })) {
      try {
        await moveRealMailboxMessages({
          mailbox: messageMailboxMode,
          mailboxEmail: messageMailboxEmail,
          adminEmail: ownMailbox,
          sourceFolder,
          targetFolder: parsed.folder,
          ids: parsed.ids,
        })
        return NextResponse.json({ ok: true, provider: "real" })
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "MAILBOX_REAL_MOVE_FAILED" },
          { status: 502 }
        )
      }
    }

    await AdminMailboxMessage.updateMany(
      { _id: { $in: parsed.ids } },
      { $set: { folder: parsed.folder } }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: error.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
