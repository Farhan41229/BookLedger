import { AuditLog } from "../models/auditLogModel.js";

/**
 * Create an audit log entry
 * @param {String} targetCollection - Collection being modified
 * @param {String} action - Action type (Insert, Update, Delete)
 * @param {String} performedBy - User ID performing the action
 * @param {Object} beforeValue - Value before change (for Update/Delete)
 * @param {Object} afterValue - Value after change (for Insert/Update)
 * @param {String} targetId - ID of modified document
 */
export const createAuditLog = async (
  targetCollection,
  action,
  performedBy,
  beforeValue = null,
  afterValue = null,
  targetId = null
) => {
  try {
    await AuditLog.create({
      targetCollection,
      action,
      performedBy,
      beforeValue,
      afterValue,
      targetId,
    });
  } catch (error) {
    console.error("Error creating audit log:", error.message);
    // Don't throw - audit logging failure shouldn't block operations
  }
};

/**
 * Get audit logs with filtering
 * @param {Object} filters - Filter criteria
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 */
export const getAuditLogs = async (filters = {}, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;

  const logs = await AuditLog.find(filters)
    .populate("performedBy", "name email role")
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const total = await AuditLog.countDocuments(filters);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};
