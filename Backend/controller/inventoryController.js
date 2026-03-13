import { Book } from "../models/bookModel.js";

/**
 * Retrieves a paginated list of all books whose stock quantity has fallen below their specific reorder level.
 * GET /inventory/reorder
 * 
 * @param {Object} req - The Express request object containing pagination query params.
 * @param {String} [req.query.page=1] - The page number to retrieve.
 * @param {String} [req.query.limit=10] - Number of items per page.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response with the list of books needing reorder and the calculated quantity needed.
 */
export const getReorderList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reorderBooks = await Book.find({
      $expr: { $lt: ["$stockQuantity", "$reorderLevel"] },
    })
      .skip(skip)
      .limit(limit)
      .sort({ stockQuantity: 1 });

    const total = await Book.countDocuments({
      $expr: { $lt: ["$stockQuantity", "$reorderLevel"] },
    });

    // Calculate quantities needed
    const reorderData = reorderBooks.map((book) => ({
      ...book.toObject(),
      quantityNeeded: book.reorderLevel - book.stockQuantity,
    }));

    res.status(200).json({
      success: true,
      message: `Found ${total} books requiring reorder`,
      books: reorderData,
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
 * Retrieves a high-level summary of the entire bookstore inventory status.
 * GET /inventory/status
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response containing counts for total, in-stock, out-of-stock, below-reorder books, and the total monetary value of the inventory.
 */
export const getInventoryStatus = async (req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments();
    const inStockBooks = await Book.countDocuments({ stockQuantity: { $gt: 0 } });
    const outOfStockBooks = await Book.countDocuments({ stockQuantity: 0 });
    const belowReorderBooks = await Book.countDocuments({
      $expr: { $lt: ["$stockQuantity", "$reorderLevel"] },
    });

    const totalValue = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalInventoryValue: {
            $sum: { $multiply: ["$price", "$stockQuantity"] },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      inventory: {
        totalBooks,
        inStockBooks,
        outOfStockBooks,
        belowReorderBooks,
        totalInventoryValue: totalValue[0]?.totalInventoryValue || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a paginated list of books with stock quantity below a specified custom threshold.
 * GET /inventory/low-stock
 * 
 * @param {Object} req - The Express request object containing query params.
 * @param {String} [req.query.page=1] - The page number to retrieve.
 * @param {String} [req.query.limit=10] - Number of items per page.
 * @param {String|Number} [req.query.threshold=10] - The stock threshold to check against.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response containing the low-stock books.
 */
export const getLowStockBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const threshold = parseInt(req.query.threshold) || 10;

    const books = await Book.find({ stockQuantity: { $lte: threshold } })
      .skip(skip)
      .limit(limit)
      .sort({ stockQuantity: 1 });

    const total = await Book.countDocuments({
      stockQuantity: { $lte: threshold },
    });

    res.status(200).json({
      success: true,
      books,
      threshold,
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
 * Generates a comprehensive inventory report calculating various metrics.
 * GET /inventory/report
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function for error handling.
 * @returns {Promise<void>} Sends a JSON response containing the full report and the analyzed book data.
 */
export const getInventoryReport = async (req, res, next) => {
  try {
    const books = await Book.find().select(
      "title author isbn price stockQuantity reorderLevel"
    );

    const report = {
      totalBooks: books.length,
      totalUnitsInStock: books.reduce(
        (sum, book) => sum + book.stockQuantity,
        0
      ),
      totalInventoryValue: books.reduce(
        (sum, book) => sum + book.price * book.stockQuantity,
        0
      ),
      averageStockPerBook:
        books.reduce((sum, book) => sum + book.stockQuantity, 0) /
        books.length,
      booksBelowReorder: books.filter(
        (book) => book.stockQuantity < book.reorderLevel
      ).length,
      outOfStockBooks: books.filter((book) => book.stockQuantity === 0).length,
    };

    res.status(200).json({
      success: true,
      report,
      books,
    });
  } catch (error) {
    next(error);
  }
};
