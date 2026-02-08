import mongoose from "mongoose";
import { Sale } from "../models/saleModel.js";
import { Book } from "../models/bookModel.js";
import { Customer } from "../models/customerModel.js";
import { createAuditLog } from "./auditService.js";

/**
 * Execute a transactional sale/checkout
 * This ensures data integrity using MongoDB transactions
 *
 * @param {Object} saleData - Sale details
 * @param {String} saleData.cashierId - Cashier user ID
 * @param {String} saleData.customerId - Customer ID (optional)
 * @param {Array} saleData.items - Sale items array
 *   - bookId: Book ID
 *   - quantity: Quantity to sell
 *   - unitPrice: Price per unit (at time of sale)
 * @param {Number} saleData.totalAmount - Total sale amount
 * @returns {Promise<Object>} Created sale document
 * @throws {Error} If validation fails, stock unavailable, or transaction fails
 */
export const processCheckout = async (saleData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { cashierId, customerId = null, items, totalAmount } = saleData;

    // Validation
    if (!items || items.length === 0) {
      throw new Error("Sale must contain at least one item");
    }

    if (totalAmount < 0) {
      throw new Error("Total amount cannot be negative");
    }

    // Verify all books exist and check stock availability
    const bookStockCheck = [];
    for (const item of items) {
      const book = await Book.findById(item.bookId).session(session);

      if (!book) {
        throw new Error(`Book with ID ${item.bookId} not found`);
      }

      if (book.stockQuantity < item.quantity) {
        throw new Error(
          `Insufficient stock for book "${book.title}". Available: ${book.stockQuantity}, Requested: ${item.quantity}`,
          { statusCode: 409 }
        );
      }

      bookStockCheck.push({
        bookId: book._id,
        title: book.title,
        currentStock: book.stockQuantity,
        quantity: item.quantity,
      });
    }

    // Decrement stock quantities for all books
    const updatedBooks = [];
    for (const item of items) {
      const book = await Book.findByIdAndUpdate(
        item.bookId,
        {
          $inc: { stockQuantity: -item.quantity },
          $set: { lastSoldDate: new Date() },
        },
        { new: true, session }
      );

      updatedBooks.push(book);
    }

    // Create sale document
    const sale = await Sale.create([
      {
        cashierId,
        customerId,
        items,
        totalAmount,
      },
    ], { session });

    // Update customer (if exists)
    if (customerId) {
      const customer = await Customer.findById(customerId).session(session);

      if (customer) {
        const membershipPtsEarned = Math.floor(totalAmount / 100);
        const distinctBooksCount = items.length;

        await Customer.findByIdAndUpdate(
          customerId,
          {
            $inc: {
              membershipPts: membershipPtsEarned,
              readerScore: distinctBooksCount,
            },
            $push: {
              purchaseHistory: {
                saleId: sale[0]._id,
                totalAmount,
                purchaseDate: new Date(),
              },
            },
          },
          { session }
        );
      }
    }

    // Create audit log entries for each book stock update
    for (const item of items) {
      const book = updatedBooks.find((b) => b._id.toString() === item.bookId.toString());
      if (book) {
        const originalStock = book.stockQuantity + item.quantity;
        await createAuditLog(
          "Book",
          "Update",
          cashierId,
          {
            stockQuantity: originalStock,
            lastSoldDate: null,
          },
          {
            stockQuantity: book.stockQuantity,
            lastSoldDate: book.lastSoldDate,
          },
          book._id
        );
      }
    }

    // Create audit log for sale
    await createAuditLog(
      "Sale",
      "Insert",
      cashierId,
      null,
      {
        cashierId,
        customerId,
        totalAmount,
        itemCount: items.length,
      },
      sale[0]._id
    );

    await session.commitTransaction();

    return {
      success: true,
      sale: sale[0],
      message: "Checkout completed successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Validate sale data structure
 * @param {Object} saleData - Sale data to validate
 */
export const validateSaleData = (saleData) => {
  const errors = [];

  if (!saleData.cashierId) {
    errors.push("cashierId is required");
  }

  if (!Array.isArray(saleData.items) || saleData.items.length === 0) {
    errors.push("items must be a non-empty array");
  }

  if (!saleData.totalAmount || saleData.totalAmount < 0) {
    errors.push("totalAmount must be a positive number");
  }

  if (saleData.items) {
    saleData.items.forEach((item, index) => {
      if (!item.bookId) {
        errors.push(`Item ${index}: bookId is required`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${index}: quantity must be at least 1`);
      }
      if (item.unitPrice === undefined || item.unitPrice < 0) {
        errors.push(`Item ${index}: unitPrice is required and cannot be negative`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
