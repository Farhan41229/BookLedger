import { Book } from "../models/bookModel.js";
import { AuditLog } from "../models/auditLogModel.js";
import { createAuditLog } from "./auditService.js";

const DEAD_STOCK_DAYS = 90;
const DEAD_STOCK_DISCOUNT_PERCENTAGE = 20; // 20% discount

/**
 * Identify dead stock books and apply discount
 * Dead stock: lastSoldDate > 90 days ago
 * @param {String} userId - User applying the discount
 * @returns {Promise<Object>} Summary of price changes
 */
export const applyDeadStockPricing = async (userId) => {
  try {
    const currentDate = new Date();
    const deadStockThresholdDate = new Date(
      currentDate.getTime() - DEAD_STOCK_DAYS * 24 * 60 * 60 * 1000
    );

    // Find books that are dead stock
    const deadStockBooks = await Book.find({
      $or: [
        { lastSoldDate: { $lt: deadStockThresholdDate } },
        { lastSoldDate: null },
      ],
      discountedPrice: null, // Not already discounted
    });

    const updates = [];

    for (const book of deadStockBooks) {
      const originalPrice = book.price;
      const discountedPrice = parseFloat(
        (originalPrice * (1 - DEAD_STOCK_DISCOUNT_PERCENTAGE / 100)).toFixed(2)
      );

      const beforeValue = {
        price: book.price,
        discountedPrice: book.discountedPrice,
      };

      // Update book
      await Book.updateOne(
        { _id: book._id },
        { $set: { discountedPrice } }
      );

      const afterValue = {
        price: book.price,
        discountedPrice,
      };

      // Create audit log
      await createAuditLog(
        "Book",
        "Update",
        userId,
        beforeValue,
        afterValue,
        book._id
      );

      updates.push({
        bookId: book._id,
        title: book.title,
        originalPrice,
        discountedPrice,
        discountApplied: DEAD_STOCK_DISCOUNT_PERCENTAGE,
      });
    }

    return {
      success: true,
      message: `Applied dead stock discount to ${updates.length} books`,
      updates,
    };
  } catch (error) {
    throw new Error(`Error applying dead stock pricing: ${error.message}`);
  }
};

/**
 * Get effective price (considering discounts)
 * @param {Object} book - Book document
 * @returns {Number} Effective selling price
 */
export const getEffectivePrice = (book) => {
  return book.discountedPrice || book.price;
};

/**
 * Clear expired discounts
 * @param {String} userId - User clearing discounts
 * @returns {Promise<Object>} Summary of cleared discounts
 */
export const clearExpiredDiscounts = async (userId) => {
  try {
    const booksWithDiscounts = await Book.find({
      discountedPrice: { $ne: null },
    });

    const clears = [];

    for (const book of booksWithDiscounts) {
      const beforeValue = {
        price: book.price,
        discountedPrice: book.discountedPrice,
      };

      // Clear discount
      await Book.updateOne(
        { _id: book._id },
        { $set: { discountedPrice: null } }
      );

      const afterValue = {
        price: book.price,
        discountedPrice: null,
      };

      // Create audit log
      await createAuditLog(
        "Book",
        "Update",
        userId,
        beforeValue,
        afterValue,
        book._id
      );

      clears.push({
        bookId: book._id,
        title: book.title,
      });
    }

    return {
      success: true,
      message: `Cleared discounts from ${clears.length} books`,
      clears,
    };
  } catch (error) {
    throw new Error(`Error clearing discounts: ${error.message}`);
  }
};
