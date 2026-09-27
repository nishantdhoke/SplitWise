# Fair Split — Full-Stack Expense Splitting & Debt Minimization Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](#license)

**Fair Split** is a modern, high-performance expense-splitting web application designed for friends, flatmates, travel groups, and teams. Built with a futuristic **Deep Space / Cosmic visual design**, Fair Split removes the headache of shared expenses: it records group expenses, eliminates floating-point rounding errors using integer paise precision, provides integrated group chat for payment coordination, and optimizes repayments using a greedy debt simplification algorithm.

---

## Highlights & Features

### 🌌 Cosmic / Deep Space Experience
- **Interactive Starlight Canvas:** Dynamic, high-framerate starfield with drifting constellations and glowing nebulae.
- **Atmospheric Cyber Accents:** Celestial cyan, starlight violet, and pulsar amber visual indicators.
- **Glass & Stellar Panels:** Ultra-modern dark-mode ergonomics designed for readability across desktop and mobile.

### 💰 Smart Expense Splitting
- **Equal Split:** Divides the expense equally among selected participants, automatically absorbing remainder paise so the sum strictly equals the bill amount.
- **Exact / Custom Split:** Assign custom amounts per person. Includes an auto-fill helper that calculates the remaining balance for the last participant in real time.
- **Percentage Split:** Split by exact percentages with live conversion to ₹ currency and auto-fill for the remaining balance.
- **Zero Rounding Discrepancies:** All monetary values are handled with strict integer paise math to ensure pennies/paise never go missing.

### 🧠 Debt Minimization ("Who Owes Whom")
- **Greedy Two-Pointer Simplification:** Condenses complex multi-way debt webs into the minimum possible number of direct repayments. An $N$-member group settles in at most $N-1$ transactions.
- **Net Balance Calculation:** Instant visibility into your position across the group—clearly categorized into **You are owed**, **You owe**, or **All settled**.

### 💬 In-Group Member Chat
- **Embedded Group Discussions:** Coordinate shared bills, verify receipts, and talk payment methods without leaving the group view.
- **Persistent Chat History:** Stored securely in MySQL with sender badges, relative timestamps, and unread indicator counters.

### 🤝 Settlements & Payment Tracking
- **Offline Settlement Recording:** Track cash, UPI (Google Pay, PhonePe, Paytm), and bank transfers.
- **Receiver-Approved Flow:** Ensures settlement records are authorized and updates balances in real time.

### 🔗 Frictionless Member Invites
- **Direct Email Search:** Search and add registered members by email with immediate membership enrollment.
- **One-Click Invite Links:** Copy and share instant invitation links for friends to join the group directly.

---

## Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast HMR, React Router 6, Context API, responsive layout |
| **UI & Animations** | HTML5 Canvas + CSS3 | Deep-space starfield engine, particle bursts, animated counters |
| **Backend** | Node.js + Express.js | Modular MVC architecture, RESTful JSON API, middleware security guards |
| **Database** | MySQL 8.0+ | `mysql2/promise` connection pool, ACID transactions, cascading foreign keys |
| **Authentication** | JWT + bcryptjs | Salted password hashing (10 rounds), HTTP Bearer token verification |
| **Precision Math** | Custom Paise Engine | Decimal(12,2) with integer paise representation preventing rounding errors |

---

## Project Structure

