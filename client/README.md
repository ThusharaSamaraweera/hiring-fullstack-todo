# Todo App Client

React and TypeScript frontend for the Todo application.

## Features

- Create todos with Yup validation
- View todo details in a modal
- Search todos with debounced input
- Filter by all, pending, or completed status
- Sort by newly created, older created, or recently modified
- Paginate todo results
- Mark todos as completed or pending
- Edit todos
- Delete todos with confirmation
- Loading states and toast feedback

## Requirements

- Node.js 22.12.0 or later
- npm 10 or later
- The Todo API server running locally

## Environment

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:4000/api
```

The development client runs at `http://127.0.0.1:8000` and the API server allows that origin. Start the API server before opening the client so todo requests can complete.

## Commands

Run these commands from the repository root.

### Windows PowerShell

`npm.cmd` avoids PowerShell execution-policy issues with `npm.ps1`.

#### Install dependencies

```powershell
npm.cmd install
```

#### Configure environment

Create the local environment file:

```powershell
Copy-Item client/.env.example client/.env
```

Ensure `client/.env` contains:

```env
VITE_API_URL=http://localhost:4000/api
```

#### Start the application

Start the API server in one terminal:

```powershell
npm.cmd run dev --workspace server
```

Start the client in a second terminal:

```powershell
npm.cmd run dev --workspace client
```

Open the client at:

```text
http://127.0.0.1:8000
```

The API runs at `http://localhost:4000`.

#### Verify the client

```powershell
npm.cmd run typecheck --workspace client
npm.cmd run lint --workspace client
npm.cmd run build --workspace client
npm.cmd run preview --workspace client
```

### Git Bash

#### Install dependencies

```bash
npm install
```

#### Configure environment

```bash
cp client/.env.example client/.env
```

Ensure `client/.env` contains:

```env
VITE_API_URL=http://localhost:4000/api
```

#### Start the application

Start the API server in one terminal:

```bash
npm run dev --workspace server
```

Start the client in a second terminal:

```bash
npm run dev --workspace client
```

Open the client at `http://127.0.0.1:8000`.

The API runs at `http://localhost:4000`.

#### Verify the client

```bash
npm run typecheck --workspace client
npm run lint --workspace client
npm run build --workspace client
npm run preview --workspace client
```

## Client structure

```text
src/
├── api/          # Axios client and Todo API functions
├── components/   # Reusable UI components
├── hooks/        # TanStack Query hooks
├── sections/     # Dashboard and Todo UI sections
├── types/        # Client API and domain types
└── utils/        # Shared client utilities
```

## API integration

The client uses Axios for HTTP requests and TanStack Query for server-state fetching and mutations. The API base URL is configured through `VITE_API_URL`. Search, status filtering, pagination, and the predefined sort options are handled through the server API.

## Assumptions

- The API server is running and reachable through `VITE_API_URL`.
- API responses follow the documented API response format.
- The backend handles validation, persistence, pagination, and error classification.
- The client runs in a modern browser with JavaScript enabled.
- The default page size is 10 todos.
- Todo titles and descriptions are plain text.
- Search, status filtering, and predefined sorting are supported by the API.
- The client receives stable todo IDs from the server.

## Limitations

- No authentication, authorization, or user-specific todo handling.
- No offline support or local persistence.
- No real-time synchronization between browser sessions.
- No arbitrary/custom sorting or filtering.
- No infinite scrolling; pagination uses Previous/Next controls.
- Optimistic updates may be rolled back if the API request fails.
- API availability is required for loading and modifying todos.
- API URL and environment configuration must be set per environment.
- No client-side cache persistence after a browser refresh.
- Accessibility support is limited to the implemented labels, buttons, keyboard handling, and modal behavior.
