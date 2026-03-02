import mongoose from "mongoose";

let cached = null;

export const connectDB = async () => {
  if (cached) {
    return cached;
  }

  cached = mongoose
    .connect(process.env.MONGODB_URL, {
      dbName: "MERN_LMS",
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      cached = null;
      console.log("Database connection failed", err);
      throw err;
    });

  return cached;
};