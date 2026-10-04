# Todo App Server

Express and TypeScript API for the Todo application. It persists todos in MongoDB through Mongoose.

## Requirements

- Node.js 22.12.0 or later
- npm 10 or later
- MongoDB, either local or MongoDB Atlas

## Environment

Create `server/.env` from `server/.env.example`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
CLIENT_ORIGIN=http://127.0.0.1:8000
LOG_LEVEL=info
```

`MONGODB_URI` may use either:

- A local MongoDB connection, such as `mongodb://127.0.0.1:27017/todo_app`
- A MongoDB Atlas connection string supplied by Atlas

Do not commit `server/.env` or include credentials in source control.

## Setup and run

Run these commands from the repository root.

### Windows PowerShell

```powershell
npm.cmd install
Copy-Item server/.env.example server/.env
npm.cmd run dev --workspace server
```

### Git Bash

```bash
npm install
cp server/.env.example server/.env
npm run dev --workspace server
```

The API starts at `http://localhost:4000`.

## Verify

### Windows PowerShell

```powershell
npm.cmd run typecheck --workspace server
npm.cmd run lint --workspace server
npm.cmd run test --workspace server -- --pool=threads
npm.cmd run build --workspace server
```

### Git Bash

```bash
npm run typecheck --workspace server
npm run lint --workspace server
npm run test --workspace server -- --pool=threads
npm run build --workspace server
```

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/api/todos` | List todos with optional `page`, `limit`, `search`, and `status` query parameters |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/:id` | Update a todo title or description |
| PATCH | `/api/todos/:id/done` | Change a todo between pending and completed |
| DELETE | `/api/todos/:id` | Delete a todo |

Example create request body:

```json
{
  "title": "Buy groceries",
  "description": "Milk, fruit, and coffee"
}
```

## Architecture

Each Todo request follows this flow:

```text
route → validation → controller → service → repository
```

- Routes define API endpoints and middleware.
- Zod middleware validates request input.
- Controllers translate HTTP requests and responses.
- Services contain application rules.
- Repositories contain Mongoose database operations.

Responses use a consistent envelope with `status`, `statusCode`, optional `message`, optional `errorCode`, and optional `data`.

## Assumptions

- MongoDB is reachable through `MONGODB_URI`.
- The client origin matches `CLIENT_ORIGIN`.
- The API is used by the Todo client and does not require user authentication for this assignment.
- Todo titles and descriptions are plain text.

## Limitations

- No authentication, authorization, or per-user todo ownership.
- No rate limiting or API versioning.
- No soft delete or restore support.
- The completion update is a read-then-update operation, so simultaneous requests can conflict.
- Page-based pagination is suitable for this assignment but may need cursor-based pagination at a much larger scale.
