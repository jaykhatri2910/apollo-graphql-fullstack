# Apollo GraphQL Full-Stack Employee Management System

A production-quality full-stack web application designed for comprehensive employee directory and staff management. Built with **React 18** and **Apollo Client** on the frontend, and **Node.js**, **Express**, **Apollo Server**, and **MongoDB** on the backend, featuring an end-to-end type-safe **GraphQL API** with role-based access control (RBAC).

---

## Overview

Managing organization directories requires fast search, flexible filtering, and granular data access controls. This application provides a unified workspace for both administrators and employees:

- **Frontend:** A responsive Single Page Application (SPA) built using React and Vite. It integrates Apollo Client for normalized caching, reactive state management, and GraphQL query/mutation dispatching. It provides dual display modes (Card Grid and Table List), real-time search, sorting, pagination, and modal dialogs.
- **Backend:** A Node.js and Express server running Apollo Server Express. It handles GraphQL schema execution, JWT authentication middleware, authorization checks, and MongoDB object data modeling via Mongoose.
- **GraphQL & Apollo Layer:** A strongly-typed GraphQL schema defines all data operations, eliminating over-fetching and under-fetching. Resolvers enforce business logic, permission verification, and data persistence.

---

## Features

### Role-Based Access Control (RBAC) & Authentication
- **Secure Authentication:** User login via email and password using bcrypt-hashed passwords and signed JSON Web Tokens (JWT).
- **Admin Role:** Full administrative privileges:
  - Browse complete employee directory.
  - Search employees by name in real-time.
  - Sort by date joined, name, age, or attendance rate (ascending / descending).
  - Add new employee records.
  - Edit any employee's details (role, department/class, subjects, attendance, profile).
  - Delete employee records with confirmation dialog.
  - Toggle between Table List View and Card Grid View.
- **Employee Role:**
  - View individual employee profile.
  - Restricted self-service editing (can update personal name, with restrictions on role and administrative fields).

### User Interface & Experience
- **Responsive Views:** Automatic mobile-adaptive layout with manual toggle between card grid and data table list.
- **Interactive Modals:** Built-in modals for employee details, employee creation/updating, and deletion confirmation.
- **Pagination & Sorting:** Server-side pagination with query limit/offset calculation and multi-field sorting.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18.2, Vite 5.2 |
| **GraphQL Client** | Apollo Client 3.9, `@apollo/client` |
| **Routing & UI** | React Router DOM 6.22, Vanilla CSS design system |
| **Backend Server** | Node.js (v20+), Express 4.19 |
| **GraphQL Server** | Apollo Server Express 3.13, GraphQL 16.8 |
| **Database & ODM** | MongoDB, Mongoose 8.3 |
| **Authentication & Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS |
| **Development & Tooling** | Nodemon, ESLint 8.57, npm |

---

## System Architecture

The following diagram illustrates the data flow and communication architecture across the system:

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)              │
│                                                        │
│   ┌─────────────────────┐      ┌───────────────────┐   │
│   │   UI Components     │ ───> │   Apollo Client   │   │
│   │ (Grid / List / Auth)│ <─── │ (Cache & Network) │   │
│   └─────────────────────┘      └─────────┬─────────┘   │
└──────────────────────────────────────────┼─────────────┘
                                           │
                        GraphQL HTTP POST  │ (Authorization: Bearer <token>)
                                           ▼
┌────────────────────────────────────────────────────────┐
│              Backend (Node.js + Express)               │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │               Auth Middleware                  │   │
│   │      (JWT verification -> req context.user)    │   │
│   └──────────────────────┬─────────────────────────┘   │
│                          │                             │
│   ┌──────────────────────▼─────────────────────────┐   │
│   │          Apollo Server Express                 │   │
│   │      (Schema TypeDefs + Resolvers)             │   │
│   └──────────────────────┬─────────────────────────┘   │
│                          │                             │
│   ┌──────────────────────▼─────────────────────────┐   │
│   │              Mongoose ODM                      │   │
│   │       (Employee Model & Validation)            │   │
│   └──────────────────────┬─────────────────────────┘   │
└──────────────────────────┼─────────────────────────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │  MongoDB Database │
                 │  ('hiring-test')  │
                 └───────────────────┘
