import { Sale } from "../models/saleModel.js";
import { processCheckout, validateSaleData } from "../services/transactionService.js";
import { getEffectivePrice } from "../services/pricingService.js";
import { Book } from "../models/bookModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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
 * Get my online orders (Customer only)
 * GET /sales/my-orders
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sales = await Sale.find({ cashierId: req.user._id })
      .populate("items.bookId", "title isbn coverImage author price")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Sale.countDocuments({
      cashierId: req.user._id,
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
        if (!item.bookId) return; // book was deleted, skip gracefully
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

/**
 * Create a Stripe Checkout Session
 * POST /sales/create-checkout-session
 */
export const createStripeSession = async (req, res, next) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title || 'Book', // using title if passed
        },
        unit_amount: Math.round(item.unitPrice * 100), // convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?canceled=true`,
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    next(error);
  }
};
