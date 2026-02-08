import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  getReorderList,
  getInventoryStatus,
  getLowStockBooks,
  getInventoryReport,
} from "../controller/inventoryController.js";

const router = express.Router();

// All inventory endpoints require Manager or Admin role
router.get(
  "/reorder",
  authenticate,
  authorize(["Manager", "Admin"]),
  getReorderList
);

router.get(
  "/status",
  authenticate,
  authorize(["Manager", "Admin"]),
  getInventoryStatus
);

router.get(
  "/low-stock",
  authenticate,
  authorize(["Manager", "Admin"]),
  getLowStockBooks
);

router.get(
  "/report",
  authenticate,
  authorize(["Manager", "Admin"]),
  getInventoryReport
);

export default router;
