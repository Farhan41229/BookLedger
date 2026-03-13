import mongoose from 'mongoose';

/**
 * @typedef {Object} User
 * @property {String} name - Full name of the employee.
 * @property {String} email - Unique email address used for login.
 * @property {String} password - Hashed password for authentication (hidden by default).
 * @property {String} role - Access level role ('Admin', 'Manager', 'Cashier').
 * @property {Number} [verificationToken] - OTP or token used for email verification.
 * @property {Date} [verificationTokenExpiry] - Expiration time for the verification token.
 * @property {Boolean} isEmailVerified - Indicates whether the user has verified their email address.
 * @property {String} [resetPasswordToken] - Token used for password reset flows.
 * @property {Date} [resetPasswordExpiry] - Expiration time for the password reset token.
 */

/**
 * Schema representing an employee user of the system with role-based access control.
 * @type {mongoose.Schema<User>}
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: [true, 'Email already exists'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password should be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['Admin', 'Manager', 'Cashier'],
        message: 'Invalid role. Must be Admin, Manager, or Cashier',
      },
      required: [true, 'Please specify a role'],
    },
    verificationToken: {
      type: Number,
      default: null,
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
    },

    isEmailVerified: {
      // Added this field
      type: Boolean,
      default: false,
    },

    // --- UPDATED SECTION START ---
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiry: {
      // <--- FIXED: Removed "Token" from the name to match Controller
      type: Date,
      default: null,
    },
    // --- UPDATED SECTION END ---
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
