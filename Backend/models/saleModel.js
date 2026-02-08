import mongoose from "mongoose";

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