```

---

## Project Structure

```text
apollo-graphql-fullstack/
├── .env.example                  # Root environment variable template
├── .gitignore                    # Root gitignore for build, logs, and secrets
├── README.md                     # Comprehensive project documentation
├── package.json                  # Root monorepo orchestration scripts
│
├── backend/                      # Backend Node.js & Apollo Server app
│   ├── .env                      # Local backend environment file (gitignored)
│   ├── .env.example              # Backend environment template
│   ├── .gitignore                # Backend-specific ignore rules
│   ├── package.json              # Backend dependencies and scripts
│   └── src/
│       ├── index.js              # Server entry point & Express/Apollo setup
│       ├── middleware/
│       │   └── auth.js           # JWT authentication & extraction middleware
│       ├── models/
│       │   └── Employee.js       # Mongoose schema and Employee data model
│       ├── schema/
│       │   ├── resolvers.js      # GraphQL Query & Mutation resolvers with RBAC
│       │   └── typeDefs.js       # GraphQL type definitions and schema
│       └── utils/
│           └── seed.js           # Wrapper delegating to root seed system
│
├── frontend/                     # Frontend React & Vite application
│   ├── .env                      # Local frontend environment file (gitignored)
│   ├── .env.example              # Frontend environment template
│   ├── .eslintrc.cjs             # ESLint configuration for React & Vite
│   ├── .gitignore                # Frontend-specific ignore rules
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies and scripts
│   ├── vite.config.js            # Vite bundler configuration
│   └── src/
│       ├── App.jsx               # Main application container & view orchestration
│       ├── main.jsx              # React DOM render & ApolloProvider setup
│       ├── components/           # UI components
│       │   ├── DeleteConfirmationModal.jsx  # Deletion confirmation dialog
│       │   ├── EmployeeFormModal.jsx        # Employee create/edit modal
│       │   ├── EmployeeGrid.jsx             # Table / List view component
│       │   ├── EmployeeModal.jsx            # Detailed employee info modal
│       │   ├── EmployeeProfile.jsx          # Self-profile view for employee role
│       │   ├── EmployeeTile.jsx             # Card / Grid view tile component
│       │   ├── Header.jsx                   # Navigation header with user badge & logout
│       │   └── LoginForm.jsx                # Login form component
│       └── styles/
│           └── index.css         # Complete CSS styles and component theme
│
└── seed/                         # Database seeding subsystem
    ├── index.js                  # Seed execution script (safe upsert + reset mode)
    └── README.md                 # Seeding documentation and options
```

---

## Prerequisites

Ensure you have the following installed on your development workstation:

- **Node.js:** `v18.x` or `v20.x+` (verified on `v20.19` / `v22.20`)
- **npm:** `v9.x` or `v10.x+`
- **MongoDB:** A running MongoDB instance locally (`mongodb://localhost:27017`) or through Docker.

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd apollo-graphql-fullstack
```

### 2. Install Dependencies

Install all dependencies across both backend and frontend using the root command:

```bash
npm run install:all
```

*(Alternatively, run `npm install --prefix backend` and `npm install --prefix frontend`)*

### 3. Configure Environment Variables

Create `.env` files for both frontend and backend using the provided templates:

```bash
# Copy backend environment template
cp backend/.env.example backend/.env

# Copy frontend environment template
cp frontend/.env.example frontend/.env
```

Ensure `backend/.env` points to your active MongoDB instance:

```dotenv
PORT=4000
MONGO_URI=mongodb://localhost:27017/hiring-test
JWT_SECRET=supersecretkey123
FRONTEND_URL=http://localhost:5173
```

Ensure `frontend/.env` points to the GraphQL API:

```dotenv
VITE_API_URL=http://localhost:4000/graphql
```

### 4. Seed the Database

Populate MongoDB with default accounts and sample employees:

```bash
npm run seed
```

---

## Running the Application

### Development Mode

Start the backend and frontend in separate terminal windows:

#### Terminal 1: Backend Server
```bash
npm run dev:backend
```
The Apollo GraphQL server will start at: `http://localhost:4000/graphql`

#### Terminal 2: Frontend Client
```bash
npm run dev:frontend
```
The Vite development server will start at: `http://localhost:5173`

---

## Available Root-Level npm Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run install:all` | Installs dependencies for both `backend` and `frontend`. |
| `npm run dev:backend` | Starts the backend with `nodemon` for auto-reloading. |
| `npm run dev:frontend` | Starts the Vite development server for the frontend. |
| `npm run start:backend` | Runs the production Node.js backend server. |
| `npm run build:frontend`| Builds the production-ready frontend bundle in `frontend/dist`. |
| `npm run preview:frontend` | Previews the production frontend build locally. |
| `npm run lint:frontend` | Runs ESLint validation across frontend JavaScript and JSX files. |
| `npm run seed` | Executes the database seeding script from the root. |

---

## Environment Variables

### Root `.env.example`
| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `MONGO_URI` | Yes | MongoDB connection URI | `mongodb://localhost:27017/hiring-test` |
| `PORT` | No | Backend HTTP port | `4000` |
| `JWT_SECRET` | Yes | Key for JWT signature generation | `your_jwt_secret_key_change_in_production` |
| `FRONTEND_URL` | No | Allowed frontend origin for CORS | `http://localhost:5173` |
| `VITE_API_URL` | Yes | GraphQL endpoint URL for Apollo Client | `http://localhost:4000/graphql` |
| `ADMIN_EMAIL` | No | Email used when creating initial admin | `admin@example.com` |
| `DEFAULT_SEED_PASSWORD` | No | Default password for seed accounts | `password123` |
| `RESET_DB` | No | Set to `true` to wipe database on seed | `false` |

### Backend `.env.example` (`backend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Express listening port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/hiring-test` |
| `JWT_SECRET` | Secret token for signing JWTs | `your_jwt_secret_key_change_in_production` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:5173` |

### Frontend `.env.example` (`frontend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Absolute URL to the GraphQL server | `http://localhost:4000/graphql` |

