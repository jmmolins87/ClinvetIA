import { Schema, model, models } from "mongoose"

const AdminAuditSchema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    actorType: { type: String, enum: ["admin", "system", "external"], default: "admin" },
    actorLabel: { type: String, default: null },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
)

export const AdminAudit = models.AdminAudit || model("AdminAudit", AdminAuditSchema)
