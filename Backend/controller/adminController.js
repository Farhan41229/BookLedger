import { applyDeadStockPricing, clearExpiredDiscounts } from "../services/pricingService.js";
import { getAuditLogs } from "../services/auditService.js";

/**
 * Apply dead stock pricing
 * POST /pricing/apply-discount
 * Admin/Manager only
 */
export const applyDeadStockDiscount = async (req, res, next) => {
  try {
    const result = await applyDeadStockPricing(req.user._id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Clear expired discounts
 * POST /pricing/clear-discount
 * Admin/Manager only
 */
export const clearDiscounts = async (req, res, next) => {
  try {
    const result = await clearExpiredDiscounts(req.user._id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get audit logs
 * GET /audit
 * Admin only
 */
export const getAuditLogsHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const targetCollection = req.query.targetCollection;
    const action = req.query.action;

    const filters = {};
    if (targetCollection) filters.targetCollection = targetCollection;
    if (action) filters.action = action;

    const result = await getAuditLogs(filters, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
