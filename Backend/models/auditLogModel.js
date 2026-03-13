import mongoose from "mongoose";

/**
 * @typedef {Object} AuditLog
 * @property {String} targetCollection - The name of the collection being modified (e.g., 'Book', 'Sale').
 * @property {String} action - The type of operation performed ('Insert', 'Update', 'Delete').
 * @property {mongoose.Schema.Types.ObjectId} performedBy - ID of the User who performed the action.
 * @property {mongoose.Schema.Types.Mixed} [beforeValue] - The document state before the action.
 * @property {mongoose.Schema.Types.Mixed} [afterValue] - The document state after the action.
 * @property {mongoose.Schema.Types.ObjectId} [targetId] - ID of the document being modified.
 */

/**
 * Schema representing an audit log entry to track system mutations for compliance and history.
 * @type {mongoose.Schema<AuditLog>}
 */
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
