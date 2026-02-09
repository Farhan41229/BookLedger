import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";
const JWT_EXPIRE = "24h";
const BCRYPT_SALT_ROUNDS = 10;

/**
 * Generate JWT token
 * @param {String} userId - User ID
 * @returns {String} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Hash password
 * @param {String} password - Plain text password
 * @returns {Promise<String>} Hashed password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};

/**
 * Compare password with hash
 * @param {String} password - Plain text password
 * @param {String} passwordHash - Hashed password
 * @returns {Promise<Boolean>} True if password matches
 */
export const comparePassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

/**
 * Generate verification code (6-digit code)
 * @returns {String} 6-digit verification code
 */
export const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate password reset token
 * @returns {String} Random reset token (hex format)
 */
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