---

## GraphQL API Reference

The GraphQL endpoint is available at `http://localhost:4000/graphql`. You can test queries and mutations using Apollo Studio / Sandbox or Postman.

### Authentication
Protected operations require the following HTTP header:
```text
Authorization: Bearer <your-jwt-token>
```

### Queries

#### 1. `employees`
Fetch paginated employees with optional filtering and sorting. *(Admins view all; regular employees view self).*
```graphql
query GetEmployees($page: Int, $pageSize: Int, $filter: EmployeeFilter, $sortBy: EmployeeSort) {
  employees(page: $page, pageSize: $pageSize, filter: $filter, sortBy: $sortBy) {
    employees {
      id
      name
      age
      class
      subjects
      attendance
      role
      email
      avatar
      date
    }
    totalCount
    totalPages
  }
}
```

#### 2. `employee(id: ID!)`
Fetch a specific employee by ID. *(Admins can view any; employees can only view self).*
```graphql
query GetEmployee($id: ID!) {
  employee(id: $id) {
    id
    name
    email
    role
    class
    subjects
    attendance
  }
}
```

#### 3. `me`
Retrieve details of the currently authenticated user.
```graphql
query GetMe {
  me {
    id
    name
    email
    role
  }
}
```

### Mutations

#### 1. `login`
Authenticate with email and password to receive a JWT.
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      name
      email
      role
    }
  }
}
```

#### 2. `addEmployee` *(Admin Only)*
Create a new employee record.
```graphql
mutation AddEmployee(
  $name: String!
  $age: Int!
  $class: String!
  $subjects: [String]!
  $attendance: Int!
  $role: String
  $email: String!
  $password: String!
  $avatar: String
) {
  addEmployee(
    name: $name
    age: $age
    class: $class
    subjects: $subjects
    attendance: $attendance
    role: $role
    email: $email
    password: $password
    avatar: $avatar
  ) {
    id
    name
    email
  }
}
```

#### 3. `updateEmployee`
Update employee details. *(Admins can update all fields; employees can only update their `name`).*
```graphql
mutation UpdateEmployee(
  $id: ID!
  $name: String
  $age: Int
  $class: String
  $subjects: [String]
  $attendance: Int
  $role: String
  $email: String
  $avatar: String
) {
  updateEmployee(
    id: $id
    name: $name
    age: $age
    class: $class
    subjects: $subjects
    attendance: $attendance
    role: $role
    email: $email
    avatar: $avatar
  ) {
    id
    name
    email
  }
}
```

#### 4. `deleteEmployee` *(Admin Only)*
Delete an employee by ID.
```graphql
mutation DeleteEmployee($id: ID!) {
  deleteEmployee(id: $id)
}
```

---

## Database Seeding

The application includes an idempotent database seeding script located in `seed/index.js`.

### Seed Accounts Created

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` | System Administrator with complete management capabilities. |
| **Employee** | `sarah.jenkins@example.com` | `password123` | Sample Employee profile for self-service testing. |

### How to Run Seeding
- **Standard Seed (Safe Upsert):**
  ```bash
  npm run seed
  ```
  *Safe to rerun multiple times without duplicating or dropping existing data.*

- **Clean Reset & Seed:**
  ```bash
  node seed/index.js --reset
  # OR
  RESET_DB=true npm run seed
  ```

For more details on seed data customization, see [`seed/README.md`](file:///Users/jaykhatri/Documents/apollo-graphql-fullstack/seed/README.md).

---

## Testing & Quality Assurance

- **Code Linting:** Frontend source code is linted using ESLint:
  ```bash
  npm run lint:frontend
  ```
- **Production Build Validation:** Frontend build correctness is verified via Vite:
  ```bash
  npm run build:frontend
  ```

*(Automated unit and integration test suites like Jest or Vitest are not currently configured in the codebase).*

---

## Troubleshooting

### 1. MongoDB Connection Refused (`ECONNREFUSED 127.0.0.1:27017`)
- Ensure your MongoDB daemon is running locally:
  ```bash
  brew services start mongodb-community
  # Or check process
  pgrep -l mongod
  ```
- Verify the `MONGO_URI` in `backend/.env` is set to `mongodb://localhost:27017/hiring-test` (and not `mongodb://mongo:...` unless running inside Docker).

### 2. Port Already in Use
- If port `4000` or `5173` is occupied:
  - For backend: modify `PORT=4001` in `backend/.env` and update `VITE_API_URL` in `frontend/.env` to match.
  - For frontend: Vite will automatically suggest the next open port (e.g. `5174`).

### 3. Apollo Client Network Error / CORS Error
- Ensure the backend server is running and accessible at the URL configured in `frontend/.env` (`VITE_API_URL`).
- Confirm `FRONTEND_URL` in `backend/.env` matches the origin of your Vite development server (`http://localhost:5173`).

---

## License

This project is currently UNLICENSED and maintained for private/internal evaluation.

---

## Author

- **Jay Khatri** - [jay.khatri@socialpilot.co](mailto:jay.khatri@socialpilot.co)
