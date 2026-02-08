import mongoose from "mongoose";

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
