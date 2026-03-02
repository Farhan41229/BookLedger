import { Book } from "../models/bookModel.js";
import { createAuditLog } from "../services/auditService.js";
import { getEffectivePrice } from "../services/pricingService.js";
import { generateAIText } from "../config/GeminiSetup.js";

/**
 * AI-powered book recommendation for guests
 * POST /books/recommend
 */
export const recommendBooks = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a message describing the type of book you're looking for.",
      });
    }

    // Fetch all books (lean fields only — enough for AI to reason about)
    const books = await Book.find({}, "_id title author genre price stockQuantity");

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books are currently available in our collection.",
      });
    }

    const bookList = books.map((b) => ({
      id: b._id.toString(),
      title: b.title,
      author: b.author,
      genre: b.genre || "Unknown",
      price: b.price,
      inStock: b.stockQuantity > 0,
    }));

    const prompt = `You are a generous book recommendation assistant for BookLedger, an online bookstore.

User request: "${message.trim()}"

Book inventory (JSON):
${JSON.stringify(bookList)}

Instructions:
- Users are casual and rarely precise. Interpret their request broadly and generously.
- Include a book if it could reasonably appeal to someone making this request — even a loose or indirect match counts.
- When the user uses "/" or "or" or "and" between terms, treat ALL terms as valid and return books matching ANY of them.
- Sub-genres count: e.g., "Dystopian" qualifies as fictional. "Thriller" qualifies as suspense/mystery.
- When in doubt, include the book rather than exclude it. Err on the side of more results.
- If the user's message is complete gibberish, spam, or has absolutely zero connection to finding a book, respond with exactly: GIBBERISH
- If the request is genuinely valid but truly nothing in the inventory could even loosely match, respond with exactly: NO_MATCH
- If any books match (even loosely), respond with a JSON array of matching book IDs: ["id1","id2"]

Respond with ONLY one of the three formats above. No explanation, no extra text.`;

    const aiResponse = await generateAIText(prompt);

    if (!aiResponse || aiResponse.startsWith("Error:")) {
      const err = new Error("AI service failed to respond. Please try again later.");
      err.statusCode = 503;
      return next(err);
    }

    const trimmed = aiResponse.trim();

    if (trimmed.includes("GIBBERISH")) {
      return res.status(400).json({
        success: false,
        message: "We couldn't understand your request. Please describe the type of book you're looking for and try again.",
      });
    }

    if (trimmed.includes("NO_MATCH")) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find any books matching your request. Sorry!",
      });
    }

    // Parse the array of IDs from Gemini's response
    let matchedIds;
    try {
      const jsonMatch = trimmed.match(/\[.*\]/s);
      matchedIds = JSON.parse(jsonMatch ? jsonMatch[0] : trimmed);
      if (!Array.isArray(matchedIds)) throw new Error("Not an array");
    } catch {
      const err = new Error("Unexpected response from AI. Please try again.");
      err.statusCode = 500;
      return next(err);
    }

    const matchedBooks = await Book.find({ _id: { $in: matchedIds } });

    const booksWithPrices = matchedBooks.map((book) => ({
      ...book.toObject(),
      effectivePrice: getEffectivePrice(book),
    }));

    res.status(200).json({
      success: true,
      books: booksWithPrices,
      count: booksWithPrices.length,
    });
  } catch (error) {
    next(error);
  }
};

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
