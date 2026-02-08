import mongoose from "mongoose";

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
          required: true,
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

export const Customer = mongoose.model("Customer", customerSchema);
