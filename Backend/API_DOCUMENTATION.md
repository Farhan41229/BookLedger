# BookLedger API Documentation

## Overview
BookLedger is a data-centric bookstore management system backend with role-based access control, transactional integrity, and comprehensive audit logging.

## Tech Stack
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for Authentication
- bcryptjs for Password Hashing
- MongoDB Transactions for Data Integrity

## Project Structure
```
Server/
├── models/
│   ├── bookModel.js
│   ├── userModel.js
│   ├── customerModel.js
│   ├── saleModel.js
│   └── auditLogModel.js
├── controller/
│   ├── userController.js
│   ├── bookController.js
│   ├── saleController.js
│   ├── inventoryController.js
│   └── adminController.js
├── routes/
│   ├── userRoutes.js
│   ├── bookRoutes.js
│   ├── saleRoutes.js
│   ├── inventoryRoutes.js
│   └── adminRoutes.js
├── services/
│   ├── authService.js
│   ├── auditService.js
│   ├── pricingService.js
│   └── transactionService.js
├── middlewares/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── config/
│   └── config.env
└── app.js, server.js
```

## Authentication

### Login
**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Admin"
  }
}
```

**Token Usage:**
Include in Authorization header: `Authorization: Bearer <token>`

## User Management (Admin Only)

### Register User
**Endpoint:** `POST /api/users/register`
**Auth:** Required (Admin only)

**Request Body:**
```json
{
  "name": "Jane Manager",
  "email": "manager@example.com",
  "password": "securepass123",
  "role": "Manager"
}
```

**Roles:** Admin, Manager, Cashier

### Get All Users
**Endpoint:** `GET /api/users?page=1&limit=10`
**Auth:** Required (Admin only)

### Get User by ID
**Endpoint:** `GET /api/users/:id`
**Auth:** Required

### Update User
**Endpoint:** `PUT /api/users/:id`
**Auth:** Required (Admin only)

### Delete User
**Endpoint:** `DELETE /api/users/:id`
**Auth:** Required (Admin only)

## Book Management

### Create Book
**Endpoint:** `POST /api/books`
**Auth:** Required (Manager/Admin only)

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "isbn": "978-0-7432-7356-5",
  "price": 29.99,
  "stockQuantity": 50,
  "reorderLevel": 10
}
```

### Get All Books
**Endpoint:** `GET /api/books?page=1&limit=10`
**Auth:** Not required

### Search Books
**Endpoint:** `GET /api/books/search?title=gatsby&minPrice=20&maxPrice=50&availability=inStock`
**Auth:** Not required

**Query Parameters:**
- `title`: Partial, case-insensitive search
- `author`: Exact match
- `genre`: Exact match
- `isbn`: Exact match
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `availability`: `inStock` or `outOfStock`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Get Book by ID
**Endpoint:** `GET /api/books/:id`
**Auth:** Not required

### Update Book
**Endpoint:** `PUT /api/books/:id`
**Auth:** Required (Manager/Admin only)

### Delete Book
**Endpoint:** `DELETE /api/books/:id`
**Auth:** Required (Manager/Admin only)

## Sales & Checkout

### Create Sale (Checkout)
**Endpoint:** `POST /api/sales`
**Auth:** Required (Cashier/Manager/Admin)

**Request Body:**
```json
{
  "customerId": "customer_id_or_null",
  "cashierId": "current_user_id",
  "items": [
    {
      "bookId": "book_id_1",
      "quantity": 2,
      "unitPrice": 29.99
    },
    {
      "bookId": "book_id_2",
      "quantity": 1,
      "unitPrice": 19.99
    }
  ],
  "totalAmount": 79.97
}
```

**Features:**
- Uses MongoDB transactions for data integrity
- Decrements stock quantities atomically
- Updates customer membership points: `floor(totalAmount / 100)`
- Updates customer reader score: `number of distinct books purchased`
- Creates audit logs for all changes
- Returns 409 Conflict if insufficient stock

**Response:**
```json
{
  "success": true,
  "message": "Checkout completed successfully",
  "sale": {
    "_id": "sale_id",
    "customerId": "customer_id",
    "cashierId": "user_id",
    "totalAmount": 79.97,
    "items": [...],
    "status": "Completed",
    "createdAt": "2024-02-08T10:30:00Z"
  }
}
```

### Get All Sales
**Endpoint:** `GET /api/sales?page=1&limit=10`
**Auth:** Required (Manager/Admin only)

### Get Sale by ID
**Endpoint:** `GET /api/sales/:id`
**Auth:** Required (Manager/Admin/Cashier)

### Get Sales by Customer
**Endpoint:** `GET /api/sales/customer/:customerId?page=1&limit=10`
**Auth:** Required (Manager/Admin only)

### Get Sales Report
**Endpoint:** `GET /api/sales/reports/summary?startDate=2024-01-01&endDate=2024-02-08`
**Auth:** Required (Manager/Admin only)

**Response:**
```json
{
  "success": true,
  "report": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-02-08"
    },
    "summary": {
      "totalRevenue": 5000.00,
      "totalTransactions": 45,
      "avgTransactionValue": 111.11
    },
    "booksSold": {
      "The Great Gatsby": 12,
      "1984": 8
    }
  }
}
```

### Cancel Sale
**Endpoint:** `DELETE /api/sales/:id`
**Auth:** Required (Admin only)
**Effect:** Restores stock quantities

## Inventory Management

### Get Reorder List
**Endpoint:** `GET /api/inventory/reorder?page=1&limit=10`
**Auth:** Required (Manager/Admin only)

**Returns:** All books where `stockQuantity < reorderLevel`

