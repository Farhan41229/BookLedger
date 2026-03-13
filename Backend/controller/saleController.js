import { Sale } from "../models/saleModel.js";
import { processCheckout, validateSaleData } from "../services/transactionService.js";
import { getEffectivePrice } from "../services/pricingService.js";
import { Book } from "../models/bookModel.js";

/**
 * Processes a point-of-sale checkout, creating a sale transaction and atomically updating inventory and customer points.
 * POST /sales
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing checkout data.
 * @param {String} [req.body.cashierId] - ID of the cashier (defaults to `req.user._id` from auth token).
 * @param {String} [req.body.customerId] - Optional ID of the customer for loyalty points.
 * @param {Array<{bookId: String, quantity: Number, unitPrice: Number}>} req.body.items - Array of books sold.
 * @param {Number} req.body.totalAmount - The total cost of the transaction.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with status 201 containing the completed sale transaction details.
 */
export const createSale = async (req, res, next) => {
  try {
    const { cashierId, customerId, items, totalAmount } = req.body;

    // Validate sale data
    const validation = validateSaleData({
      cashierId: cashierId || req.user._id,
      customerId,
      items,
      totalAmount,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Process checkout with transaction
    const result = await processCheckout({
      cashierId: cashierId || req.user._id,
      customerId,
      items,
      totalAmount,
    });

    res.status(201).json(result);
  } catch (error) {
    // Handle specific errors
    if (error.message.includes("Insufficient stock")) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};

/**
 * Retrieves a paginated list of all sales transactions with populated references.
 * GET /sales
 * 
 * @param {Object} req - The Express request object containing pagination query params.
 * @param {String} [req.query.page=1] - The page number to retrieve.
 * @param {String} [req.query.limit=10] - Number of items per page.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with populated sales and pagination details.
 * 
 * @example
 * // Access Control: Manager/Admin only
 */
export const getAllSales = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sales = await Sale.find()
      .populate("cashierId", "name email")
      .populate("customerId", "name membershipPts")
      .populate("items.bookId", "title isbn")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Sale.countDocuments();

    res.status(200).json({
      success: true,
      sales,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves details for a specific sale transaction by its ID.
 * GET /sales/:id
 * 
 * @param {Object} req - The Express request object containing the sale ID.
 * @param {String} req.params.id - The unique MongoDB ObjectId of the sale.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with the populated sale details.
 */
export const getSaleById = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("cashierId", "name email")
      .populate("customerId", "name membershipPts")
      .populate("items.bookId", "title isbn author");

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      sale,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a paginated list of sales transactions for a specific customer.
 * GET /sales/customer/:customerId
 * 
 * @param {Object} req - The Express request object.
 * @param {String} req.params.customerId - The unique MongoDB ObjectId of the customer.
 * @param {String} [req.query.page=1] - The page number to retrieve.
 * @param {String} [req.query.limit=10] - Number of items per page.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with the customer's sales history.
 */
export const getSalesByCustomer = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sales = await Sale.find({ customerId: req.params.customerId })
      .populate("cashierId", "name email")
      .populate("items.bookId", "title isbn")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Sale.countDocuments({
      customerId: req.params.customerId,
    });

    res.status(200).json({
      success: true,
      sales,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generates an aggregated sales report summarizing revenue, transaction counts, and books sold over an optional date range.
 * GET /sales/reports/summary
 *
 * @param {Object} req - The Express request object containing date string query parameters.
 * @param {String} [req.query.startDate] - ISO date string for start of period.
 * @param {String} [req.query.endDate] - ISO date string for end of period.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with the calculated sales report.
 * 
 * @example
 * // Access Control: Manager/Admin only
 */
export const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(filter)
      .populate("items.bookId", "title");

    // Calculate totals
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalTransactions = sales.length;
    const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Books sold
    const booksSold = {};
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const bookTitle = item.bookId.title;
        booksSold[bookTitle] = (booksSold[bookTitle] || 0) + item.quantity;
      });
    });

    res.status(200).json({
      success: true,
      report: {
        period: {
          startDate,
          endDate,
        },
        summary: {
          totalRevenue,
          totalTransactions,
          avgTransactionValue: parseFloat(avgTransactionValue.toFixed(2)),
        },
        booksSold,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancels a completed sale, restoring the inventory stock quantities and updating the sale status.
 * DELETE /sales/:id
 * 
 * @param {Object} req - The Express request object containing the sale ID.
 * @param {String} req.params.id - The ID of the sale to cancel.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response confirming the cancellation.
 * 
 * @example
 * // Access Control: Admin only
 */
export const cancelSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    if (sale.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Sale is already cancelled",
      });
    }

    // Restore stock quantities
    for (const item of sale.items) {
      await Book.findByIdAndUpdate(
        item.bookId,
        { $inc: { stockQuantity: item.quantity } }
      );
    }

    // Mark sale as cancelled
    sale.status = "Cancelled";
    await sale.save();

    res.status(200).json({
      success: true,
      message: "Sale cancelled successfully",
      sale,
    });
  } catch (error) {
    next(error);
  }
};
