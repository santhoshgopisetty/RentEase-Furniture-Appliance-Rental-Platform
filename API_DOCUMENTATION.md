# RentEase API Documentation

This document describes all REST API endpoints implemented in the RentEase backend.

## Base URL
* Local development: `http://localhost:5000/api`
* Production: `https://<your-render-backend-url>/api`

---

## 1. Authentication APIs

### Register User
* **Endpoint:** `POST /api/auth/register`
* **Access:** Public
* **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "password123",
  "phone": "9876543210",
  "address": "123 Main St, New York, NY"
}
```
* **Success Response (201 Created):**
```json
{
  "_id": "603f721a...",
  "name": "John Doe",
  "email": "john@gmail.com",
  "phone": "9876543210",
  "address": "123 Main St, New York, NY",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
* **Endpoint:** `POST /api/auth/login`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "john@gmail.com",
  "password": "password123"
}
```
* **Success Response (200 OK):**
```json
{
  "_id": "603f721a...",
  "name": "John Doe",
  "email": "john@gmail.com",
  "phone": "9876543210",
  "address": "123 Main St, New York, NY",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile
* **Endpoint:** `GET /api/auth/profile`
* **Access:** Private (Requires Header `Authorization: Bearer <token>`)
* **Success Response (200 OK):**
```json
{
  "_id": "603f721a...",
  "name": "John Doe",
  "email": "john@gmail.com",
  "phone": "9876543210",
  "address": "123 Main St, New York, NY",
  "role": "user"
}
```

---

## 2. Products APIs

### Get Products
* **Endpoint:** `GET /api/products`
* **Access:** Public
* **Query Parameters (Optional):**
  * `category`: Filter by product category (e.g. `Bed`, `Sofa`, `Refrigerator`)
  * `search`: Match keyword in product name or description
  * `availability`: Filter stock state (`true` or `false`)
  * `sort`: Sort parameter (`rent-asc`, `rent-desc`, `newest`)
* **Success Response (200 OK):**
```json
[
  {
    "_id": "603f721b...",
    "name": "King Size Wooden Bed Frame",
    "description": "Elegant solid teak wood king-sized bed frame...",
    "category": "Bed",
    "image": "https://images.unsplash.com/...",
    "monthlyRent": 35,
    "securityDeposit": 150,
    "tenureOptions": [3, 6, 9, 12],
    "stock": 8,
    "availability": true
  }
]
```

### Get Product by ID
* **Endpoint:** `GET /api/products/:id`
* **Access:** Public
* **Success Response (200 OK):**
```json
{
  "_id": "603f721b...",
  "name": "King Size Wooden Bed Frame",
  "description": "Elegant solid teak wood king-sized bed frame...",
  "category": "Bed",
  "image": "https://images.unsplash.com/...",
  "monthlyRent": 35,
  "securityDeposit": 150,
  "tenureOptions": [3, 6, 9, 12],
  "stock": 8,
  "availability": true
}
```

### Create Product
* **Endpoint:** `POST /api/products`
* **Access:** Private / Admin (Requires Header `Authorization: Bearer <admin-token>`)
* **Request Body:**
```json
{
  "name": "Premium Ergonomic Chair",
  "description": "Premium mesh computer chair with lumbar support...",
  "category": "Chair",
  "image": "https://images.unsplash.com/...",
  "monthlyRent": 12,
  "securityDeposit": 50,
  "tenureOptions": [3, 6, 12],
  "stock": 10,
  "availability": true
}
```
* **Success Response (201 Created):**
```json
{
  "_id": "603f721c...",
  "name": "Premium Ergonomic Chair",
  "description": "Premium mesh computer chair with lumbar support...",
  "category": "Chair",
  "image": "https://images.unsplash.com/...",
  "monthlyRent": 12,
  "securityDeposit": 50,
  "tenureOptions": [3, 6, 12],
  "stock": 10,
  "availability": true,
  "createdAt": "2026-06-16T21:20:00.000Z"
}
```

### Update Product
* **Endpoint:** `PUT /api/products/:id`
* **Access:** Private / Admin (Requires Header `Authorization: Bearer <admin-token>`)
* **Request Body:** (Any fields to update)
```json
{
  "monthlyRent": 14,
  "stock": 15
}
```
* **Success Response (200 OK):**
```json
{
  "_id": "603f721c...",
  "name": "Premium Ergonomic Chair",
  "description": "Premium mesh computer chair with lumbar support...",
  "category": "Chair",
  "image": "https://images.unsplash.com/...",
  "monthlyRent": 14,
  "securityDeposit": 50,
  "tenureOptions": [3, 6, 12],
  "stock": 15,
  "availability": true
}
```

### Delete Product
* **Endpoint:** `DELETE /api/products/:id`
* **Access:** Private / Admin (Requires Header `Authorization: Bearer <admin-token>`)
* **Success Response (200 OK):**
```json
{
  "message": "Product removed"
}
```

---

## 3. Cart APIs

### Get Cart
* **Endpoint:** `GET /api/cart`
* **Access:** Private
* **Success Response (200 OK):**
```json
{
  "_id": "603f721d...",
  "user": "603f721a...",
  "products": [
    {
      "product": {
        "_id": "603f721b...",
        "name": "King Size Wooden Bed Frame",
        "monthlyRent": 35,
        "securityDeposit": 150
      },
      "quantity": 1,
      "selectedTenure": 6,
      "_id": "603f721e..."
    }
  ]
}
```

### Add to Cart
* **Endpoint:** `POST /api/cart/add`
* **Access:** Private
* **Request Body:**
```json
{
  "productId": "603f721b...",
  "quantity": 1,
  "selectedTenure": 6
}
```
* **Success Response (200 OK):** (Returns full updated cart object populated with product details)

### Remove from Cart
* **Endpoint:** `DELETE /api/cart/remove`
* **Access:** Private
* **Request Body:**
```json
{
  "productId": "603f721b...",
  "selectedTenure": 6
}
```
* **Success Response (200 OK):** (Returns full updated cart object)

---

## 4. Rental Transaction APIs

### Place Rental Order (Checkout)
* **Endpoint:** `POST /api/rentals`
* **Access:** Private
* **Request Body:**
```json
{
  "deliveryDate": "2026-06-25"
}
```
* **Success Response (201 Created):**
```json
{
  "message": "Rental orders created successfully",
  "orders": [
    {
      "_id": "603f721f...",
      "user": "603f721a...",
      "product": "603f721b...",
      "quantity": 1,
      "selectedTenure": 6,
      "rentAmount": 35,
      "securityDeposit": 150,
      "deliveryDate": "2026-06-25T00:00:00.000Z",
      "returnDate": "2026-12-25T00:00:00.000Z",
      "status": "Pending",
      "createdAt": "2026-06-16T21:30:00.000Z"
    }
  ]
}
```

### Get My Rentals
* **Endpoint:** `GET /api/rentals`
* **Access:** Private
* **Success Response (200 OK):** (Returns array of orders populated with product details)

### Extend Rental Tenure
* **Endpoint:** `PUT /api/rentals/extend`
* **Access:** Private
* **Request Body:**
```json
{
  "orderId": "603f721f...",
  "extensionMonths": 3
}
```
* **Success Response (200 OK):**
```json
{
  "message": "Rental tenure extended successfully",
  "order": {
    "_id": "603f721f...",
    "user": "603f721a...",
    "product": "603f721b...",
    "selectedTenure": 9,
    "returnDate": "2027-03-25T00:00:00.000Z",
    "status": "Active"
  }
}
```

---

## 5. Maintenance Ticket APIs

### Submit Ticket
* **Endpoint:** `POST /api/maintenance`
* **Access:** Private
* **Request Body:**
```json
{
  "rentalOrderId": "603f721f...",
  "issueDescription": "The cooling refrigerator coils are squealing loudly and it does not maintain frost."
}
```
* **Success Response (201 Created):**
```json
{
  "_id": "603f722a...",
  "user": "603f721a...",
  "rentalOrder": "603f721f...",
  "issueDescription": "The cooling refrigerator coils are squealing...",
  "status": "Open",
  "createdAt": "2026-06-16T21:40:00.000Z"
}
```

### Get Tickets
* **Endpoint:** `GET /api/maintenance`
* **Access:** Private
* **Success Response (200 OK):**
  * Standard User: returns their own tickets.
  * Admin User: returns all support tickets in the database populated with user details.

### Update Ticket Status
* **Endpoint:** `PUT /api/maintenance/:id`
* **Access:** Private / Admin
* **Request Body:**
```json
{
  "status": "In Progress"
}
```
* **Success Response (200 OK):** (Returns updated ticket object)

---

## 6. Admin Management APIs

### Get Admin Dashboard Analytics
* **Endpoint:** `GET /api/admin/dashboard`
* **Access:** Private / Admin
* **Success Response (200 OK):**
```json
{
  "stats": {
    "totalUsers": 9,
    "totalProducts": 20,
    "activeRentals": 8,
    "pendingRentals": 2,
    "monthlyRevenue": 240,
    "openMaintenance": 1,
    "inProgressMaintenance": 1,
    "totalMaintenance": 3,
    "utilizationRate": 40
  },
  "charts": {
    "revenueByMonth": [...],
    "categoryData": [...],
    "orderStatusData": [...]
  }
}
```

### Get Client Database
* **Endpoint:** `GET /api/admin/users`
* **Access:** Private / Admin
* **Success Response (200 OK):** (Returns array of all users with role `user` excluding password)

### Get All Orders
* **Endpoint:** `GET /api/admin/orders`
* **Access:** Private / Admin
* **Success Response (200 OK):** (Returns array of all rental orders populated with user and product details)

### Update Order Status
* **Endpoint:** `PUT /api/admin/orders/:id`
* **Access:** Private / Admin
* **Request Body:**
```json
{
  "status": "Active"
}
```
* **Success Response (200 OK):** (Returns updated order object)
