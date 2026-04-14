import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  registerCustomer,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationCode,
  getMe,
  updateProfile,
} from "../controller/userController.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register-customer", registerCustomer);
router.post("/forgot-password", forgotPassword); // Moved to its own line
router.post("/reset-password/:token", resetPassword); // Moved to its own line
router.post("/verify-email", verifyEmail);                      // Added route
router.post("/resend-verification", resendVerificationCode);    // Added route

// Protected routes
router.get("/me", authenticate, getMe);
router.put("/update-profile", authenticate, updateProfile);

router.post(
  "/register",
  authenticate,
  authorize(["Admin"]),
  registerUser
);

router.get("/", authenticate, authorize(["Admin"]), getAllUsers);

router.get("/:id", authenticate, getUserById);

router.put(
  "/:id",
  authenticate,
  authorize(["Admin"]),
  updateUser
);

router.delete(
  "/:id",
  authenticate,
  authorize(["Admin"]),
  deleteUser
);

export default router;
