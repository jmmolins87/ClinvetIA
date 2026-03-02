import { ImapFlow } from "imapflow"
import { simpleParser } from "mailparser"
import nodemailer from "nodemailer"

type MailboxMode = "self" | "shared"
type MailFolder = "inbox" | "sent" | "trash"
type MailStatus = "all" | "received" | "sent" | "failed"
type MailErrorFilter = "all" | "yes" | "no"

type RealMailboxConfig = {
  email: string
  imapHost: string
  imapPort: number
  imapSecure: boolean
  imapUser: string
  imapPass: string
  smtpHost?: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser?: string
  smtpPass?: string
}

type ListRealMailParams = {
  mailbox: MailboxMode
  mailboxEmail: string
  adminEmail: string
  folder: MailFolder
  includeBody?: boolean
  q?: string
  status: MailStatus
  hasError: MailErrorFilter
  to?: string
  fromDate?: string
  toDate?: string
  page: number
  pageSize: number
}

type MoveRealMailParams = {
  mailbox: MailboxMode
  mailboxEmail: string
  adminEmail: string
  sourceFolder: MailFolder
  targetFolder: MailFolder
  ids: string[]
}

type SendRealMailParams = {
  mailbox: MailboxMode
  mailboxEmail: string
  adminEmail: string
  adminName: string
  to: string
  subject: string
  text: string
  html: string
}

