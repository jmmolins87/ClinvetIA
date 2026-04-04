import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { AdminAudit } from "@/models/AdminAudit"
import { dbConnect } from "@/lib/db"
import { DEMO_AUDIT_EVENTS } from "@/lib/admin-demo-data"

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (auth.data.admin.role === "demo") {
    return NextResponse.json({ audit: DEMO_AUDIT_EVENTS })
  }

  await dbConnect()
  const items = await AdminAudit.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()

  return NextResponse.json({
    audit: items.map((item) => ({
      id: String(item._id),
      adminId: item.adminId ? String(item.adminId) : null,
      actorType: item.actorType || (item.adminId ? "admin" : "system"),
      actorLabel: item.actorLabel || null,
      action: item.action,
      targetType: item.targetType,
      targetId: item.targetId,
      metadata: item.metadata,
      createdAt: item.createdAt.toISOString(),
    })),
  })
}
