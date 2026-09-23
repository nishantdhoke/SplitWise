# FairShare — Full-Stack Expense Splitting Web Application

FairShare is a modern, responsive, and beginner-friendly expense-splitting web application (inspired by Splitwise). It allows groups of friends (e.g. flatmates, travel groups, colleagues) to record shared expenses, calculate exact net balances with zero floating-point rounding errors, and minimize the number of repayment transactions using a greedy debt simplification algorithm.

---

## Tech Stack

| Layer | Technology | Key Highlights |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | React Router, Modern CSS design system, Context API, responsive layout |
| **Backend** | Node.js + Express.js | Modular controllers, middleware guards, RESTful JSON API |
| **Database** | MySQL 8.0 | `mysql2/promise` connection pooling, ACID transactions, foreign key cascades |
| **Authentication** | JWT + bcryptjs | Salted password hashing (10 rounds), Bearer token authorization |
| **Currency** | Indian Rupee (₹) | Integer paise precision prevents fractional rounding discrepancies |

---

## Core Features

1. **User Authentication:** Secure registration and login with bcrypt password hashing and persistent JWT sessions.
2. **User Dashboard:** Global overview of total money you owe, total money you are owed, and net balance across all your groups.
3. **Group Management:** Create groups (*Goa Trip*, *Flat Expenses*), auto-enroll the creator, and invite registered friends by email.
4. **Group Authorization Guards:** Enforces router-level HTTP 403 checks to guarantee users cannot view groups they don't belong to.
5. **Expense Splitting (3 Methods):**
   - **Equal Split:** ₹1200 / 4 = ₹300 each (absorbs remainder paise so sum strictly equals total).
   - **Custom Amount:** Members enter exact values (backend validates sum === total).
   - **Percentage Split:** Members enter percentages (backend validates total === 100%).
6. **Net Balance Calculation:** Authoritatively calculates each member's net position ($+\text{₹}$ gets back, $-\text{₹}$ owes, or settled).
7. **Debt Minimization Algorithm ("Who Owes Whom"):** Uses a greedy two-pointer algorithm to minimize repayments ($N$ people settle in at most $N-1$ transactions).
8. **Settlements ("Mark as Paid"):** Record real-world offline repayments (cash, UPI, Google Pay), immediately recalculating balances.
9. **Activity Feed:** Chronological timeline tracking expenses, repayments, and member additions.

---

## Project Structure

```
expense-splitter/
├── client/                     # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── GroupCard.jsx
│   │   │   ├── MemberList.jsx
│   │   │   ├── AddMemberModal.jsx
│   │   │   ├── ExpenseCard.jsx
│   │   │   ├── AddExpenseModal.jsx
│   │   │   ├── ExpenseDetailsModal.jsx
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── SettlementList.jsx
│   │   │   ├── SettleUpModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/              # Main route views
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Groups.jsx
│   │   │   ├── CreateGroup.jsx
│   │   │   ├── GroupDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── StatusCheck.jsx
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── services/           # API fetch client (api.js)
│   │   ├── App.jsx             # Router and application layout
│   │   ├── index.css           # Clean CSS design system
│   │   └── main.jsx
│   ├── vite.config.js          # Dev proxy (/api -> http://localhost:5000)
│   └── package.json
│
├── server/                     # Backend Express REST API
│   ├── config/
│   │   └── db.js               # MySQL2 connection pool with auto-creation
│   ├── controllers/            # Route handlers
│   │   ├── authController.js
│   │   ├── groupController.js
│   │   ├── expenseController.js
│   │   ├── balanceController.js
│   │   ├── settlementController.js
│   │   ├── dashboardController.js
│   │   ├── activityController.js
│   │   └── healthController.js
│   ├── middleware/             # Security & authorization
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── groupMiddleware.js  # Group membership check
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/                 # Parameterized SQL models
│   │   ├── userModel.js
│   │   ├── groupModel.js
│   │   ├── expenseModel.js
│   │   └── settlementModel.js
│   ├── services/               # Business & financial algorithms
│   │   ├── splitService.js     # Paise-precision math (Equal, Custom, Pct)
│   │   └── balanceService.js   # Net balances & greedy debt simplifier
│   ├── scripts/
│   │   ├── initDb.js           # Automated MySQL table schema initializer
│   │   └── testSuite.js        # 10-point automated integration test suite
│   ├── utils/
│   │   └── jwt.js              # Token signing & verification
│   ├── .env                    # Environment variables
│   ├── .env.example
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── database/
│   └── schema.sql              # Relational schema reference
├── .env.example
└── README.md
```

