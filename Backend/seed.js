#!/usr/bin/env node

/**
 * Seed Script for BookLedger
 * Populates database with sample data for testing
 *
 * Usage: node seed.js
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { Book } from './models/bookModel.js';
import { User } from './models/userModel.js';
import { Customer } from './models/customerModel.js';
import { hashPassword } from './services/authService.js';

config({ path: './config/config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COVERS_DIR = path.resolve(__dirname, '../Frontend/src/assets/Book Covers');

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    isbn: '978-0-7432-7356-5',
    price: 29.99,
    stockQuantity: 50,
    reorderLevel: 10,
    description: 'A classic novel set in the Roaring Twenties, exploring themes of wealth, love, and the American Dream.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    isbn: '978-0-451-52493-2',
    price: 24.99,
    stockQuantity: 35,
    reorderLevel: 8,
    description: 'A chilling portrayal of a totalitarian future where Thought Police and Big Brother monitor every move.',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    isbn: '978-0-06-112008-4',
    price: 18.99,
    stockQuantity: 60,
    reorderLevel: 12,
    description: 'A powerful story about racial injustice and the loss of innocence in the American South.',
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    isbn: '978-0-316-76948-0',
    price: 16.99,
    stockQuantity: 5,
    reorderLevel: 15,
    description: 'The iconic story of teenage angst and rebellion follows Holden Caulfield after his expulsion from prep school.',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    isbn: '978-0-14-143951-8',
    price: 14.99,
    stockQuantity: 45,
    reorderLevel: 10,
    description: 'A timeless witty romantic comedy of manners in 19th-century England, centered on Elizabeth Bennet.',
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    isbn: '978-0-544-00901-1',
    price: 49.99,
    stockQuantity: 25,
    reorderLevel: 5,
    description: 'An epic high-fantasy masterpiece about a fellowship quest to destroy a powerful, corruptive ring.',
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    isbn: '978-0-547-92822-7',
    price: 21.99,
    stockQuantity: 40,
    reorderLevel: 10,
    description: 'Bilbo Baggins is whisked away from his comfortable hobbit-hole by Gandalf and a company of dwarves on an epic quest to reclaim the Lonely Mountain.',
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    isbn: '978-0-06-085052-4',
    price: 19.99,
    stockQuantity: 30,
    reorderLevel: 8,
    description: 'A dark vision of an engineered future where humans are genetically bred and conditioned into passive, consumerist happiness.',
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    genre: 'Sci-Fi',
    isbn: '978-1-4516-7331-9',
    price: 17.99,
    stockQuantity: 28,
    reorderLevel: 8,
    description: 'In a bleak, dystopian future, fireman Guy Montag is tasked with burning books until a mysterious young woman inspires him to question everything.',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    isbn: '978-0-441-17271-9',
    price: 26.99,
    stockQuantity: 32,
    reorderLevel: 10,
    description: 'Set on the desert planet Arrakis, young Paul Atreides must navigate politics, religion, and giant sandworms to safeguard the universe’s most valuable resource.',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Adventure',
    isbn: '978-0-06-231500-7',
    price: 15.99,
    stockQuantity: 55,
    reorderLevel: 12,
    description: 'An inspirational fable following Santiago, an Andalusian shepherd boy who journeys to the pyramids in search of his personal legend.',
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    genre: 'Classic',
    isbn: '978-0-14-044913-6',
    price: 18.50,
    stockQuantity: 20,
    reorderLevel: 6,
    description: 'A gripping psychological drama chronicling the internal anguish and moral dilemma of Raskolnikov following a premeditated murder.',
  },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    genre: 'Classic',
    isbn: '978-0-14-143957-0',
    price: 13.99,
    stockQuantity: 24,
    reorderLevel: 6,
    description: 'A sensual and philosophical gothic tale of a handsome young man who trades his soul for eternal youth while his portrait bears the sins of his decadence.',
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre: 'Romance',
    isbn: '978-0-14-144114-6',
    price: 16.50,
    stockQuantity: 38,
    reorderLevel: 10,
    description: 'An enduring gothic romance tracing the resilient life of an orphaned governess and her complex, passionate bond with Mr. Rochester.',
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Romance',
    isbn: '978-0-14-143955-6',
    price: 15.50,
    stockQuantity: 22,
    reorderLevel: 7,
    description: 'A brooding, turbulent story of intense passion and revenge set on the bleak Yorkshire moors between Heathcliff and Catherine Earnshaw.',
  },
  {
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    isbn: '978-0-307-74365-7',
    price: 22.99,
    stockQuantity: 18,
    reorderLevel: 5,
    description: 'Jack Torrance accepts a winter caretaker role at the isolated Overlook Hotel, where supernatural forces unravel his sanity.',
  },
  {
    title: 'Dracula',
    author: 'Bram Stoker',
    genre: 'Horror',
    isbn: '978-0-14-143984-6',
    price: 14.50,
    stockQuantity: 26,
    reorderLevel: 8,
    description: 'The definitive gothic vampire novel documenting Count Dracula’s attempt to move from Transylvania to England to spread his curse.',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    isbn: '978-0-06-231609-7',
    price: 27.99,
    stockQuantity: 42,
    reorderLevel: 10,
    description: 'An exploration of how Homo sapiens came to conquer Earth through cognitive, agricultural, and scientific revolutions.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    isbn: '978-0-7352-1129-2',
    price: 25.00,
    stockQuantity: 65,
    reorderLevel: 15,
    description: 'A proven, practical framework for improving every day through small changes in habit design and behavioral psychology.',
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Biography',
    isbn: '978-1-4516-4853-9',
    price: 32.00,
    stockQuantity: 20,
    reorderLevel: 5,
    description: 'The acclaimed biography based on dozens of in-depth interviews detailing the roller-coaster life and searingly intense personality of Apple’s visionary founder.',
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Mystery',
    isbn: '978-0-307-47427-8',
    price: 19.95,
    stockQuantity: 45,
    reorderLevel: 10,
    description: 'Symbologist Robert Langdon investigates a bizarre murder in the Louvre and uncovers a secret society guarding an ancient mystery.',
  },
  {
    title: 'The Road',
    author: 'Cormac McCarthy',
    genre: 'Dystopian',
    isbn: '978-0-307-38789-9',
    price: 16.00,
    stockQuantity: 25,
    reorderLevel: 6,
    description: 'A father and his young son walk alone through burned, ash-covered post-apocalyptic America heading toward the coast.',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    isbn: '978-0-399-59050-4',
    price: 22.00,
    stockQuantity: 38,
    reorderLevel: 8,
    description: 'An unforgettable memoir about a young girl who, kept out of school by her survivalist family in rural Idaho, teaches herself enough mathematics and grammar to enter college at seventeen.',
  },
  {
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    genre: 'Fiction',
    isbn: '978-1-59463-193-1',
    price: 17.50,
    stockQuantity: 40,
    reorderLevel: 10,
    description: 'An epic tale of friendship, redemption, and devastating betrayal set against the backdrop of modern Afghanistan.',
  },
  {
    title: 'The Book Thief',
    author: 'Markus Zusak',
    genre: 'Historical Fiction',
    isbn: '978-0-375-84220-7',
    price: 18.99,
    stockQuantity: 30,
    reorderLevel: 8,
    description: 'Narrated by Death, this haunting story follows Liesel Meminger, a foster girl living outside Munich in Nazi Germany who discovers the transformative power of stolen books.',
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Thriller',
    isbn: '978-1-250-30169-6',
    price: 21.00,
    stockQuantity: 50,
    reorderLevel: 12,
    description: 'A psychological thriller about a famous painter who murders her husband in cold blood and then never speaks another word.',
  },
  {
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    genre: 'Mystery',
    isbn: '978-0-7352-1909-0',
    price: 20.00,
    stockQuantity: 48,
    reorderLevel: 10,
    description: 'For years, rumors of the "Marsh Girl" have haunted Barkley Cove. When Chase Andrews is found dead, the locals immediately suspect Kya Clark.',
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Sci-Fi',
    isbn: '978-0-593-13520-4',
    price: 28.00,
    stockQuantity: 35,
    reorderLevel: 8,
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genre: 'Non-Fiction',
    isbn: '978-0-374-53355-7',
    price: 24.50,
    stockQuantity: 30,
    reorderLevel: 6,
    description: 'Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think and make decisions.',
  },
  {
    title: 'A Game of Thrones',
    author: 'George R.R. Martin',
    genre: 'Fantasy',
    isbn: '978-0-553-10354-0',
    price: 29.99,
    stockQuantity: 40,
    reorderLevel: 10,
    description: 'In a land where summers can last decades and winters a lifetime, tragedy and trouble brew as noble houses vie for the Iron Throne.',
  },
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin',
    isEmailVerified: true,
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'Manager',
    isEmailVerified: true,
  },
  {
    name: 'Cashier User',
    email: 'cashier@example.com',
    password: 'cashier123',
    role: 'Cashier',
    isEmailVerified: true,
  },
];

const sampleCustomers = [
  {
    name: 'John Smith',
    membershipPts: 100,
    readerScore: 5,
  },
  {
    name: 'Jane Doe',
    membershipPts: 250,
    readerScore: 12,
  },
  {
    name: 'Bob Johnson',
    membershipPts: 50,
    readerScore: 2,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'MERN_LMS',
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    await Customer.deleteMany({});
    console.log('✓ Cleared existing collections');

    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      })),
    );

    console.log('Users with Hashed Passwords: ', usersWithHashedPasswords);

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✓ Created ${createdUsers.length} sample users`);

    // Upload book covers to Cloudinary if available
    console.log('Uploading book covers to Cloudinary...');
    const coverFiles = fs.existsSync(COVERS_DIR) ? fs.readdirSync(COVERS_DIR) : [];
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const booksWithCovers = [];
    for (const book of sampleBooks) {
      let coverImage = null;
      let coverImageId = null;

      const normTitle = normalize(book.title);
      const matchedFilename = coverFiles.find((file) => {
        const normBase = normalize(path.parse(file).name);
        return (
          normBase === normTitle ||
          normTitle.startsWith(normBase) ||
          normBase.startsWith(normTitle) ||
          (book.title === 'The Great Gatsby' && file.includes('Great-Gatsby'))
        );
      });

      if (matchedFilename) {
        const imagePath = path.join(COVERS_DIR, matchedFilename);
        try {
          const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'bookledger/books',
          });
          coverImage = result.secure_url;
          coverImageId = result.public_id;
          console.log(`✓ Uploaded cover for "${book.title}" (${matchedFilename})`);
        } catch (err) {
          console.warn(`⚠️ Cloudinary upload failed for "${book.title}":`, err.message);
        }
      } else {
        console.log(`ℹ️ No local cover found for "${book.title}"`);
      }

      booksWithCovers.push({
        ...book,
        coverImage,
        coverImageId,
      });
    }

    // Create books
    const createdBooks = await Book.insertMany(booksWithCovers);
    console.log(`✓ Created ${createdBooks.length} sample books with cover images`);

    // Create customers
    const createdCustomers = await Customer.insertMany(sampleCustomers);
    console.log(`✓ Created ${createdCustomers.length} sample customers`);

    // Display sample credentials
    console.log('\n=== SEED DATA CREATED ===\n');
    console.log('Sample User Credentials:');
    console.log('------------------------');
    sampleUsers.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}\n`);
      console.log(`Account Verified: ${user.isEmailVerified}\n`);
    });

    console.log('Sample Books Created:');
    console.log('---------------------');
    sampleBooks.forEach((book) => {
      console.log(`${book.title} by ${book.author}`);
      console.log(`ISBN: ${book.isbn} | Stock: ${book.stockQuantity}\n`);
    });

    console.log('✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
