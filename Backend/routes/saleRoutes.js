import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  createSale,
  getAllSales,
  getSaleById,
  getSalesByCustomer,
  getSalesReport,
  cancelSale,
  getMyOrders,
  createStripeSession,
} from "../controller/saleController.js";

const router = express.Router();

// Cashier and Customer - can create sales
router.post(
  "/",
  authenticate,
  authorize(["Cashier", "Manager", "Admin", "Customer"]),
  createSale
);

router.post(
  "/create-checkout-session",
  authenticate,
  authorize(["Cashier", "Manager", "Admin", "Customer"]),
  createStripeSession
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

// My orders (must be before /:id to avoid "my-orders" being treated as an ID)
router.get(
  "/my-orders",
  authenticate,
  authorize(["Customer", "Cashier", "Manager", "Admin"]),
  getMyOrders
);

// Get single sale
router.get(
  "/:id",
  authenticate,
  authorize(["Manager", "Admin", "Cashier"]),
  getSaleById
);

router.get(
  "/customer/:customerId",
  authenticate,
  authorize(["Manager", "Admin", "Customer"]),
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
