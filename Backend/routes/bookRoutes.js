import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  createBook,
  getAllBooks,
  searchBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controller/bookController.js";

const router = express.Router();

// Public routes (no auth required for browsing)
router.get("/", getAllBooks);
router.get("/search", searchBooks);
router.get("/:id", getBookById);

// Protected routes (Manager/Admin only)
router.post(
  "/",
  authenticate,
  authorize(["Manager", "Admin"]),
  createBook
);

router.put(
  "/:id",
  authenticate,
  authorize(["Manager", "Admin"]),
  updateBook
);

router.delete(
  "/:id",
  authenticate,
  authorize(["Manager", "Admin"]),
  deleteBook
);

export default router;
