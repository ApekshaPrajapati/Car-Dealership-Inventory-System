# Car Dealership Inventory System

A full-stack inventory management system for a car dealership, built as a TDD kata. Includes user authentication (JWT), role-based access (admin/customer), full vehicle CRUD, search/filtering, and stock management (purchase/restock).

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT authentication, bcryptjs
**Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios
**Testing:** Jest, Supertest, mongodb-memory-server

## Features

- User registration and login with JWT-based auth
- Role-based access control (customer vs admin)
- Full vehicle CRUD (create, read, update, delete — delete is admin-only)
- Search/filter vehicles by make, category, and price range
- Purchase flow that decrements stock and disables when out of stock
- Admin-only restock functionality
- Responsive dashboard UI with live search

## Project Structure

```
Car-Dealership-Inventory-System/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose schemas (User, Vehicle)
│   │   ├── controllers/     # Route logic (auth, vehicles)
│   │   ├── routes/          # Express route definitions
│   │   ├── middleware/      # JWT auth + admin-only guard
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Entry point, DB connection
│   └── tests/                # Jest + Supertest test suites
└── frontend/
    └── src/
        ├── pages/            # Login, Register, Dashboard
        ├── components/       # VehicleCard, VehicleFormModal, ProtectedRoute
        ├── context/          # AuthContext (JWT + user state)
        └── api/              # Axios client
```

## Setup & Local Development

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (free tier on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) works fine)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file (copy `.env.example`) with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
```

Run the server:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`. Health check: `GET /api/health`.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file (copy `.env.example`) with:
```
VITE_API_URL=http://localhost:5000/api
```

Run the dev server:
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`.

### Running Tests

```bash
cd backend
npm test               # run the full suite
npm run test:coverage  # run with coverage report
```

Tests use an in-memory MongoDB instance (`mongodb-memory-server`) so they don't touch your real database — no setup required beyond `npm install`.

## Test Report

```
Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        6.187s

----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files              |   80    |   71.42  |  88.88  |  84.56  |
 src                   |  91.66  |    100   |    0    |   100   |
  app.js               |  91.66  |    100   |    0    |   100   |
 src/controllers       |  67.77  |   67.92  |   90    |  72.83  |
  AuthController.js    |  81.48  |   94.73  |   100   |  81.48  | 29-30,38,50-51
  vehicleController.js |  61.9   |   52.94  |  85.71  |  68.51  | 7,12,21,40,53,63,72,78-92
 src/middleware        |  92.85  |    100   |   100   |  92.85  |
  auth.js              |  92.85  |    100   |   100   |  92.85  | 14
 src/models            |  92.3   |    50    |   100   |   100   |
  User.js              |   90    |    50    |   100   |   100   | 15
  Vehicle.js            |   100   |    100   |   100   |   100   |
 src/routes            |   100   |    100   |   100   |   100   |
  authRoutes.js        |   100   |    100   |   100   |   100   |
  vehicleRoutes.js     |   100   |    100   |   100   |   100   |
 tests                 |   100   |    100   |   100   |   100   |
  setup.js             |   100   |    100   |   100   |   100   |
----------------------|---------|----------|---------|---------|-------------------
```

All 13 tests pass, covering registration, login, role-based access control, full vehicle CRUD, search filtering, and the purchase/restock stock logic. Overall coverage: 80% statements, 88.88% functions. The uncovered lines are primarily error-handling `catch` blocks that require simulating a database failure to trigger.
## Screenshots

<!-- ADD SCREENSHOTS HERE:
1. Login page
2. Register page
3. Dashboard (customer view) with vehicles listed
4. Dashboard (admin view) with add/edit/delete/restock controls visible
5. Search/filter in action
6. Purchase flow — before and after stock decrements, and the disabled "Unavailable" button at 0 stock
-->

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Log in, returns JWT |
| GET | `/api/vehicles` | Required | List all vehicles |
| GET | `/api/vehicles/search` | Required | Search by make/model/category/price range |
| POST | `/api/vehicles` | Required | Add a vehicle |
| PUT | `/api/vehicles/:id` | Required | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Admin only | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | Required | Purchase (decrements stock) |
| POST | `/api/vehicles/:id/restock` | Admin only | Restock (increments stock) |

## My AI Usage

**Tool used:** Claude (Anthropic)

**How I used it:**
- I used Claude to write the backend code (models, controllers, routes) and the test cases. I don't know how to write test cases myself yet, so I relied on Claude for those.
- I used Claude to build the frontend pages and components, including the dashboard design.
- When things broke (test failures, MongoDB connection errors, bugs), I pasted the errors to Claude and it helped me find and fix the problem.
- I used Claude to help write this README and figure out how to structure my git commits.

**Reflection:**
I'm still learning backend development and testing, so most of the code and all of the test cases came from Claude. I understand what the code does and was able to follow along and fix issues myself once I understood the error messages, but I could not have written the tests from scratch on my own yet. Using AI let me finish a full-stack project with authentication, testing, and a working frontend in a very short time, which I wouldn't have managed alone at my current skill level. Going forward I want to get better at writing tests myself instead of relying on AI for that part.
## Deployment 