---

## Database Architecture

FairShare uses 6 normalized relational tables in MySQL (`fairshare_db`):

1. **`users`**: User accounts with unique emails and 60-character bcrypt password hashes.
2. **`groups`**: Expense groups created by users.
3. **`group_members`**: Junction table mapping users to groups with a composite primary key `(group_id, user_id)`.
4. **`expenses`**: Shared bills storing `title`, `amount` (DECIMAL 12,2), `paid_by`, `split_method`, and `expense_date`.
5. **`expense_participants`**: Exact share owed by each participating friend per expense.
6. **`settlements`**: Repayments between a debtor (`payer_id`) and creditor (`receiver_id`).

All foreign keys use `ON DELETE CASCADE` to prevent orphaned records.

---

## Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server (v8.0+) running locally on port 3306

### 2. Backend Setup
```bash
cd server

# Copy environment template if needed
cp .env.example .env

# Set your MySQL root password in .env:
# DB_PASSWORD=your_password

# Install backend dependencies
npm install

# Initialize database and tables in MySQL
npm run db:init

# Start backend server
npm run dev    # Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client

# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev    # Client runs on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## REST API Reference

All protected endpoints require the header: `Authorization: Bearer <your_jwt_token>`.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create user account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in and obtain JWT (`email`, `password`)
- `GET /api/auth/me` — Get current logged-in user profile (protected)
- `GET /api/auth/search?q=query` — Search users by email/name (protected)

### Groups (`/api/groups`)
- `GET /api/groups` — List groups current user belongs to
- `POST /api/groups` — Create a new group (`name`)
- `GET /api/groups/:groupId` — Get group details and member list
- `POST /api/groups/:groupId/members` — Add member by email (`email`)
- `DELETE /api/groups/:groupId/members/:userId` — Remove member (creator or self)
- `DELETE /api/groups/:groupId` — Delete group (creator only)

### Expenses (`/api/groups/:groupId/expenses` & `/api/expenses`)
- `GET /api/groups/:groupId/expenses` — List all expenses in group
- `POST /api/groups/:groupId/expenses` — Record an expense (`title`, `amount`, `paid_by`, `split_method`, `expense_date`, `participants`)
- `GET /api/expenses/:expenseId` — View detailed split breakdown
- `DELETE /api/expenses/:expenseId` — Delete expense (payer or group creator)

### Balances & Settlements (`/api/groups/:groupId`)
- `GET /api/groups/:groupId/balances` — Get member net balances and suggested repayments
- `POST /api/groups/:groupId/settlements` — Record payment (`payer_id`, `receiver_id`, `amount`)
- `GET /api/groups/:groupId/settlements` — Get past settlement history

### Dashboard & Activity
- `GET /api/dashboard` — Overall totals owed, owed to you, net standing, and recent expenses
- `GET /api/groups/:groupId/activity` — Chronological group event feed

---

## Running the Automated Test Suite

We have provided a comprehensive 10-point test suite validating all functional and security requirements.

To run it:
```bash
cd server
npm run test:suite
```

Output:
```
🧪 Starting FairShare Comprehensive Test Suite
✅ PASS: 1. Equal Split (₹1200 split 4 ways = ₹300 each)
✅ PASS: 2. Custom Split (Custom amounts match exact sum ₹1000)
✅ PASS: 3. Percentage Split (40%/30%/20%/10% of ₹2000 calculated accurately)
✅ PASS: 4. Multiple People Paying (Expenses paid by Ronak, Rahul, and Amit recorded)
✅ PASS: 5. One Person Owing Multiple People (Sahil net balance: -₹700)
✅ PASS: 6. Multiple People Owing One Person (Ronak gets back +₹1600)
✅ PASS: 7. Settling a Debt (Sahil settled ₹700 with Ronak)
✅ PASS: 8. Deleting an Expense (Expense deleted and cascading removal confirmed)
✅ PASS: 9. Invalid Split Totals (Rejected mismatched custom sums and non-100% percentages)
✅ PASS: 10. Unauthorized Cross-Group Access (HTTP 403 Forbidden returned for non-member)
📊 Test Summary: 10/10 Tests Passed
```
