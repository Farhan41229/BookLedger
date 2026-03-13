import { Book } from "../models/bookModel.js";
import { createAuditLog } from "../services/auditService.js";
import { getEffectivePrice } from "../services/pricingService.js";
import { generateAIText } from "../config/GeminiSetup.js";

/**
 * Uses Gemini AI to recommend a list of books based on a user's natural language input.
 * POST /books/recommend
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing the search query.
 * @param {String} req.body.message - The natural language message/prompt from the user.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with status 200 containing the recommended books array and count.
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
    console.error("AI Recommendation Error:", error);
    const err = new Error("An unexpected server error occurred while generating recommendations. Please try again later.");
    err.statusCode = 500;
    next(err);
  }
};

/**
 * Creates a new book in the inventory system.
 * POST /books
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body representing the new book.
 * @param {String} req.body.title - The title of the book.
 * @param {String} req.body.author - The author of the book.
 * @param {String} [req.body.genre] - The genre of the book.
 * @param {String} req.body.isbn - The ISBN.
 * @param {Number} req.body.price - The base price.
 * @param {Number} req.body.stockQuantity - Initial stock amount.
 * @param {Number} req.body.reorderLevel - Level at which stock should be reordered.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with status 201 containing the newly created book.
 * 
 * @example
 * // Access Control: Manager/Admin only
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
    console.error("Create Book Error:", error);
    const err = new Error("An unexpected server error occurred while creating the book. Please try again later.");
    err.statusCode = 500;
    next(err);
  }
};

/**
 * Retrieves a paginated list of all books, including their effective (discounted) pricing.
 * GET /books
 * 
 * @param {Object} req - The Express request object containing pagination query params.
 * @param {String} [req.query.page=1] - The page number to retrieve.
 * @param {String} [req.query.limit=10] - Number of items per page.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with an array of books and pagination details.
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
    console.error("Get All Books Error:", error);
    const err = new Error("An unexpected server error occurred while retrieving books. Please try again later.");
    err.statusCode = 500;
    next(err);
  }
};

/**
 * Searches and filters books based on various query parameters.
 * GET /books/search
 *
 * @param {Object} req - The Express request object.
 * @param {String} [req.query.title] - Partial, case-insensitive title search.
 * @param {String} [req.query.author] - Exact author match.
 * @param {String} [req.query.genre] - Exact genre match.
 * @param {String} [req.query.isbn] - Exact ISBN match.
 * @param {String|Number} [req.query.minPrice] - Minimum price filter.
 * @param {String|Number} [req.query.maxPrice] - Maximum price filter.
 * @param {String} [req.query.availability] - 'inStock' or 'outOfStock' filter.
 * @param {String} [req.query.page=1] - Pagination page.
 * @param {String} [req.query.limit=10] - Pagination limit.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with filtered books and pagination details.
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
    console.error("Search Books Error:", error);
    const err = new Error("An unexpected server error occurred while searching for books. Please try again later.");
    err.statusCode = 500;
    next(err);
  }
};

/**
 * Retrieves a single book by its MongoDB ObjectId.
 * GET /books/:id
 * 
 * @param {Object} req - The Express request object containing the book ID in params.
 * @param {String} req.params.id - The unique MongoDB ObjectId of the book.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with the book object.
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
    console.error("Get Book By ID Error:", error);
    const err = new Error("An unexpected server error occurred while retrieving the book details. Please try again later.");
    err.statusCode = 500;
    next(err);
  }
};

/**
 * Updates an existing book and creates an audit log of the changes.
 * PUT /books/:id
 * 
 * @param {Object} req - The Express request object containing updated fields in body.
 * @param {String} req.params.id - The ID of the book to update.
 * @param {Object} req.body - The fields to update (title, author, genre, price, stockQuantity, reorderLevel).
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with the updated book object.
 * 
 * @example
 * // Access Control: Manager/Admin only
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
    console.error("Update Book Error:", error);
    const err = new Error("An unexpected server error occurred while updating the book. Please try again later.");
    err.statusCode = 500;
    next(err);
  }
};

/**
 * Deletes a book from the system and generates an audit log.
 * DELETE /books/:id
 * 
 * @param {Object} req - The Express request object containing the book ID.
 * @param {String} req.params.id - The ID of the book to delete.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response confirming successful deletion.
 * 
 * @example
 * // Access Control: Manager/Admin only
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
    console.error("Delete Book Error:", error);
    const err = new Error("An unexpected server error occurred while deleting the book. Please try again later.");
    err.statusCode = 500;
    next(err);
  }
};
