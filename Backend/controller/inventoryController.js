import { Book } from "../models/bookModel.js";

/**
 * Get reorder list (all books below reorder level)
 * GET /inventory/reorder
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
 * Get inventory status
 * GET /inventory/status
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
 * Get low stock books
 * GET /inventory/low-stock
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
 * Get inventory report
 * GET /inventory/report
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
