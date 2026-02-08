import { Sale } from "../models/saleModel.js";
import { processCheckout, validateSaleData } from "../services/transactionService.js";
import { getEffectivePrice } from "../services/pricingService.js";
import { Book } from "../models/bookModel.js";

/**
 * Create a sale (Checkout)
 * POST /sales
 *
 * Request body:
 * {
 *   "cashierId": "user_id",
 *   "customerId": "customer_id_optional",
 *   "items": [
 *     {
 *       "bookId": "book_id",
 *       "quantity": 2,
 *       "unitPrice": 29.99
 *     }
 *   ],
 *   "totalAmount": 59.98
 * }
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
 * Get all sales (Manager/Admin only)
 * GET /sales
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
 * Get sale by ID
 * GET /sales/:id
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
 * Get sales by customer
 * GET /sales/customer/:customerId
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
 * Get sales report (Admin/Manager only)
 * GET /sales/reports/summary
 *
 * Query params:
 * - startDate: ISO date string
 * - endDate: ISO date string
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
 * Cancel a sale (Admin only)
 * DELETE /sales/:id
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
