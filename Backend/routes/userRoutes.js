import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/userController.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);

// Protected routes
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