```
expense-splitter/
├── client/                               # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── Navbar.jsx                # Responsive navbar with Fair Split branding
│   │   │   ├── CosmicBackground.jsx      # Canvas-based deep space starfield & nebulae
│   │   │   ├── CosmicParticleBurst.jsx   # Particle celebration effects on actions
│   │   │   ├── AnimatedCounter.jsx       # Smooth count-up animations for currency
│   │   │   ├── GroupChat.jsx             # Real-time in-group messaging & discussion
│   │   │   ├── GroupCard.jsx             # Group preview tile with balance status
│   │   │   ├── MemberList.jsx            # Member list & management
│   │   │   ├── AddMemberModal.jsx        # Email invite & shareable link generator
│   │   │   ├── ExpenseCard.jsx           # Expense summary card
│   │   │   ├── AddExpenseModal.jsx       # Smart split modal (Equal, Custom, Percent)
│   │   │   ├── ExpenseDetailsModal.jsx   # Comprehensive split breakdown
│   │   │   ├── BalanceCard.jsx           # Net standing overview
│   │   │   ├── SettlementList.jsx        # "Who Owes Whom" simplified transactions
│   │   │   ├── SettleUpModal.jsx         # Settle debt payment modal
│   │   │   └── ProtectedRoute.jsx        # Route guard checking authentication
│   │   ├── pages/                        # Main route views
│   │   │   ├── Landing.jsx               # Hero landing page for guests
│   │   │   ├── Dashboard.jsx             # Central financial hub & balance overview
│   │   │   ├── Groups.jsx                # User groups grid
│   │   │   ├── CreateGroup.jsx           # New group creation workflow
│   │   │   ├── GroupDetails.jsx          # Group detail hub (Expenses, Balances, Activity, Chat)
│   │   │   ├── Login.jsx                 # Secure sign-in view
│   │   │   ├── Register.jsx              # Account registration view
│   │   │   └── Profile.jsx               # User profile & account details
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global authentication & token state
│   │   ├── services/
│   │   │   └── api.js                    # Centralized Axios/fetch API client
│   │   ├── App.jsx                       # Application router & layout
│   │   ├── index.css                     # Cosmic design system & variables
│   │   └── main.jsx                      # Client application entry point
│   ├── vite.config.js                    # Dev server proxy (/api -> :5000)
│   └── package.json
│
├── server/                               # Backend Express REST API
│   ├── config/
│   │   └── db.js                         # MySQL connection pool & database bootstrapping
│   ├── controllers/                      # Business logic & request handlers
│   │   ├── authController.js             # Registration, login, profile, user search
│   │   ├── groupController.js            # Group CRUD & membership management
│   │   ├── expenseController.js          # Expense creation, list, and deletion
│   │   ├── balanceController.js          # Net balance computation & debt simplification
│   │   ├── settlementController.js       # Settle-up payments and history
│   │   ├── messageController.js         # In-group chat message posting & history
│   │   ├── dashboardController.js        # Global dashboard aggregations
│   │   ├── activityController.js         # Chronological group timeline
│   │   └── healthController.js           # Service health monitor endpoint
│   ├── middleware/                       # Security & authorization
│   │   ├── authMiddleware.js             # JWT bearer verification
│   │   ├── groupMiddleware.js            # Strict membership verification (HTTP 403)
│   │   └── errorHandler.js               # Centralized exception handler
│   ├── models/                           # Parameterized MySQL database models
│   │   ├── userModel.js
│   │   ├── groupModel.js
│   │   ├── expenseModel.js
│   │   ├── settlementModel.js
│   │   └── messageModel.js
│   ├── routes/                           # API route definitions
│   │   ├── authRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── healthRoutes.js
│   │   └── api.js
│   ├── services/                         # Core algorithmic engines
│   │   ├── splitService.js               # Paise-precision math (Equal, Exact, Percent)
│   │   └── balanceService.js             # Net ledger balance & greedy debt simplifier
│   ├── scripts/
│   │   ├── initDb.js                     # Automated MySQL table schema initializer
│   │   └── testSuite.js                  # 10-point automated integration test suite
│   ├── utils/
│   │   └── jwt.js                        # JWT signing and verification helpers
│   ├── .env.example                      # Server environment template
│   ├── server.js                         # Express entry point
│   └── package.json
│
├── database/
│   └── schema.sql                        # Complete relational schema reference
└── README.md
```

---

## Database Architecture

Fair Split utilizes 7 normalized relational tables in MySQL (`fairshare_db`):

1. **`users`**: User credentials (`name`, unique `email`, bcrypt `password_hash`, `created_at`).
2. **`groups`**: Expense groups (`name`, `created_by`, `created_at`).
3. **`group_members`**: Junction table mapping users to groups with a composite primary key `(group_id, user_id)`.
4. **`expenses`**: Shared bills storing `title`, `amount` (`DECIMAL(12,2)`), `paid_by`, `split_method`, and `expense_date`.
5. **`expense_participants`**: Exact share owed per participant per expense (`share_amount`, `share_percentage`).
6. **`settlements`**: Real-world repayments recorded between `payer_id` and `receiver_id`.
7. **`messages`**: In-group chat message records with timestamps and indexing on `(group_id, created_at)`.

