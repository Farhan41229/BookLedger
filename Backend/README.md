# 📚 BookLedger - Bookstore Management System Backend

> A production-ready, data-centric bookstore management system with transactional integrity, role-based access control, and comprehensive audit logging.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Seed database with sample data
node seed.js

# 3. Start development server
npm run dev

# 4. Verify everything works
curl http://localhost:4000/api/health
```

## 📋 Overview

BookLedger is a complete backend solution for managing bookstore operations including:

- **📦 Inventory Management** - Track stock, reorder levels, and dead stock
- **💳 Sales Processing** - Transactional checkout with ACID compliance
- **👥 Customer Management** - Membership points, purchase history, reader scores
- **💰 Dynamic Pricing** - Automatic dead stock discounting (90+ days)
- **🔐 Security** - JWT authentication, role-based access control, password hashing
- **📊 Reporting** - Sales reports, inventory analysis, audit trails
- **🔍 Advanced Search** - Filter books by title, author, genre, price, availability
- **✅ Audit Logging** - Complete mutation tracking for compliance

## 📁 Project Structure

```
Server/
├── models/              # Mongoose schemas (5 models)
├── controller/          # Business logic (5 controllers, 25+ endpoints)
├── routes/             # API endpoints (5 route files)
├── services/           # Reusable logic (4 services)
├── middlewares/        # Auth, error handling (2 middleware)
├── config/             # Environment configuration
├── Database/           # DB connection
├── app.js              # Express app setup
├── server.js           # Server entry point
├── seed.js             # Sample data seeding
├── verify.js           # Configuration verification
├── package.json        # Dependencies
├── API_DOCUMENTATION.md    # Complete API reference
├── SETUP_GUIDE.md          # Installation guide
└── IMPLEMENTATION_SUMMARY.md # Technical details
```

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

**Login to get a token:**
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **Admin** | Full access, user management, audit logs, pricing |
| **Manager** | Inventory reports, pricing, book management |
| **Cashier** | Create sales, view books, search |

## 🛍️ Key Features

### Transactional Checkout
```bash
POST /api/sales
Authorization: Bearer TOKEN

{
  "items": [
    {"bookId": "id", "quantity": 2, "unitPrice": 29.99}
  ],
  "totalAmount": 59.98,
  "customerId": "optional_customer_id"
}
```

- Uses MongoDB transactions for ACID compliance
- Atomic stock decrements
- Automatic customer point updates
- Rollback on any failure

### Advanced Book Search
```bash
GET /api/books/search?title=gatsby&minPrice=20&maxPrice=50&availability=inStock
```

Filters: title (partial, case-insensitive), author, genre, ISBN, price range, availability

### Inventory Management
```bash
GET /api/inventory/reorder      # Books below reorder level
GET /api/inventory/status       # Summary statistics
GET /api/inventory/low-stock    # Low stock threshold
GET /api/inventory/report       # Complete analysis
```

### Dynamic Pricing
```bash
POST /api/admin/pricing/apply-discount
```

- Detects dead stock: lastSoldDate > 90 days ago
- Applies 20% discount automatically
- Creates audit log for each change

### Sales Reporting
```bash
GET /api/sales/reports/summary?startDate=2024-01-01&endDate=2024-02-08
```

Returns: total revenue, transaction count, average value, books sold

### Audit Logs
```bash
GET /api/admin/audit?targetCollection=Book&action=Update
```

Complete tracking of all mutations with before/after values

## 🗄️ Database Models

### Book
```javascript
{
  title: String,           // Indexed for search
  author: String,
  genre: String,
  isbn: String,           // Unique
  price: Number,
  discountedPrice: Number, // Dead stock pricing
  stockQuantity: Number,
  reorderLevel: Number,
  lastSoldDate: Date      // For dead stock detection
}
```

### User (Employee)
```javascript
{
  name: String,
  email: String,          // Unique
  password: String,       // Hashed with bcryptjs
  role: String           // Admin, Manager, or Cashier
}
```

### Customer
```javascript
{
  name: String,
  membershipPts: Number,  // Earned from purchases
  readerScore: Number,    // Based on books purchased
  purchaseHistory: [
    { saleId, totalAmount, purchaseDate }
  ]
}
```

### Sale
```javascript
{
  customerId: ObjectId,   // Optional (guest purchases)
  cashierId: ObjectId,
  totalAmount: Number,
  items: [
    { bookId, quantity, unitPrice }
  ],
  status: String         // Completed, Pending, Cancelled
}
```

### AuditLog
```javascript
{
  targetCollection: String,
  action: String,        // Insert, Update, Delete
  performedBy: ObjectId,
  beforeValue: Object,
  afterValue: Object,
  timestamp: Date
}
```

## 🔧 Configuration

Edit `config/config.env`:

```env
PORT=4000
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

