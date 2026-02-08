#!/usr/bin/env node

/**
 * Seed Script for BookLedger
 * Populates database with sample data for testing
 * 
 * Usage: node seed.js
 */

import mongoose from "mongoose";
import { config } from "dotenv";
import { Book } from "./models/bookModel.js";
import { User } from "./models/userModel.js";
import { Customer } from "./models/customerModel.js";
import { hashPassword } from "./services/authService.js";

config({ path: "./config/config.env" });

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    isbn: "978-0-7432-7356-5",
    price: 29.99,
    stockQuantity: 50,
    reorderLevel: 10,
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    isbn: "978-0-451-52493-2",
    price: 24.99,
    stockQuantity: 35,
    reorderLevel: 8,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    isbn: "978-0-06-112008-4",
    price: 18.99,
    stockQuantity: 60,
    reorderLevel: 12,
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    isbn: "978-0-316-76948-0",
    price: 16.99,
    stockQuantity: 5,
    reorderLevel: 15,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    isbn: "978-0-14-143951-8",
    price: 14.99,
    stockQuantity: 45,
    reorderLevel: 10,
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isbn: "978-0-544-00901-1",
    price: 49.99,
    stockQuantity: 25,
    reorderLevel: 5,
  },
];

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // Will be hashed
    role: "Admin",
  },
  {
    name: "Manager User",
    email: "manager@example.com",
    password: "manager123",
    role: "Manager",
  },
  {
    name: "Cashier User",
    email: "cashier@example.com",
    password: "cashier123",
    role: "Cashier",
  },
];

const sampleCustomers = [
  {
    name: "John Smith",
    membershipPts: 100,
    readerScore: 5,
  },
  {
    name: "Jane Doe",
    membershipPts: 250,
    readerScore: 12,
  },
  {
    name: "Bob Johnson",
    membershipPts: 50,
    readerScore: 2,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "MERN LMS",
    });
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    await Customer.deleteMany({});
    console.log("✓ Cleared existing collections");

    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✓ Created ${createdUsers.length} sample users`);

    // Create books
    const createdBooks = await Book.insertMany(sampleBooks);
    console.log(`✓ Created ${createdBooks.length} sample books`);

    // Create customers
    const createdCustomers = await Customer.insertMany(sampleCustomers);
    console.log(`✓ Created ${createdCustomers.length} sample customers`);

    // Display sample credentials
    console.log("\n=== SEED DATA CREATED ===\n");
    console.log("Sample User Credentials:");
    console.log("------------------------");
    sampleUsers.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}\n`);
    });

    console.log("Sample Books Created:");
    console.log("---------------------");
    sampleBooks.forEach((book) => {
      console.log(`${book.title} by ${book.author}`);
      console.log(`ISBN: ${book.isbn} | Stock: ${book.stockQuantity}\n`);
    });

    console.log("✓ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();
