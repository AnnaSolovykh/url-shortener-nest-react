# URL Shortener Service

This is a full-stack URL shortening service that allows users to create short links with optional custom aliases and expiration dates. The service includes basic analytics (click tracking and recent IP addresses) and is fully containerized for both development and production.

---

## Tech Stack

- **Backend**: NestJS (TypeScript), PostgreSQL, TypeORM, Docker
- **Frontend**: React + TypeScript, Bootstrap, Vite, Nginx
- **Testing**: Jest (E2E), Supertest
- **Packaging**: Docker, Docker Compose

---

## How to Run the Project

Make sure you have **Docker** and **Docker Compose** installed.

> **⚠️ Important**: Create the frontend `.env` file before running Docker Compose. 
> Vite requires environment variables at build time, so the file must exist during the Docker build process.
> 
> ```bash
> # Create frontend/.env with:
> echo "VITE_API_BASE_URL=http://localhost:3000" > frontend/.env
> ```

### Full Stack (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd url-shortener

# Create the required frontend .env file
echo "VITE_API_BASE_URL=http://localhost:3000" > frontend/.env

# Start all services with Docker Compose
docker compose up --build
```

The following services will be available:
- **Frontend**: http://localhost (Nginx serving React app)
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### Development Mode
For frontend development with hot reload:
```bash
# Start backend and database
docker compose up db backend

# In another terminal, run frontend locally
cd frontend
npm install
npm run dev
# Frontend available at http://localhost:5173
```

---

## Project Structure

```
.
├── docker-compose.yml      # Full stack orchestration
├── README.md
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── url/           # URL shortening module
│   │   │   ├── dto/
│   │   │   │   └── create-url.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── click-stat.entity.ts
│   │   │   │   └── url.entity.ts
│   │   │   ├── url.controller.ts
│   │   │   ├── url.module.ts
│   │   │   └── url.service.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── test/              # E2E tests
│   ├── dist/              # Compiled output
│   ├── node_modules/      # Dependencies
│   ├── .dockerignore
│   ├── .env               # Backend environment
│   ├── .prettierrc
│   ├── docker-compose.yml # Database setup for backend-only development
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.build.json
│   └── tsconfig.json
└── frontend/              # React frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── api/          # API calls
    │   ├── types/        # TypeScript types
    │   ├── hooks/        # Custom hooks
    │   └── pages/        # Page components
    ├── node_modules/     # Dependencies
    ├── public/           # Static assets
    ├── .env              # Frontend environment (required!)
    ├── .gitignore
    ├── .prettierrc
    ├── Dockerfile        # Frontend container (multi-stage)
    ├── eslint.config.js
    ├── index.html
    ├── nginx.conf        # Nginx configuration
    ├── package-lock.json
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.js
    └── .gitignore
```

---

## Docker Configuration

### docker-compose.yml
The project uses Docker Compose to orchestrate three services:

- **Database**: PostgreSQL 15 with persistent volume
- **Backend**: NestJS API with hot reload in development
- **Frontend**: React app served by Nginx

### Backend Dockerfile
Multi-stage build optimized for production:
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

### Frontend Dockerfile
Multi-stage build with Nginx:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgres://postgres:postgres@db:5432/url_shortener
PORT=3000
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
```

> **Note**: This configuration is for local development and testing. 
> For production deployment, update the API URL accordingly.

---

## Backend

The backend provides a REST API for managing short links with CORS enabled for frontend communication.

### Main Features
- Create short URLs with optional custom alias and expiration
- Redirect via short URL with click tracking
- View link info: original URL, createdAt, click count
- View basic analytics: click count and last 5 IPs with timestamps
- Delete short links
- CORS support for frontend integration

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
- Redirect behavior and click tracking
- Info and analytics endpoints
- Deletion flow
- Error handling

---

## Frontend

The frontend is a React TypeScript application built with Vite and served by Nginx in production, providing a clean interface for URL shortening with real-time analytics.

### Main Features
- **URL Shortening Form**: Create short links with optional custom alias and expiration date
- **Link Management**: Copy, view info, and delete created links
- **Real-time Analytics**: View click statistics and recent visitor IPs
- **Auto-refresh**: Analytics update automatically when returning from clicked links
- **Responsive Design**: Bootstrap-based UI that works on all devices
- **Production Ready**: Nginx-served static files with proper routing

### Components Architecture

- **Home.tsx**: Main page with URL shortening form
- **LinkCard.tsx**: Displays shortened link with Copy/Delete actions
- **AnalyticsCard.tsx**: Shows click statistics and manages data fetching
- **LinkInfoCard.tsx**: Displays link metadata (URL, creation date, click count)

### Key Features
- **Form Validation**: URL validation with comprehensive error handling
- **Delayed Display**: Smooth UI transitions with delayed state updates
- **Focus-based Updates**: Analytics refresh when user returns after clicking links
- **Error Boundaries**: Comprehensive error handling and user feedback
- **Production Optimization**: Multi-stage Docker build with Nginx

### Available Scripts

```bash
# Development
npm run dev          # Start development server
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

### Nginx Configuration

The frontend uses Nginx for:
- Serving static files efficiently
- Handling client-side routing (SPA support)
- Production-ready web server

---

## Development vs Production

### Development
- Backend runs with hot reload (`npm run start:dev`)
- Frontend can run locally with Vite dev server
- CORS configured for `localhost:5173`

### Production
- Backend built and optimized
- Frontend built as static files and served by Nginx
- All services containerized and orchestrated with Docker Compose

---

## License

This project is licensed under the MIT License.