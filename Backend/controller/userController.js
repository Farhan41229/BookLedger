import { User } from '../models/userModel.js';
import {
  hashPassword,
  generateToken,
  comparePassword,
  generateVerificationCode,
  generateResetCode,
} from '../services/authService.js';
import { createAuditLog } from '../services/auditService.js';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from '../Brevo/Brevoemail.js';
import crypto from 'crypto';

/**
 * Get current authenticated user
 * GET /users/me
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new user (Admin only)
 * POST /users/register
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: name, email, password, role',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const validRoles = ['Admin', 'Manager', 'Cashier'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
      });
    }

    const hashedPassword = await hashPassword(password);

    // --- UPDATED: VERIFICATION LOGIC ---
    const verificationToken = generateVerificationCode();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isEmailVerified: false, // Account starts as unverified
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry
    });

    await sendVerificationEmail(user.email, verificationToken);

    await createAuditLog(
      'User',
      'Insert',
      req.user._id,
      null,
      { name: user.name, email: user.email, role: user.role },
      user._id,
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /users/login
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    // --- UPDATED: BLOCK LOGIN IF NOT VERIFIED ---
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          'Your account is not verified. Please check your email for the verification code.',
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ... Rest of your functions (getAllUsers, getUserById, updateUser, deleteUser, verifyEmail, resendVerificationCode, forgotPassword, resetPassword) remain the same.
/**
 * Get all users (Admin only)
 * GET /users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * GET /users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user (Admin only)
 * PUT /users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const beforeValue = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    // Create audit log
    await createAuditLog(
      'User',
      'Update',
      req.user._id,
      beforeValue,
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      user._id,
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin only)
 * DELETE /users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create audit log
    await createAuditLog(
      'User',
      'Delete',
      req.user._id,
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      null,
      user._id,
    );

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email with verification code
 * POST /users/verify-email
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    // Validation
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and verification code',
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    // Check verification code
    if (user.verificationToken !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
        code: code,
        verificationToken: user.verificationToken,
      });
    }

    // Check if code expired
    if (user.verificationTokenExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired',
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Create audit log
    await createAuditLog(
      'User',
      'Update',
      user._id,
      { isEmailVerified: false },
      { isEmailVerified: true },
      user._id,
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification code
 * POST /users/resend-verification-code
 */
export const resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    // Generate new verification code
    const verificationToken = generateVerificationCode();

    // Update user
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    // Create audit log
    await createAuditLog(
      'User',
      'Update',
      user._id,
      { verificationCode: 'resent' },
      { verificationCode: 'resent' },
      user._id,
    );

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot Password - Send reset email
 * POST /users/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide an email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Generate reset token using your existing service
    const resetToken = generateResetCode();

    // Set token and expiry (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000;

    await user.save();

    // Build full reset URL for the email link (frontend reset page)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetURL = `${frontendUrl}/auth/reset-password/${resetToken}`;

    // Send the email using your Brevo service
    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password
 * POST /users/reset-password/:token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash the token from the URL to compare with DB
    const resetPasswordToken = token;

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired token' });
    }

    // Hash new password and clear reset fields
    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    // Send success email
    await sendPasswordResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};