function buildRawMimeMessage(params: {
  fromEmail: string
  fromName: string
  toEmail: string
  subject: string
  text: string
}) {
  const messageId = `<${crypto.randomUUID()}@${params.fromEmail.split("@")[1] || "clinvetia.local"}>`
  const safeText = params.text.replace(/\r?\n/g, "\r\n")
  const encodedSubject = params.subject.replace(/\r?\n/g, " ").trim()
  const encodedFromName = params.fromName.replace(/"/g, '\\"').trim()

  return [
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: ${messageId}`,
    `From: "${encodedFromName}" <${params.fromEmail}>`,
    `To: <${params.toEmail}>`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    safeText,
    "",
  ].join("\r\n")
}

function parseBool(value: string | undefined, fallback: boolean) {
  if (!value) return fallback
  return value === "1" || value.toLowerCase() === "true"
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function isPlaceholderSecret(value: string | undefined) {
  if (!value) return true
  const trimmed = value.trim()
  if (!trimmed) return true
  return /CHANGE_ME|YOUR_|PLACEHOLDER/i.test(trimmed)
}

function getFolderName(folder: MailFolder) {
  if (folder === "inbox") return process.env.MAIL_IMAP_FOLDER_INBOX || "INBOX"
  if (folder === "sent") return process.env.MAIL_IMAP_FOLDER_SENT || "Sent"
  return process.env.MAIL_IMAP_FOLDER_TRASH || "Trash"
}

function resolveMailboxConfig(params: {
  mailbox: MailboxMode
  mailboxEmail: string
  adminEmail: string
}): RealMailboxConfig | null {
  const adminEmail = normalize(params.adminEmail)
  const sharedEmail = normalize(process.env.ADMIN_SHARED_MAILBOX || "info@clinvetia.com")
  const isShared = params.mailbox === "shared" || normalize(params.mailboxEmail) === sharedEmail

  const email = isShared ? sharedEmail : normalize(params.mailboxEmail || adminEmail)

  const prefix = isShared ? "MAIL_SHARED" : "MAIL_SELF"

  const imapHost = process.env[`${prefix}_IMAP_HOST`] || process.env.MAIL_IMAP_HOST
  const imapPort = Number(process.env[`${prefix}_IMAP_PORT`] || process.env.MAIL_IMAP_PORT || 993)
  const imapSecure = parseBool(process.env[`${prefix}_IMAP_SECURE`] || process.env.MAIL_IMAP_SECURE, true)
  const imapUser = process.env[`${prefix}_IMAP_USER`] || (isShared ? process.env.MAIL_IMAP_USER : email)
  const imapPass = process.env[`${prefix}_IMAP_PASS`] || process.env.MAIL_IMAP_PASS

  const smtpHost = process.env[`${prefix}_SMTP_HOST`] || process.env.MAIL_SMTP_HOST
  const smtpPort = Number(process.env[`${prefix}_SMTP_PORT`] || process.env.MAIL_SMTP_PORT || 465)
  const smtpSecure = parseBool(process.env[`${prefix}_SMTP_SECURE`] || process.env.MAIL_SMTP_SECURE, true)
  const smtpUser = process.env[`${prefix}_SMTP_USER`] || (isShared ? process.env.MAIL_SMTP_USER : email)
  const smtpPass = process.env[`${prefix}_SMTP_PASS`] || process.env.MAIL_SMTP_PASS

  if (!imapHost || !imapUser || isPlaceholderSecret(imapPass)) return null

  return {
    email,
    imapHost,
    imapPort,
    imapSecure,
    imapUser,
    imapPass: imapPass!,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpUser,
    smtpPass,
  }
}

function makeImapClient(config: RealMailboxConfig) {
  return new ImapFlow({
    logger: false,
    logRaw: false,
    host: config.imapHost,
    port: config.imapPort,
    secure: config.imapSecure,
    auth: { user: config.imapUser, pass: config.imapPass },
  })
}

function textFromValue(value: unknown): string {
  if (typeof value === "string") return value
  if (value && typeof value === "object" && "toString" in value) return String(value)
  return ""
}

function bufferFromSource(source: unknown): Buffer {
  if (Buffer.isBuffer(source)) return source
  if (source instanceof Uint8Array) return Buffer.from(source)
  if (typeof source === "string") return Buffer.from(source, "utf8")
  if (source && typeof source === "object" && "buffer" in source) {
    const maybeBuffer = (source as { buffer?: ArrayBuffer }).buffer
    if (maybeBuffer) return Buffer.from(maybeBuffer)
  }
  return Buffer.from(textFromValue(source), "utf8")
}

function decodeQuotedPrintable(value: string) {
  const softBreaksRemoved = value.replace(/=\r?\n/g, "")
  const percentEncoded = softBreaksRemoved.replace(/=([A-Fa-f0-9]{2})/g, "%$1")
  try {
    return decodeURIComponent(percentEncoded)
  } catch {
    return softBreaksRemoved
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([A-Fa-f0-9]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
}

function stripHtml(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|header|footer|li|ul|ol|tr|table|h1|h2|h3|h4|h5|h6|blockquote)>/gi, "\n")
    .replace(/<\/(td|th)>/gi, "  ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\[https?:\/\/[^\]\s]+\]/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])([A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ])/g, "$1 $2")
    .replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g, "$1 $2")
    .trim()
}

function normalizeMimeArtifacts(value: string) {
  const withoutBoundaries = value
    .replace(/^--[A-Za-z0-9'()+_,\-./:=? ]+$/gm, "")
    .replace(/^Content-Type:.*$/gim, "")
    .replace(/^Content-Transfer-Encoding:.*$/gim, "")
    .replace(/^MIME-Version:.*$/gim, "")
    .replace(/^Content-Disposition:.*$/gim, "")
  return decodeQuotedPrintable(withoutBoundaries)
}

async function decodeBodyFromSource(source: unknown) {
  try {
    const rawBuffer = bufferFromSource(source)
    const parsed = await simpleParser(rawBuffer, { skipHtmlToText: false })

    if (typeof parsed.html === "string" && parsed.html.trim()) {
      const htmlText = stripHtml(decodeHtmlEntities(parsed.html))
      if (htmlText) return normalizeMimeArtifacts(htmlText)
    }

    const text = decodeHtmlEntities((parsed.text || "").trim())
    if (text) return normalizeMimeArtifacts(text)

    if (typeof parsed.html === "string" && parsed.html.trim()) {
      return stripHtml(parsed.html)
    }
  } catch {
    // fallback below
  }

  const raw = normalizeMimeArtifacts(bufferFromSource(source).toString("utf8"))
  const body = raw.split(/\r?\n\r?\n/).slice(1).join("\n\n").trim()
  if (!body) return ""
  return stripHtml(body)
}

function matchesRange(date: Date, fromDate?: string, toDate?: string) {
  if (fromDate) {
    const from = new Date(fromDate)
    from.setHours(0, 0, 0, 0)
    if (date < from) return false
  }
  if (toDate) {
    const to = new Date(toDate)
    to.setHours(23, 59, 59, 999)
    if (date > to) return false
  }
  return true
}

function parseImapId(id: string) {
  if (!id.startsWith("imap:")) return null
  const uid = Number(id.slice(5))
  if (!Number.isFinite(uid) || uid <= 0) return null
  return uid
}

export function canUseRealMailbox(params: { mailbox: MailboxMode; mailboxEmail: string; adminEmail: string }) {
  return Boolean(resolveMailboxConfig(params))
}

export async function listRealMailboxMessages(params: ListRealMailParams) {
  const config = resolveMailboxConfig({
    mailbox: params.mailbox,
    mailboxEmail: params.mailboxEmail,
    adminEmail: params.adminEmail,
  })
  if (!config) throw new Error("MAILBOX_REAL_NOT_CONFIGURED")

  if (params.hasError === "yes") {
    return { messages: [], total: 0 }
  }
  if (params.status === "failed") {
    return { messages: [], total: 0 }
  }
  if (params.folder === "inbox" && params.status === "sent") {
    return { messages: [], total: 0 }
  }
  if (params.folder !== "inbox" && params.status === "received") {
    return { messages: [], total: 0 }
  }

  const folderName = getFolderName(params.folder)
  const client = makeImapClient(config)

  try {
    await client.connect()
    const lock = await client.getMailboxLock(folderName)

    try {
      const includeBody = Boolean(params.includeBody || params.q?.trim())
      const searchResult = await client.search({ all: true })
      const sorted = [...(Array.isArray(searchResult) ? searchResult : [])].sort((a, b) => b - a)
      const q = params.q?.trim().toLowerCase() || ""
      const toNeedle = params.to?.trim().toLowerCase() || ""

      const items: Array<{
        id: string
        mailboxType: "shared" | "user"
        mailboxEmail: string
        folder: MailFolder
        direction: "inbound" | "outbound"
        status: "received" | "sent"
        from: { email: string; name?: string | null }
        to: Array<{ email: string; name?: string | null }>
        subject: string
        body: string
        preview: string
        createdAt: Date
        updatedAt: Date
        error: null
      }> = []

      for await (const message of client.fetch(sorted, {
        uid: true,
        envelope: true,
        internalDate: true,
        ...(includeBody ? { source: true } : {}),
      })) {
        const createdAt = message.internalDate ? new Date(message.internalDate) : new Date()
        if (!matchesRange(createdAt, params.fromDate, params.toDate)) continue

        const envelope = message.envelope
        const fromFirst = envelope?.from?.[0]
        const toList = envelope?.to || []
        const subject = envelope?.subject || "(Sin asunto)"
        const fromEmail = fromFirst?.address || ""
        const fromName = fromFirst?.name || null
        const to = toList
          .map((recipient) => ({
            email: recipient.address || "",
            name: recipient.name || null,
          }))
          .filter((recipient) => recipient.email)

        if (toNeedle && !to.some((recipient) => recipient.email.toLowerCase().includes(toNeedle))) continue

        const body = includeBody && "source" in message ? await decodeBodyFromSource(message.source) : ""
        const preview = (body || subject).slice(0, 180)
        const haystack = `${subject} ${preview} ${body} ${fromEmail} ${to.map((recipient) => recipient.email).join(" ")}`.toLowerCase()
        if (q && !haystack.includes(q)) continue

        items.push({
          id: `imap:${message.uid}`,
          mailboxType: params.mailbox === "shared" ? "shared" : "user",
          mailboxEmail: params.mailboxEmail,
          folder: params.folder,
          direction: params.folder === "inbox" ? "inbound" : "outbound",
          status: params.folder === "inbox" ? "received" : "sent",
          from: { email: fromEmail, name: fromName },
          to,
          subject,
          body,
          preview,
          createdAt,
          updatedAt: createdAt,
          error: null,
        })
      }

      const total = items.length
      const start = (params.page - 1) * params.pageSize
      const messages = items.slice(start, start + params.pageSize)
      return { messages, total }
    } finally {
      lock.release()
    }
  } finally {
    await client.logout().catch(() => undefined)
  }
}

export async function moveRealMailboxMessages(params: MoveRealMailParams) {
  const config = resolveMailboxConfig({
    mailbox: params.mailbox,
    mailboxEmail: params.mailboxEmail,
    adminEmail: params.adminEmail,
  })
  if (!config) throw new Error("MAILBOX_REAL_NOT_CONFIGURED")

  const folderName = getFolderName(params.sourceFolder)
  const targetName = getFolderName(params.targetFolder)
  const uids = params.ids.map(parseImapId).filter((uid): uid is number => Boolean(uid))
  if (uids.length === 0) return

  const client = makeImapClient(config)
  try {
    await client.connect()
    const lock = await client.getMailboxLock(folderName)
    try {
      await client.messageMove(uids, targetName)
    } finally {
      lock.release()
    }
  } finally {
    await client.logout().catch(() => undefined)
  }
}

export async function sendRealMailboxEmail(params: SendRealMailParams) {
  const config = resolveMailboxConfig({
    mailbox: params.mailbox,
    mailboxEmail: params.mailboxEmail,
    adminEmail: params.adminEmail,
  })
  if (!config) return { ok: false, error: "MAILBOX_REAL_NOT_CONFIGURED" }
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    return { ok: false, error: "MAILBOX_REAL_SMTP_NOT_CONFIGURED" }
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })

  try {
    await transporter.sendMail({
      from: `"${params.adminName}" <${config.email}>`,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      replyTo: config.email,
    })

    const sentFolder = getFolderName("sent")
    const imap = makeImapClient(config)
    try {
      await imap.connect()
      const raw = buildRawMimeMessage({
        fromEmail: config.email,
        fromName: params.adminName,
        toEmail: params.to,
        subject: params.subject,
        text: params.text,
      })
      await imap.append(sentFolder, raw, ["\\Seen"])
    } finally {
      await imap.logout().catch(() => undefined)
    }

    return { ok: true as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP_SEND_FAILED"
    return { ok: false as const, error: message }
  }
}
