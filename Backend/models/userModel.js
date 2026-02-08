import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: [true, "Email already exists"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password should be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["Admin", "Manager", "Cashier"],
        message: "Invalid role. Must be Admin, Manager, or Cashier",
      },
      required: [true, "Please specify a role"],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
    verificationToken: number,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,



}, { timestamps: true });

export const User = mongoose.model("User", userSchema);