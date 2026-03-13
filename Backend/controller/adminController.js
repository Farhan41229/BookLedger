import { applyDeadStockPricing, clearExpiredDiscounts } from "../services/pricingService.js";
import { getAuditLogs } from "../services/auditService.js";

/**
 * Identifies dead stock books (not sold in 90+ days) and applies a 20% discount.
 * POST /pricing/apply-discount
 * 
 * @param {Object} req - The Express request object. Requires `req.user._id` for the audit log.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response detailing success, message, and the list of discounted books.
 * 
 * @example
 * // Access Control: Admin/Manager only
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
 * Clears expired or active dynamic discounts across all books.
 * POST /pricing/clear-discount
 * 
 * @param {Object} req - The Express request object. Requires `req.user._id` for the audit log.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response detailing success, message, and the list of cleared books.
 * 
 * @example
 * // Access Control: Admin/Manager only
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
 * Retrieves audit logs with optional filtering and pagination.
 * GET /audit
 * 
 * @param {Object} req - The Express request object containing query parameters.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with the success status, paginated audit logs, and pagination details.
 * 
 * @example
 * // Request: GET /audit?page=1&limit=50&action=Delete&targetCollection=Book
 * // Access Control: Admin only
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
