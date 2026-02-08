import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    targetCollection: {
      type: String,
      required: [true, "Target collection is required"],
    },
    action: {
      type: String,
      enum: {
        values: ["Insert", "Update", "Delete"],
        message: "Invalid action. Must be Insert, Update, or Delete",
      },
      required: [true, "Action is required"],
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    beforeValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    afterValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
