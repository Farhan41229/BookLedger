# BookLedger - Backend Setup Guide

## Project Overview

BookLedger is a production-ready bookstore management system backend that acts as a single source of truth for inventory, sales, and customer data. It implements strict data integrity through MongoDB transactions, role-based access control, and comprehensive audit logging.

## Prerequisites

- Node.js (LTS version)
- MongoDB Atlas or MongoDB Server
- npm or yarn

## Installation & Setup

### 1. Install Dependencies

```bash
cd Server
npm install
```

### 2. Configure Environment Variables

Edit `config/config.env` and update the following:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGODB_URL=mongodb+srv://fahim_db_user:eCUs4juaZwdJgRmx@cluster1.znvfu7l.mongodb.net/?appName=Cluster1
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` in production!

### 3. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:4000`

### 4. Verify Setup

Check health endpoint:
```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "BookLedger API is running"
}
```

## Project Structure

```
Server/
├── models/              # Mongoose schemas
│   ├── bookModel.js
│   ├── userModel.js
│   ├── customerModel.js
│   ├── saleModel.js
│   └── auditLogModel.js
├── controller/          # Business logic
│   ├── userController.js
│   ├── bookController.js
│   ├── saleController.js
│   ├── inventoryController.js
│   └── adminController.js
├── routes/              # API endpoints
│   ├── userRoutes.js
│   ├── bookRoutes.js
│   ├── saleRoutes.js
│   ├── inventoryRoutes.js
│   └── adminRoutes.js
├── services/            # Reusable business logic
│   ├── authService.js           # JWT & password handling
│   ├── transactionService.js    # Checkout with transactions
│   ├── pricingService.js        # Dynamic pricing
│   └── auditService.js          # Audit logging
├── middlewares/         # Express middleware
│   ├── authMiddleware.js        # JWT authentication & RBAC
│   └── errorMiddleware.js       # Error handling
├── config/              # Configuration
│   └── config.env
├── Database/            # Database connection
│   └── db.js
├── app.js              # Express app setup
├── server.js           # Server entry point
├── package.json        # Dependencies
└── API_DOCUMENTATION.md # Full API reference
```

## Key Features

### 1. Transactional Checkout Engine
- MongoDB transactions ensure ACID compliance
- Atomic stock decrements
- Automatic customer point updates
- Rollback on any failure

### 2. Role-Based Access Control
- **Admin**: Full system access, user management, audit logs
- **Manager**: Inventory reports, pricing, book management
- **Cashier**: Sales processing, book search

### 3. Dynamic Pricing
- Automatic dead stock detection (90+ days without sale)
- 20% discount application
- Audit logging of all price changes

### 4. Comprehensive Audit Logging
- Every database mutation logged
- User action tracking
- Before/after value comparison
- Full audit trail for compliance

### 5. Advanced Book Search
- Case-insensitive title search
- Filter by: author, genre, ISBN, price range
- Stock availability filtering
- Indexed queries for performance

## API Quick Reference

### Authentication
```bash
# Login
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Books
```bash
# Search books
curl "http://localhost:4000/api/books/search?title=gatsby&minPrice=20&maxPrice=50"

# Create book (Manager/Admin only)
curl -X POST http://localhost:4000/api/books \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Book Title",
    "author":"Author Name",
    "isbn":"978-0-7432-7356-5",
    "price":29.99,
    "stockQuantity":50,
    "reorderLevel":10
  }'
```

### Sales & Checkout
```bash
# Create sale (checkout) - Uses transactions
curl -X POST http://localhost:4000/api/sales \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{"bookId":"book_id","quantity":2,"unitPrice":29.99}],
    "totalAmount":59.98,
    "customerId":"customer_id"
  }'
```

### Inventory
```bash
# Get reorder list
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:4000/api/inventory/reorder

# Get inventory status
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:4000/api/inventory/status
```

### Admin
```bash
# Apply dead stock pricing
curl -X POST http://localhost:4000/api/admin/pricing/apply-discount \
  -H "Authorization: Bearer TOKEN"

# Get audit logs
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:4000/api/admin/audit?targetCollection=Book&action=Update"
```

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Database Schema Overview

### Book
- Tracks: title, author, genre, ISBN, price, stock, reorder level
- Features: Discounted price support, last sold date tracking

### User (Employee)
- Roles: Admin, Manager, Cashier
- Passwords hashed with bcryptjs
- JWT authentication

### Customer
- Membership points system
- Reader score tracking
- Purchase history embedded

### Sale (Transaction)
- Header-detail pattern
- References to customer and cashier
- Item-level tracking
- Supports cancellation with stock restoration

### AuditLog
- Comprehensive mutation logging
- Before/after values
- Timestamp and performer tracking

## Security Best Practices

✅ **Implemented:**
- JWT token-based authentication (24h expiry)
- bcryptjs password hashing (10 salt rounds)
- Role-based access control middleware
- MongoDB transactions for data integrity
- Comprehensive audit logging
- Input validation at schema and controller levels
- CORS configuration
- HTTP-only cookies for sensitive data

⚠️ **For Production:**
1. Change JWT_SECRET in config.env
2. Use HTTPS only
3. Set CORS origin to your frontend domain
4. Enable MongoDB authentication
5. Regular database backups
6. Implement rate limiting
7. Use environment variables for all secrets
8. Enable MongoDB transactions (requires replica set)

## Testing the System

### 1. Create an Admin User (First Time Setup)

Since user registration is protected, you'll need to create the first admin directly in MongoDB:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "<bcrypt_hashed_password>",
  role: "Admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the API with a seeding script.

### 2. Login and Get Token
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@example.com",
    "password":"your_password"
  }'
```

### 3. Create Books
```bash
curl -X POST http://localhost:4000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Example Book",
    "author":"John Doe",
    "genre":"Fiction",
    "isbn":"978-1234567890",
    "price":29.99,
    "stockQuantity":100,
    "reorderLevel":20
  }'
```

### 4. Process a Sale
```bash
curl -X POST http://localhost:4000/api/sales \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{
      "bookId":"book_id_from_step_3",
      "quantity":2,
      "unitPrice":29.99
    }],
    "totalAmount":59.98
  }'
```

## Troubleshooting

### Database Connection Failed
- Verify MongoDB Atlas connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure MONGODB_URL is set in config.env

### JWT Errors
- Token may be expired (24h expiry)
- Login again to get a fresh token
- Include "Bearer " prefix in Authorization header

### Insufficient Stock Error (409)
- Book stock is below requested quantity
- Check available stock with GET /api/books/:id
- Review inventory with GET /api/inventory/status

### Access Denied (403)
- Check user role matches required role
- Verify Authorization header is included
- Request /api/users/me to check current user info

## Performance Considerations

- Book queries use indexed fields (title, ISBN)
- Pagination implemented on all list endpoints
- MongoDB transactions for multi-document consistency
- Efficient aggregation for reports

## Support & Documentation

- **API Docs**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Issues**: Check error messages and audit logs
- **Audit Trail**: Use `/api/admin/audit` to track changes

## License

ISC
