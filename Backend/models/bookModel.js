import mongoose from "mongoose";

/**
 * @typedef {Object} Book
 * @property {String} title - The title of the book.
 * @property {String} author - The author of the book.
 * @property {String} [genre] - The genre of the book.
 * @property {String} isbn - The unique ISBN identifier for the book.
 * @property {Number} price - The standard selling price of the book.
 * @property {Number} [discountedPrice] - The active discounted price (e.g., for dead stock).
 * @property {Number} stockQuantity - The current available stock quantity.
 * @property {Number} reorderLevel - The threshold quantity at which to reorder more stock.
 * @property {Date} [lastSoldDate] - Date the book was most recently sold.
 */

/**
 * Schema representing a book inventory item with pricing, stock, and dead-stock tracking.
 * @type {mongoose.Schema<Book>}
 */
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a book title"],
      index: true,
    },
    author: {
      type: String,
      required: [true, "Please provide an author name"],
    },
    genre: {
      type: String,
      default: null,
    },
    isbn: {
      type: String,
      required: [true, "Please provide ISBN"],
      unique: [true, "ISBN already exists"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be negative"],
    },
    discountedPrice: {
      type: Number,
      default: null,
      min: [0, "Discounted price cannot be negative"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      integer: true,
      min: [0, "Stock cannot be negative"],
    },
    reorderLevel: {
      type: Number,
      required: [true, "Please provide reorder level"],
      integer: true,
      min: [0, "Reorder level cannot be negative"],
    },
    lastSoldDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
