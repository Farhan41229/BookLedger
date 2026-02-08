import { Book } from "../models/bookModel.js";
import { createAuditLog } from "../services/auditService.js";
import { getEffectivePrice } from "../services/pricingService.js";

/**
 * Create a new book (Manager/Admin only)
 * POST /books
 */
export const createBook = async (req, res, next) => {
  try {
    const { title, author, genre, isbn, price, stockQuantity, reorderLevel } =
      req.body;

    // Validation
    if (!title || !author || !isbn || price === undefined || stockQuantity === undefined || reorderLevel === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: title, author, isbn, price, stockQuantity, reorderLevel",
      });
    }

    // Check ISBN uniqueness
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "ISBN already exists",
      });
    }

    const book = await Book.create({
      title,
      author,
      genre,
      isbn,
      price,
      stockQuantity,
      reorderLevel,
    });

    // Create audit log
    await createAuditLog(
      "Book",
      "Insert",
      req.user._id,
      null,
      {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        price: book.price,
        stockQuantity: book.stockQuantity,
      },
      book._id
    );

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all books with pagination
 * GET /books
 */
export const getAllBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Add effective prices
    const booksWithPrices = books.map((book) => ({
      ...book.toObject(),
      effectivePrice: getEffectivePrice(book),
    }));

    const total = await Book.countDocuments();

    res.status(200).json({
      success: true,
      books: booksWithPrices,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search books with filtering
 * GET /books/search
 *
 * Query params:
 * - title: partial, case-insensitive
 * - author: exact match
 * - genre: exact match
 * - isbn: exact match
 * - minPrice / maxPrice: range filter
 * - availability: inStock | outOfStock
 */
export const searchBooks = async (req, res, next) => {
  try {
    const { title, author, genre, isbn, minPrice, maxPrice, availability, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (author) {
      filter.author = author;
    }

    if (genre) {
      filter.genre = genre;
    }

    if (isbn) {
      filter.isbn = isbn;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (availability === "inStock") {
      filter.stockQuantity = { $gt: 0 };
    } else if (availability === "outOfStock") {
      filter.stockQuantity = 0;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Add effective prices
    const booksWithPrices = books.map((book) => ({
      ...book.toObject(),
      effectivePrice: getEffectivePrice(book),
    }));

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      books: booksWithPrices,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get book by ID
 * GET /books/:id
 */
export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const bookObj = book.toObject();
    bookObj.effectivePrice = getEffectivePrice(book);

    res.status(200).json({
      success: true,
      book: bookObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update book (Manager/Admin only)
 * PUT /books/:id
 */
export const updateBook = async (req, res, next) => {
  try {
    const { title, author, genre, price, stockQuantity, reorderLevel } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const beforeValue = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      price: book.price,
      stockQuantity: book.stockQuantity,
      reorderLevel: book.reorderLevel,
    };

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (price !== undefined) book.price = price;
    if (stockQuantity !== undefined) book.stockQuantity = stockQuantity;
    if (reorderLevel !== undefined) book.reorderLevel = reorderLevel;

    await book.save();

    // Create audit log
    await createAuditLog(
      "Book",
      "Update",
      req.user._id,
      beforeValue,
      {
        title: book.title,
        author: book.author,
        genre: book.genre,
        price: book.price,
        stockQuantity: book.stockQuantity,
        reorderLevel: book.reorderLevel,
      },
      book._id
    );

    const bookObj = book.toObject();
    bookObj.effectivePrice = getEffectivePrice(book);

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: bookObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete book (Manager/Admin only)
 * DELETE /books/:id
 */
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Create audit log
    await createAuditLog(
      "Book",
      "Delete",
      req.user._id,
      {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        price: book.price,
      },
      null,
      book._id
    );

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
