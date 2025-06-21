# URL Shortener Service

This is a full-stack URL shortening service that allows users to create short links with optional custom aliases and expiration dates. The service includes basic analytics (click tracking and recent IP addresses) and is fully containerized for local development.

---

## Tech Stack

- **Backend**: NestJS (TypeScript), PostgreSQL, TypeORM, Docker
- **Frontend**: React + TypeScript, Bootstrap, Vite
- **Testing**: Jest (E2E), Supertest
- **Packaging**: Docker, Docker Compose

---

## How to Run the Project

Make sure you have **Docker** and **Docker Compose** installed.

### Backend
```bash
cd backend
docker compose up --build
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The following services will be available:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

---

## Project Structure

```
.
├── backend/                 # NestJS backend + Docker setup
│   ├── src/                # Source code
│   ├── test/               # E2E tests
│   ├── docker-compose.yml
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API calls
│   │   ├── types/         # TypeScript types
│   │   ├── hooks/         # Custom hooks
│   │   └── pages/         # Page components
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Environment Variables

### Backend

The `.env` file is optional - Docker Compose already includes the necessary environment variables.

### Frontend

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Backend

The backend provides a REST API for managing short links.

### Main Features

- Create short URLs with optional custom alias and expiration
- Redirect via short URL
- View link info: original URL, createdAt, click count
- View basic analytics: click count and last 5 IPs
- Delete short links

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shorten` | Create a short URL |
| GET | `/:alias` | Redirect to the original URL |
| GET | `/info/:alias` | Get link metadata |
| GET | `/analytics/:alias` | Get total clicks and recent IPs |
| DELETE | `/delete/:alias` | Delete a short URL |

Example `POST /shorten` body:

```json
{
  "originalUrl": "https://example.com",
  "alias": "my-link",                    // optional
  "expiresAt": "2025-12-31T23:59:59Z"   // optional
}
```

### Tests

To run backend end-to-end tests:

```bash
cd backend
npm run test:e2e
```

Tests cover:

- Link creation with alias
- Redirect behavior
- Info and analytics
- Deletion flow

### Dockerfile (backend)

```Dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

---

## Frontend

The frontend is a React TypeScript application built with Vite, providing a clean interface for URL shortening with real-time analytics.

### Main Features

- **URL Shortening Form**: Create short links with optional custom alias and expiration date
- **Link Management**: Copy, view info, and delete created links
- **Real-time Analytics**: View click statistics and recent visitor IPs
- **Auto-refresh**: Analytics update automatically when returning from clicked links
- **Responsive Design**: Bootstrap-based UI that works on all devices

### Components Architecture

- **Home.tsx**: Main page with URL shortening form
- **LinkCard.tsx**: Displays shortened link with Copy/Delete actions
- **AnalyticsCard.tsx**: Shows click statistics and manages data fetching
- **LinkInfoCard.tsx**: Displays link metadata (URL, creation date, click count)

### Key Features

- **Form Validation**: URL validation with error handling
- **Delayed Display**: Smooth UI transitions with delayed state updates
- **Focus-based Updates**: Analytics refresh when user returns after clicking links
- **Error Boundaries**: Comprehensive error handling and user feedback

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
```

### Dependencies

#### Core Dependencies

- **React 19**: Latest React with concurrent features
- **React Bootstrap**: UI components and responsive design
- **Axios**: HTTP client for API communication
- **React Router DOM**: Client-side routing

#### Development Dependencies

- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety and better developer experience
- **ESLint + Prettier**: Code quality and formatting
- **@types/react**: TypeScript definitions

### API Integration

The frontend communicates with the backend through a centralized API layer:

```typescript
// api/api.ts
export const shortenUrl = (data: ShortenRequest) => 
  axios.post('/shorten', data);

export const getAnalytics = (alias: string) => 
  axios.get(`/analytics/${alias}`);

export const getLinkInfo = (alias: string) => 
  axios.get(`/info/${alias}`);

export const deleteLink = (alias: string) => 
  axios.delete(`/delete/${alias}`);
```

---

## License

This project is licensed under the MIT License.