All foreign keys are configured with `ON DELETE CASCADE` to guarantee relational integrity and prevent orphaned rows.

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server** (v8.0 or higher) running locally on port `3306`

### 2. Backend Setup
```bash
# Navigate to the server directory
cd server

# Create your .env file from the example template
cp .env.example .env

# Configure your database credentials in server/.env:
# PORT=5000
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_mysql_password
# DB_NAME=fairshare_db
# JWT_SECRET=your_secret_key

# Install dependencies
npm install

# Initialize MySQL tables
npm run db:init

# Start development server
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to the client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Client runs on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser to start using Fair Split.

---

## REST API Reference

All protected endpoints require the HTTP header:  
`Authorization: Bearer <your_jwt_token>`

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |
| `GET` | `/api/auth/search?q=query` | Search registered users by email or name | Private |

### Groups (`/api/groups`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/groups` | List all groups the user belongs to | Private |
| `POST` | `/api/groups` | Create a new expense group (`name`) | Private |
| `GET` | `/api/groups/:groupId` | Get group details and member roster | Group Member |
| `POST` | `/api/groups/:groupId/members` | Add a member by email | Group Member |
| `DELETE` | `/api/groups/:groupId/members/:userId` | Remove member (creator or self) | Group Member |
| `DELETE` | `/api/groups/:groupId` | Delete entire group | Group Creator |

### Expenses (`/api/groups/:groupId/expenses` & `/api/expenses`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/groups/:groupId/expenses` | Get all expenses recorded in the group | Group Member |
| `POST` | `/api/groups/:groupId/expenses` | Record a new expense (`title`, `amount`, `paid_by`, `split_method`, `participants`) | Group Member |
| `GET` | `/api/expenses/:expenseId` | Get detailed participant split breakdown | Group Member |
| `DELETE` | `/api/expenses/:expenseId` | Delete an expense (payer or group creator) | Group Member |

### Balances & Debt Minimization (`/api/groups/:groupId`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/groups/:groupId/balances` | Get member balances and greedy simplified settlements | Group Member |
| `POST` | `/api/groups/:groupId/settlements` | Record a repayment (`payer_id`, `receiver_id`, `amount`) | Group Member |
| `GET` | `/api/groups/:groupId/settlements` | Get settlement payment history | Group Member |

### In-Group Chat (`/api/groups/:groupId/messages`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/groups/:groupId/messages` | Retrieve group chat message history | Group Member |
| `POST` | `/api/groups/:groupId/messages` | Post a new message to the group | Group Member |

### Dashboard & Activity
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Aggregated user totals (owed, owe, net balance, recent expenses) | Private |
| `GET` | `/api/groups/:groupId/activity` | Chronological activity feed for the group | Group Member |
| `GET` | `/api/health` | Health monitor check returning database connection status | Public |

---

## Automated Test Suite

Fair Split includes a comprehensive automated integration test suite covering split math precision, multi-person debts, greedy simplifications, unauthorized access, and edge-case handling.

To execute the test suite:
```bash
cd server
npm run test:suite
```

### Verified Test Cases:
```
====================================================
🧪 Starting FairSplit Comprehensive Test Suite
====================================================

✅ PASS: 1. Equal Split (₹1200 split 4 ways = ₹300 each)
✅ PASS: 2. Custom Split (Custom amounts match exact sum ₹1000)
✅ PASS: 3. Percentage Split (40%/30%/20%/10% of ₹2000 calculated accurately)
✅ PASS: 4. Multiple People Paying (Expenses paid by Ronak, Rahul, and Amit recorded)
✅ PASS: 5. One Person Owing Multiple People (Sahil net balance: -₹700)
✅ PASS: 6. Multiple People Owing One Person (Ronak gets back +₹1600)
✅ PASS: 7. Settling a Debt (Receiver Authorization) (Payer got 403 Forbidden; Receiver (Ronak) settled ₹700)
✅ PASS: 8. Deleting an Expense (Expense deleted and cascading removal confirmed)
✅ PASS: 9. Invalid Split Totals (Rejected mismatched custom sums and non-100% percentages)
✅ PASS: 10. Unauthorized Cross-Group Access (HTTP 403 Forbidden returned for non-member)

====================================================
📊 Test Summary: 10/10 Tests Passed
====================================================
```

---

## License

This project is licensed under the [MIT License](LICENSE).
