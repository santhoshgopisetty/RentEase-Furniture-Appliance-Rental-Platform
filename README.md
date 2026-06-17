# RentEase – Furniture & Appliance Rental Platform

RentEase is a modern MERN-stack furniture and appliance rental application built for portfolio showcase and internship capstone projects. It allows users to browse items, customize rental tenures, add items to a cart, schedule home deliveries, and request doorside maintenance support. It also features a fully-functional admin management panel with real-time analytics dashboards, product catalogue controls, and orders management logs.

---

## Key Features

### 1. User Dashboard & Roles
* **User Accounts:** Registration, secure JWT login, and contact details/address preferences page.
* **Smart Catalog:** Browse products across furniture (Bed, Sofa, Table, Chair, Wardrobe) and appliance categories (Refrigerator, Washing Machine, Television, Microwave, Air Conditioner). Includes live search, category navigation, sorting, and price range sliders.
* **Custom Tenure:** Select rental tenures (3, 6, 9, 12 months) directly on product cards to calculate optimal rates.
* **Transactional Checkout:** Add products to a cart, view security deposits and monthly outlay breakdowns, select delivery schedules, and place orders through a mock payment card validation flow.
* **Maintenance claims:** Submit service tickets for active orders and monitor progress (Open ➔ In Progress ➔ Resolved).
* **Extensions:** Extend the rental tenure of active items in a single click.

### 2. Admin Panel & Dashboard
* **Analytics charts:** Visualizes Monthly Recurring Revenue (MRR), category counts, and order status counts using **Recharts**. Includes statistics panels for total inventory, users count, and warehouse utilization.
* **Product Catalog adjustments:** Complete CRUD interface to add, edit, or delete inventory products (with support for names, categories, descriptions, deposits, rents, image links, and stock counters).
* **User directory:** Monitor registered clients' shipping details and contact information.
* **Order fulfillment logs:** Manage orders and update delivery/rental states (Pending ➔ Active ➔ Returned ➔ Cancelled). Stock quantities are returned back to inventory automatically on item returns or cancellations.
* **Support Ticket board:** Respond to customer maintenance claims and progress them through fulfillment states.

---

## Technology Stack

* **Frontend:** React.js (Vite), React Router v6, Tailwind CSS, Axios, React Hook Form, Recharts, React Icons
* **Backend:** Node.js, Express.js, JWT Authentication, bcryptjs
* **Database:** MongoDB with Mongoose ORM
* **Seeder:** Script for automated seeding of 20 products, 10 users, and 15 rental orders.

---

## Project Structure

```
Unified-Mentor-Internship/
├── backend/
│   ├── src/
│   │   ├── config/             # DB Connection Config
│   │   ├── controllers/        # Express Route Handlers
│   │   ├── middleware/         # Auth & Central Error Handlers
│   │   ├── models/             # Mongoose Schemas (User, Product, etc.)
│   │   ├── routes/             # Modular Express Router Mapping
│   │   └── scripts/            # Database Seeder Scripts
│   ├── server.js               # Entry Bootstrapper
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/         # Reusable Components (Navbar, Footer, etc.)
    │   ├── context/            # AuthContext State
    │   ├── pages/              # Admin and User View Layouts
    │   ├── services/           # Axios Base Interceptors
    │   ├── App.jsx             # Router definition
    │   ├── index.css           # Styling directives
    │   └── main.jsx
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## Supporting Documentation

* [API Documentation](file:///Users/santhoshgopisetty/Desktop/Unified-Mentor-Internship/API_DOCUMENTATION.md)
* [Production Deployment Instructions](file:///Users/santhoshgopisetty/Desktop/Unified-Mentor-Internship/DEPLOYMENT_INSTRUCTIONS.md)

---

## Quick Start: Running Locally

### Step 1. Clone & Set Up Backend
1. Go into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file (refer to `.env.example`):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rentease
   JWT_SECRET=rentease_jwt_secret_token_12345
   NODE_ENV=development
   ```
4. Seed the database with sample products and accounts:
   ```bash
   npm run seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

### Step 2. Set Up Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

---

## Sample Seeding Accounts

To test user and admin workflows, use the following credentials (seeded automatically via `npm run seed`):

### 1. Administrator Account
* **Email:** `admin@rentease.com`
* **Password:** `password123`

### 2. Standard Client Account
* **Email:** `john@gmail.com`
* **Password:** `password123`
* **Address:** `456 Elm St, New York, NY`
* **Phone:** `9876543210`
* (Other users exist: `jane@gmail.com`, `robert@gmail.com`, `emily@gmail.com`, etc., all with password `password123`).
