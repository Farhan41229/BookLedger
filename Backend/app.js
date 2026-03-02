import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./Database/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

// Route imports
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

export const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected before handling any API request
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BookLedger API is running",
  });
});

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);