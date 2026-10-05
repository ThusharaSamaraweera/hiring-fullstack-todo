# Todo App

A full-stack TODO application built as an npm workspaces monorepo. The React client communicates with an Express and MongoDB API.

## Features

- Create, view, edit, complete, restore, and delete todos
- Search, status filtering, predefined sorting, and page-based pagination
- Client and server request validation
- Loading states, error feedback, and optimistic status/delete updates

## Technology

- Client: React, TypeScript, Vite, Tailwind CSS, TanStack Query, Axios, Yup
- Server: Node.js, Express, TypeScript, Mongoose, Zod, Winston
- Database: MongoDB

## Requirements

- Node.js 22.12.0 or later
- npm 10 or later
- MongoDB, either local or MongoDB Atlas

## Project structure

```text
app/
├── client/  # React application
└── server/  # Express API
```

## Setup and run

Run all commands from the repository root.

### Windows PowerShell

```powershell
npm.cmd install
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Set `MONGODB_URI` in `server/.env` to your local MongoDB or Atlas connection string. Do not commit either `.env` file.

Start the API in one terminal:

```powershell
npm.cmd run dev --workspace server
```

Start the client in a second terminal:

```powershell
npm.cmd run dev --workspace client
```

### Git Bash

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Set `MONGODB_URI` in `server/.env` to your local MongoDB or Atlas connection string. Do not commit either `.env` file.

Start the API in one terminal:

```bash
npm run dev --workspace server
```

Start the client in a second terminal:

```bash
npm run dev --workspace client
```

Open the client at `http://127.0.0.1:8000`. The API runs at `http://localhost:4000`.

## Verify

### Windows PowerShell

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run test --workspace server -- --pool=threads
```

### Git Bash

```bash
npm run typecheck
npm run lint
npm run build
npm run test --workspace server -- --pool=threads
```

## Git hooks

Husky runs the root `.husky/pre-commit` hook before each commit. It runs linting and type checking for the workspaces. Server tests run automatically when staged changes include files under `server/`; they are skipped for client-only commits.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/todos` | List todos with optional search, status, sort, and pagination query parameters |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo title or description |
| PATCH | `/api/todos/:id/done` | Change a todo between pending and completed |
| DELETE | `/api/todos/:id` | Delete a todo |

## Architecture

The server request flow is:

```text
route → validation → controller → service → repository
```

The client keeps HTTP calls in `api/`, server-state and mutations in `hooks/`, reusable UI in `components/`, and page-level UI in `sections/`.

No shared workspace package is included because the client and server currently have minimal shared code. A shared package would be appropriate when common types, schemas, or utilities become substantial enough to justify its build and dependency overhead.

## Scope and limitations

- This application has no authentication, authorization, or user ownership.
- It does not provide real-time synchronization, offline support, arbitrary/custom sorting, or soft-delete recovery.
- The client requires the API and MongoDB to be available for normal operation.
- Page-based pagination is appropriate for the current scope but may need a cursor-based approach for much larger datasets.
