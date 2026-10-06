# ProductHub — Product & Inventory Management Platform

> A professional full-stack product management system built for the **Gupio Development Practical Assignment**.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, Lucide React, Recharts |
| Backend    | Node.js, Express.js, Mongoose       |
| Database   | MongoDB Atlas                       |
| Validation | Zod (client & server)               |
| Testing    | Vitest + Supertest                  |
| Auth       | JWT + bcrypt (scaffold ready)       |

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone & Install

```bash
# Install all dependencies
cd gupio
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Configure Environment

```bash
# Copy and fill in your MongoDB connection string
cp server/.env.example server/.env
```

Edit `server/.env`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/producthub
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

### 3. Run Development

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Or use the root convenience script (requires concurrently):
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## Project Structure

```
producthub/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── context/            # React context providers
│       ├── hooks/              # Custom data-fetching hooks
│       ├── layouts/            # Page layout shells
│       ├── pages/              # Route-level page components
│       ├── services/           # API call modules (axios)
│       └── utils/              # Helpers, validators, formatters
│
└── server/                     # Express.js backend
    ├── config/                 # Database connection
    ├── controllers/            # Request handlers
    ├── middleware/             # Auth, validation, error handler
    ├── models/                 # Mongoose schemas
    ├── routes/                 # Express routers
    ├── tests/                  # Vitest + Supertest API tests
    ├── utils/                  # Response utilities
    └── validators/             # Zod schemas
```

---

## API Reference

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/api/products`                 | List products (filtered) |
| GET    | `/api/products/:id`             | Get single product       |
| POST   | `/api/products`                 | Create product           |
| PUT    | `/api/products/:id`             | Update product           |
| DELETE | `/api/products/:id`             | Delete product           |
| GET    | `/api/products/stats`           | Dashboard statistics     |
| GET    | `/api/products/categories`      | Distinct category list   |

### Query Parameters (GET /api/products)

| Param        | Example                    | Description           |
|--------------|----------------------------|-----------------------|
| `search`     | `?search=laptop`           | Text search (name, SKU, desc) |
| `category`   | `?category=Electronics`    | Filter by category    |
| `stockStatus`| `?stockStatus=low+stock`   | Filter by stock level |
| `sort`       | `?sort=price_asc`          | Sort order            |
| `page`       | `?page=2`                  | Pagination page       |
| `limit`      | `?limit=20`                | Items per page        |

---

## Stock Status Rules

| stockQuantity | Status        |
|---------------|---------------|
| 0             | Out of Stock  |
| 1 – 10        | Low Stock     |
| > 10          | In Stock      |

> Stock status is a **computed virtual field** — never stored redundantly in the database.

---

## Running Tests

```bash
cd server
npm test
```

---

## Deployment

| Service  | Platform     |
|----------|--------------|
| Frontend | Vercel       |
| Backend  | Render       |
| Database | MongoDB Atlas (free tier) |