⚠️ **For production**: Change JWT_SECRET to a strong, random value

## 📚 API Endpoints

### Users
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/users/login` | - | - |
| POST | `/api/users/register` | Yes | Admin |
| GET | `/api/users` | Yes | Admin |
| GET | `/api/users/:id` | Yes | - |
| PUT | `/api/users/:id` | Yes | Admin |
| DELETE | `/api/users/:id` | Yes | Admin |

### Books
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/api/books` | - | - |
| GET | `/api/books/search` | - | - |
| GET | `/api/books/:id` | - | - |
| POST | `/api/books` | Yes | Manager/Admin |
| PUT | `/api/books/:id` | Yes | Manager/Admin |
| DELETE | `/api/books/:id` | Yes | Manager/Admin |

### Sales
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/sales` | Yes | Cashier/Manager/Admin |
| GET | `/api/sales` | Yes | Manager/Admin |
| GET | `/api/sales/:id` | Yes | Manager/Admin/Cashier |
| GET | `/api/sales/customer/:id` | Yes | Manager/Admin |
| GET | `/api/sales/reports/summary` | Yes | Manager/Admin |
| DELETE | `/api/sales/:id` | Yes | Admin |

### Inventory
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/api/inventory/reorder` | Yes | Manager/Admin |
| GET | `/api/inventory/status` | Yes | Manager/Admin |
| GET | `/api/inventory/low-stock` | Yes | Manager/Admin |
| GET | `/api/inventory/report` | Yes | Manager/Admin |

### Admin
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/admin/pricing/apply-discount` | Yes | Manager/Admin |
| POST | `/api/admin/pricing/clear-discount` | Yes | Manager/Admin |
| GET | `/api/admin/audit` | Yes | Admin |

## 🧪 Testing

### Verify Setup
```bash
node verify.js
```

Checks all files, configuration, and dependencies

### Sample Data
```bash
node seed.js
```

Creates sample users (credentials printed):
- admin@example.com / admin123
- manager@example.com / manager123
- cashier@example.com / cashier123

Plus 6 sample books

### Manual Testing
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.token')

# 2. Search books
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/api/books/search?title=gatsby"

# 3. Create sale
curl -X POST http://localhost:4000/api/sales \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"bookId":"book_id","quantity":1,"unitPrice":29.99}],"totalAmount":29.99}'

# 4. Check inventory
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/inventory/status
```

## 🚨 Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["detailed", "errors"]
}
```

Status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation)
- `401` - Unauthorized (missing token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `409` - Conflict (e.g., insufficient stock)
- `500` - Server Error

## 🔒 Security Features

✅ **Implemented:**
- JWT authentication (24h expiry)
- bcryptjs password hashing (10 salt rounds)
- Role-based access control
- MongoDB transactions for data integrity
- Comprehensive audit logging
- Input validation at multiple layers
- CORS configuration
- Error handling without info leakage

## 📖 Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Installation, troubleshooting, performance tips
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details and architecture

## 📦 Dependencies

```json
{
  "express": "^5.2.1",
  "mongoose": "^9.1.5",
  "jsonwebtoken": "^9.1.2",
  "bcryptjs": "^2.4.3",
  "dotenv": "^17.2.3",
  "cors": "^2.8.6",
  "cookie-parser": "^1.4.7"
}
```

## 🚀 Deployment

### Production Checklist
- [ ] Change JWT_SECRET
- [ ] Set correct MONGODB_URL
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up MongoDB backups
- [ ] Enable MongoDB authentication
- [ ] Review CORS configuration
- [ ] Set NODE_ENV=production
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up logging
- [ ] Configure rate limiting

### Environment Variables
```bash
NODE_ENV=production
PORT=4000
MONGODB_URL=<production_url>
JWT_SECRET=<strong_random_key>
FRONTEND_URL=https://yourdomain.com
```

## 🤝 Contributing

Follow the established structure when adding features:
1. Create model in `models/`
2. Create service in `services/`
3. Create controller in `controller/`
4. Create routes in `routes/`
5. Mount routes in `app.js`
6. Update documentation

## 📄 License

ISC

## 🆘 Support

For issues or questions:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details
3. Check audit logs: `GET /api/admin/audit`
4. Verify configuration with: `node verify.js`

## 🎯 Status

✅ **Complete Implementation**
- All 5 Mongoose schemas implemented
- Transactional checkout engine functional
- Dynamic pricing system active
- RBAC middleware enforcing permissions
- Comprehensive audit logging
- 25+ API endpoints ready
- Production-ready error handling
- Full documentation provided

Ready for frontend integration and deployment! 🚀
