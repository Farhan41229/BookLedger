import mongoose from "mongoose";

/**
 * @typedef {Object} PurchaseHistoryItem
 * @property {mongoose.Schema.Types.ObjectId} saleId - Reference to the Sale document.
 * @property {Number} totalAmount - Total amount spent in this specific sale.
 * @property {Date} purchaseDate - The date and time the purchase was made.
 */

/**
 * @typedef {Object} Customer
 * @property {String} name - The full name of the customer.
 * @property {Number} membershipPts - Loyalty points accumulated from purchases.
 * @property {Number} readerScore - A calculated score based on reading habits/purchases.
 * @property {PurchaseHistoryItem[]} purchaseHistory - Array of past purchases made by the customer.
 */

/**
 * Schema representing a bookstore customer, including loyalty points and purchase history.
 * @type {mongoose.Schema<Customer>}
 */
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a customer name"],
    },
    membershipPts: {
      type: Number,
      default: 0,
      min: [0, "Membership points cannot be negative"],
    },
    readerScore: {
      type: Number,
      default: 0,
      min: [0, "Reader score cannot be negative"],
    },
    purchaseHistory: [
      {
        saleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sale",
        },
        totalAmount: {
          type: Number,
          required: [true, "Total amount is required for purchase history"],
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

customerSchema.pre("save", function (next) {
  if (this.name) this.name = this.name.trim();
  next();
});

export const Customer = mongoose.model("Customer", customerSchema);
