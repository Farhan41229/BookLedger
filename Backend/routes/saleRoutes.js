import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  createSale,
  getAllSales,
  getSaleById,
  getSalesByCustomer,
  getSalesReport,
  cancelSale,
} from "../controller/saleController.js";

const router = express.Router();

// Cashier - can create sales
router.post(
  "/",
  authenticate,
  authorize(["Cashier", "Manager", "Admin"]),
  createSale
);

// Manager/Admin - can view all sales
router.get(
  "/",
  authenticate,
  authorize(["Manager", "Admin"]),
  getAllSales
);

// Get sales report
router.get(
  "/reports/summary",
  authenticate,
  authorize(["Manager", "Admin"]),
  getSalesReport
);

// Get single sale
router.get(
  "/:id",
  authenticate,
  authorize(["Manager", "Admin", "Cashier"]),
  getSaleById
);

// Get sales by customer
router.get(
  "/customer/:customerId",
  authenticate,
  authorize(["Manager", "Admin"]),
  getSalesByCustomer
);

// Cancel sale (Admin only)
router.delete(
  "/:id",
  authenticate,
  authorize(["Admin"]),
  cancelSale
);

export default router;
