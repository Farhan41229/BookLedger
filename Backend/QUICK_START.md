# 🚀 BookLedger Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
cd Server
npm install
```

### Step 2: Seed Database (1 min)
```bash
node seed.js
```
✅ Creates sample users and books
✅ Ready to test immediately

### Step 3: Start Server (1 min)
```bash
npm run dev
```
✅ Server running on http://localhost:4000

### Step 4: Test Health (30 sec)
```bash
curl http://localhost:4000/api/health
```

### Step 5: Login & Get Started (1.5 min)
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq -r '.token')

# Search books
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/api/books/search?title=gatsby"
```

---

## 📖 Sample Credentials

After seeding, use these to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Manager | manager@example.com | manager123 |
| Cashier | cashier@example.com | cashier123 |

---

## 🔥 Most Important Endpoints

### 1. Login
```bash
POST /api/users/login
{"email":"admin@example.com","password":"admin123"}
```
Returns: JWT token

### 2. Search Books
```bash
GET /api/books/search?title=gatsby
```
No auth required. Works as guest user.

### 3. Create Sale (Checkout)
```bash
POST /api/sales
Authorization: Bearer TOKEN
{
  "items":[{"bookId":"book_id","quantity":2,"unitPrice":29.99}],
  "totalAmount":59.98
}
```
⚠️ This uses MongoDB transactions!

### 4. Get Inventory Status
```bash
GET /api/inventory/status
Authorization: Bearer TOKEN
```

### 5. Get Audit Logs
```bash
GET /api/admin/audit
Authorization: Bearer TOKEN (Admin only)
```

---

## 📚 What's Available

### 25+ Endpoints Across 5 Categories:

**Users (6)**
- Login, Register, List, View, Update, Delete

**Books (6)**
- Create, Read, Search, Update, Delete, List

**Sales (6)**
- Checkout, List, View, By Customer, Reports, Cancel

**Inventory (4)**
- Reorder List, Status, Low Stock, Report

**Admin (3)**
- Apply Pricing, Clear Discounts, Audit Logs

---

## 🔐 Key Security Features

✅ **JWT Authentication**
- Token: `Authorization: Bearer TOKEN`
- Expiry: 24 hours

✅ **Role-Based Access**
- Admin: Full access
- Manager: Inventory & pricing
- Cashier: Sales only

✅ **Password Security**
- Hashed with bcryptjs
- 10 salt rounds

---

## 💡 Transaction Example

Complete checkout with automatic stock management:

```bash
# 1. Get a book ID
BOOK_ID=$(curl -s "http://localhost:4000/api/books" | jq -r '.books[0]._id')

# 2. Perform checkout (uses transactions!)
curl -X POST http://localhost:4000/api/sales \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"items\":[{
      \"bookId\":\"$BOOK_ID\",
      \"quantity\":2,
      \"unitPrice\":29.99
    }],
    \"totalAmount\":59.98
  }"
```

✅ Stock decremented atomically
✅ Customer points updated
✅ Audit log created
✅ Rollback if any error

---

## 🎯 What Each Role Can Do

### 👨‍💼 Cashier
- ✅ Login
- ✅ Search books
- ✅ Process sales (POST /sales)
- ✅ View own sales
- ❌ Manage inventory
- ❌ See audit logs

### 👨‍🔧 Manager
- ✅ Everything Cashier can do
- ✅ Manage books (CRUD)
- ✅ View inventory reports
- ✅ Apply dead stock pricing
- ✅ View all sales
- ❌ Manage users
- ❌ See audit logs

### 👨‍💻 Admin
- ✅ Everything Manager can do
- ✅ Manage users (CRUD)
- ✅ View audit logs
- ✅ Cancel sales
- ✅ Clear discounts

---

## 📊 Feature Examples

