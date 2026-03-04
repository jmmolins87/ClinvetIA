import { Schema, model, models } from "mongoose"

const SessionSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    roi: {
      monthlyPatients: { type: Number, default: null },
      averageTicket: { type: Number, default: null },
      conversionLoss: { type: Number, default: null },
      roi: { type: Number, default: null },
    },
    chatSummary: { type: String, default: "" },
    chatHistory: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true, maxlength: 400 },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

export const Session = models.Session || model("Session", SessionSchema)
