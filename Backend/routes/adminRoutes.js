import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  applyDeadStockDiscount,
  clearDiscounts,
  getAuditLogsHandler,
} from "../controller/adminController.js";

const router = express.Router();

// Pricing endpoints (Manager/Admin only)
router.post(
  "/pricing/apply-discount",
  authenticate,
  authorize(["Manager", "Admin"]),
  applyDeadStockDiscount
);

router.post(
  "/pricing/clear-discount",
  authenticate,
  authorize(["Manager", "Admin"]),
  clearDiscounts
);

// Audit logs (Admin only)
router.get(
  "/audit",
  authenticate,
  authorize(["Admin"]),
  getAuditLogsHandler
);

export default router;
