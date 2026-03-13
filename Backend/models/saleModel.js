import mongoose from "mongoose";

/**
 * @typedef {Object} SaleItem
 * @property {mongoose.Schema.Types.ObjectId} bookId - Reference to the Book document sold.
 * @property {Number} quantity - Number of copies of the book sold in this transaction.
 * @property {Number} unitPrice - The price at which the book was sold (can be discounted).
 */

/**
 * @typedef {Object} Sale
 * @property {mongoose.Schema.Types.ObjectId} [customerId] - Reference to the Customer if not a guest checkout.
 * @property {mongoose.Schema.Types.ObjectId} cashierId - Reference to the User (employee) who processed the sale.
 * @property {Number} totalAmount - The total cost of the transaction.
 * @property {SaleItem[]} items - Array of books and their quantities sold in this transaction.
 * @property {String} status - The current status of the transaction ('Completed', 'Pending', 'Cancelled').
 */

/**
 * Schema representing a sales transaction, linking items (books), the customer, and the cashier.
 * @type {mongoose.Schema<Sale>}
 */
const saleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Cashier ID is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: [true, "Book ID is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
          integer: true,
        },
        unitPrice: {
          type: Number,
          required: [true, "Unit price is required"],
          min: [0, "Unit price cannot be negative"],
        },
        _id: false,
      },
    ],
    status: {
      type: String,
      enum: {
        values: ["Completed", "Pending", "Cancelled"],
        message: "Invalid status",
      },
      default: "Completed",
    },
  },
  { timestamps: true }
);

export const Sale = mongoose.model("Sale", saleSchema);
