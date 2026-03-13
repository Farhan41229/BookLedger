import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from './models/bookModel.js';
import { Customer } from './models/customerModel.js';
import { Sale } from './models/saleModel.js';
import { User } from './models/userModel.js';
import { hashPassword } from './services/authService.js';

// Load env vars
dotenv.config({ path: './config/config.env' });

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'MERN_LMS',
    });
    console.log('✅ MongoDB Connected');

    console.log('Clearing existing data...');
    await Book.deleteMany({});
    await Customer.deleteMany({});
    await Sale.deleteMany({});
    // We'll also clear Users so we can create a cashier for the sales
    await User.deleteMany({});
    console.log('✅ Existing data cleared');

    // 1. Create a User (Cashier) needed for sales
    const hashedPassword = await hashPassword('password123');
    const cashier = await User.create({
      name: 'Demo Cashier',
      email: 'cashier@demo.com',
      password: hashedPassword,
      role: 'Cashier',
      isEmailVerified: true
    });
    console.log('✅ Created 1 Cashier User');

    // 2. Create 5 sample books
    const books = await Book.insertMany([
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        genre: 'Technology',
        isbn: '978-0132350884',
        price: 45.00,
        stockQuantity: 20,
        reorderLevel: 5
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        genre: 'Technology',
        isbn: '978-0135957059',
        price: 49.99,
        stockQuantity: 15,
        reorderLevel: 3
      },
      {
        title: 'Design Patterns',
        author: 'Erich Gamma',
        genre: 'Technology',
        isbn: '978-0201633610',
        price: 55.00,
        stockQuantity: 10,
        reorderLevel: 2
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        isbn: '978-0441172719',
        price: 18.99,
        stockQuantity: 30,
        reorderLevel: 10
      },
      {
        title: 'Neuromancer',
        author: 'William Gibson',
        genre: 'Science Fiction',
        isbn: '978-0441569595',
        price: 15.99,
        stockQuantity: 25,
        reorderLevel: 8
      }
    ]);
    console.log('✅ Created 5 sample books');

    // 3. Create 2 sample customers
    const customers = await Customer.insertMany([
      {
        name: 'Alice Smith',
        membershipPts: 150,
        readerScore: 12
      },
      {
        name: 'Bob Jones',
        membershipPts: 45,
        readerScore: 4
      }
    ]);
    console.log('✅ Created 2 sample customers');

    // 4. Create 3 sample sales
    await Sale.insertMany([
      {
        cashierId: cashier._id,
        customerId: customers[0]._id, // Alice
        totalAmount: 45.00,
        items: [
          {
            bookId: books[0]._id, // Clean Code
            quantity: 1,
            unitPrice: 45.00
          }
        ],
        status: 'Completed'
      },
      {
        cashierId: cashier._id,
        customerId: customers[1]._id, // Bob
        totalAmount: 34.98,
        items: [
          {
            bookId: books[3]._id, // Dune
            quantity: 1,
            unitPrice: 18.99
          },
          {
            bookId: books[4]._id, // Neuromancer
            quantity: 1,
            unitPrice: 15.99
          }
        ],
        status: 'Completed'
      },
      {
        cashierId: cashier._id,
        // No customerId for this one (guest checkout)
        totalAmount: 104.99,
        items: [
          {
            bookId: books[1]._id, // Pragmatic Programmer
            quantity: 1,
            unitPrice: 49.99
          },
          {
            bookId: books[2]._id, // Design Patterns
            quantity: 1,
            unitPrice: 55.00
          }
        ],
        status: 'Completed'
      }
    ]);
    console.log('✅ Created 3 sample sales');

    console.log('\n🎉 Seeding completed successfully! Your database is ready for the demo.');
    process.exit();
  } catch (error) {
    console.error('❌ Error during seeding:');
    console.error(error);
    process.exit(1);
  }
};

seedData();