### 1. Dynamic Pricing (Dead Stock)
```bash
# Apply 20% discount to unsold books (90+ days)
curl -X POST http://localhost:4000/api/admin/pricing/apply-discount \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Inventory Report
```bash
# Get complete inventory analysis
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/inventory/report
```

### 3. Sales Report
```bash
# Get revenue summary for date range
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/api/sales/reports/summary?startDate=2024-01-01&endDate=2024-02-08"
```

### 4. Audit Trail
```bash
# See all changes to books
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:4000/api/admin/audit?targetCollection=Book"
```

---

## 📋 Verification & Troubleshooting

### Verify Setup
```bash
node verify.js
```
Checks all files, config, and dependencies.

### If Connection Fails
1. Check MongoDB Atlas connection string in `config/config.env`
2. Verify IP whitelist in MongoDB Atlas
3. Ensure cluster is running

### If Token Expires
```bash
# Login again to get fresh token
curl -X POST http://localhost:4000/api/users/login ...
```

### If Stock Error Occurs
```bash
# Check current stock
curl "http://localhost:4000/api/books/search?availability=inStock"
```

---

## 🎓 Learning Path

1. **Start Here**: README.md
2. **Explore API**: API_DOCUMENTATION.md
3. **Understand Setup**: SETUP_GUIDE.md
4. **Deep Dive**: IMPLEMENTATION_SUMMARY.md

---

## 💻 Common Tasks

### Create a New Book
```bash
curl -X POST http://localhost:4000/api/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"New Book",
    "author":"Author Name",
    "isbn":"978-1234567890",
    "price":29.99,
    "stockQuantity":100,
    "reorderLevel":20
  }'
```

### Register New User
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Jane Manager",
    "email":"manager@example.com",
    "password":"securepass123",
    "role":"Manager"
  }'
```

### Get Books Below Reorder Level
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/inventory/reorder
```

### Cancel a Sale
```bash
curl -X DELETE http://localhost:4000/api/sales/SALE_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 🌟 Special Features

### 🔄 Transactional Checkout
- Uses MongoDB transactions
- Guarantees ACID compliance
- Atomic stock management
- Automatic rollback on error

### 🏷️ Smart Pricing
- Detects dead stock (90+ days)
- Applies 20% discount automatically
- Logs all price changes
- Easy to manage

### 📊 Customer Intelligence
- Tracks membership points
- Calculates reader scores
- Records purchase history
- Enables personalization

### 📝 Complete Audit Trail
- Logs every database change
- Records before/after values
- Tracks who made changes
- Full compliance support

---

## 🚀 Next Steps

### For Testing
1. ✅ Run `npm run dev`
2. ✅ Test endpoints with provided examples
3. ✅ Try different roles (admin, manager, cashier)
4. ✅ View audit logs to see changes

### For Integration
1. Save the JWT token
2. Include in `Authorization: Bearer TOKEN` header
3. Handle error responses
4. Implement frontend features

### For Deployment
1. Change JWT_SECRET
2. Set production MONGODB_URL
3. Update FRONTEND_URL
4. Enable HTTPS
5. Configure monitoring

---

## 📞 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Overview and quick start |
| **API_DOCUMENTATION.md** | Complete endpoint reference |
| **SETUP_GUIDE.md** | Installation and troubleshooting |
| **IMPLEMENTATION_SUMMARY.md** | Technical architecture |
| **CHECKLIST.md** | Implementation status |
| **PROJECT_COMPLETION.md** | Project overview |

---

## ✨ Everything Is Ready

✅ All 5 models implemented
✅ All 25+ endpoints created
✅ Complete authentication working
✅ Transactions functioning
✅ Audit logging active
✅ Documentation complete
✅ Sample data included
✅ Ready to integrate!

---

## 🎯 Common Mistakes to Avoid

❌ **Don't forget Authorization header**
```bash
# ❌ Wrong
curl http://localhost:4000/api/sales

# ✅ Correct
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/sales
```

❌ **Don't hardcode JWT_SECRET**
- ✅ Always use environment variable

❌ **Don't ignore transaction errors**
- ✅ 409 Conflict means insufficient stock

❌ **Don't forget to seed database**
- ✅ Run `node seed.js` first

---

## 📈 Performance Tips

- Book search uses indexes (title, ISBN)
- Pagination on all list endpoints
- MongoDB transactions for consistency
- Efficient aggregation for reports
- Connection pooling ready

---

## 🔗 Integration Points

Backend provides complete REST API for:
- ✅ React/Vue/Angular frontend
- ✅ Mobile apps
- ✅ Admin dashboards
- ✅ Third-party integrations

Just use the documented endpoints!

---

**Status: ✅ PRODUCTION READY**

Start building your frontend with confidence! 🚀