### Get Inventory Status
**Endpoint:** `GET /api/inventory/status`
**Auth:** Required (Manager/Admin only)

**Response:**
```json
{
  "success": true,
  "inventory": {
    "totalBooks": 150,
    "inStockBooks": 145,
    "outOfStockBooks": 5,
    "belowReorderBooks": 8,
    "totalInventoryValue": 25000.00
  }
}
```

### Get Low Stock Books
**Endpoint:** `GET /api/inventory/low-stock?threshold=10&page=1&limit=10`
**Auth:** Required (Manager/Admin only)

### Get Inventory Report
**Endpoint:** `GET /api/inventory/report`
**Auth:** Required (Manager/Admin only)

## Dynamic Pricing (Admin/Manager Only)

### Apply Dead Stock Discount
**Endpoint:** `POST /api/admin/pricing/apply-discount`
**Auth:** Required (Manager/Admin only)

**Logic:**
- Dead stock: `currentDate - lastSoldDate > 90 days`
- Discount: 20% off original price
- Creates audit log for each price change

**Response:**
```json
{
  "success": true,
  "message": "Applied dead stock discount to 5 books",
  "updates": [
    {
      "bookId": "book_id",
      "title": "Book Title",
      "originalPrice": 29.99,
      "discountedPrice": 23.99,
      "discountApplied": 20
    }
  ]
}
```

### Clear Discounts
**Endpoint:** `POST /api/admin/pricing/clear-discount`
**Auth:** Required (Manager/Admin only)

## Audit Logging (Admin Only)

### Get Audit Logs
**Endpoint:** `GET /api/admin/audit?page=1&limit=50&targetCollection=Book&action=Update`
**Auth:** Required (Admin only)

**Query Parameters:**
- `targetCollection`: Book, User, Sale, Customer
- `action`: Insert, Update, Delete
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "_id": "log_id",
      "targetCollection": "Book",
      "action": "Update",
      "performedBy": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Admin"
      },
      "beforeValue": {
        "price": 29.99,
        "stockQuantity": 50
      },
      "afterValue": {
        "price": 23.99,
        "stockQuantity": 48
      },
      "timestamp": "2024-02-08T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 250,
    "page": 1,
    "limit": 50,
    "pages": 5
  }
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["error1", "error2"]
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., insufficient stock)
- `500` - Internal Server Error

## Role-Based Access Control

| Endpoint | Cashier | Manager | Admin |
|----------|---------|---------|-------|
| Login | ✓ | ✓ | ✓ |
| Create Sale | ✓ | ✓ | ✓ |
| View Books | ✓ | ✓ | ✓ |
| Manage Books | ✗ | ✓ | ✓ |
| Inventory Reports | ✗ | ✓ | ✓ |
| Pricing Management | ✗ | ✓ | ✓ |
| User Management | ✗ | ✗ | ✓ |
| Audit Logs | ✗ | ✗ | ✓ |

## Database Models

### Book Schema
```javascript
{
  title: String (required, indexed),
  author: String (required),
  genre: String,
  isbn: String (required, unique),
  price: Number (required, min: 0),
  discountedPrice: Number (nullable),
  stockQuantity: Number (required, integer, min: 0),
  reorderLevel: Number (required, integer, min: 0),
  lastSoldDate: Date (nullable),
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum (Admin, Manager, Cashier),
  createdAt: Date,
  updatedAt: Date
}
```

### Customer Schema
```javascript
{
  name: String (required),
  membershipPts: Number (default: 0),
  readerScore: Number (default: 0),
  purchaseHistory: [
    {
      saleId: ObjectId (ref: Sale),
      totalAmount: Number,
      purchaseDate: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Sale Schema
```javascript
{
  customerId: ObjectId (ref: Customer, optional),
  cashierId: ObjectId (ref: User, required),
  totalAmount: Number (required),
  items: [
    {
      bookId: ObjectId (ref: Book),
      quantity: Number (min: 1),
      unitPrice: Number
    }
  ],
  status: Enum (Completed, Pending, Cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLog Schema
```javascript
{
  targetCollection: String (required),
  action: Enum (Insert, Update, Delete),
  performedBy: ObjectId (ref: User, required),
  beforeValue: Mixed,
  afterValue: Mixed,
  targetId: ObjectId,
  timestamp: Date (default: now)
}
```

## Security Features

1. **JWT Authentication** - Token-based authentication with 24-hour expiry
2. **Password Hashing** - bcryptjs with 10 salt rounds
3. **Role-Based Access Control** - Middleware enforces role requirements
4. **MongoDB Transactions** - Ensures data consistency in complex operations
5. **Audit Logging** - Every sensitive mutation is logged
6. **Input Validation** - Schema-level and controller-level validation
7. **Error Handling** - Comprehensive error messages without exposing internals

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set environment variables in `config/config.env`:
```
PORT=4000
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

4. Health check:
```bash
curl http://localhost:4000/api/health
```

## Example Workflows

### Complete Checkout Workflow
1. Customer browses books: `GET /api/books/search`
2. Cashier initiates checkout: `POST /api/sales` (transactional)
3. Stock decremented, customer points updated
4. Audit logs created automatically

### Inventory Management Workflow
1. Manager checks reorder list: `GET /api/inventory/reorder`
2. Manager views detailed report: `GET /api/inventory/report`
3. System applies dead stock pricing: `POST /api/admin/pricing/apply-discount`
4. All changes audited and logged

### User Management Workflow
1. Admin registers new user: `POST /api/users/register`
2. User logs in: `POST /api/users/login`
3. Token used for authenticated requests
4. Admin can audit user actions: `GET /api/admin/audit`
