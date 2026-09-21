# Database Seeding System

This directory contains the database seeding utility for the full-stack GraphQL application. It populates MongoDB with realistic, production-shaped seed records for development, testing, and UI evaluation.

---

## Features

- **Safe & Idempotent by Default:** Uses `findOneAndUpdate` with upsert semantics based on unique user emails. Rerunning the seed script does **not** duplicate data or overwrite existing user records.
- **Production Safety:** Does **not** blindly drop the database or collections during standard runs.
- **Reset Mode Support:** Allows complete clearing and re-seeding when explicitly requested via `--reset` flag or `RESET_DB=true`.
- **Realistic Dataset:** Creates an administrator account, sample faculty/employee profiles with realistic names, department/class assignments, subjects, attendance rates, and avatars, plus additional synthetic records to test pagination, search, and sorting.
- **Clean Lifecycle:** Manages MongoDB connection initialization, query execution, error handling, and clean disconnection before process termination.

---

## Directory Structure

```text
seed/
├── index.js      # Main seed script execution logic
└── README.md     # Documentation and usage guide
```

---

## Prerequisites

1. **Node.js:** Ensure Node.js (v18 or v20+) is installed.
2. **MongoDB:** A running MongoDB instance (locally via `brew services start mongodb-community` or containerized via Docker).
3. **Backend Dependencies:** Backend packages must be installed (`npm install --prefix backend` or `npm run install:all`).

---

## How to Run

### From the Repository Root

Run via the npm script defined in the root `package.json`:

```bash
npm run seed
```

Or execute directly with Node:

```bash
node seed/index.js
```

### From the Backend Directory

The backend's seed command delegates directly to this script:

```bash
npm run seed --prefix backend
```

---

## Clean Reset & Re-seeding

If you need to wipe existing test records and restore the seed baseline from scratch, pass the `--reset` flag:

```bash
node seed/index.js --reset
```

Or using the environment variable:

```bash
RESET_DB=true npm run seed
```

> [!WARNING]
> Reset mode drops all documents in the `employees` collection. Do not execute with `--reset` against production databases.

---

## Environment Variables

The script automatically detects environment variables from `.env` in the project root or `backend/.env`.

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017/hiring-test` |
| `ADMIN_EMAIL` | Administrator account email | `admin@example.com` |
| `DEFAULT_SEED_PASSWORD` | Plaintext password used for generated accounts | `password123` |
| `RESET_DB` | Flag to trigger clean wipe before seeding (`true`/`false`) | `false` |

### Custom Connection Example

```bash
MONGO_URI="mongodb://localhost:27017/my-custom-db" npm run seed
```

---

## Default Seed Credentials

Once seeded, you can log into the frontend application using:

### Administrator Account
- **Email:** `admin@example.com`
- **Password:** `password123`
- **Permissions:** Full CRUD access (Add, View, Edit all profiles, Delete), Employee Search, Filter, Sort, and View switching (Grid / List).

### Regular Employee Account
- **Email:** `sarah.jenkins@example.com`
- **Password:** `password123`
- **Permissions:** Read-only access to own profile with self-name editing.
