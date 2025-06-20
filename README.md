# URL Shortener Service

This is a full-stack URL shortening service that allows users to create short links with optional custom aliases and expiration dates. The service includes basic analytics (click tracking and recent IP addresses) and is fully containerized for local development.

---

## Tech Stack

- **Backend**: NestJS (TypeScript), PostgreSQL, TypeORM, Docker
- **Frontend**: React + TypeScript
- **Testing**: Jest (E2E), Supertest
- **Packaging**: Docker, Docker Compose

---

## How to Run the Project

Make sure you have **Docker** and **Docker Compose** installed.

```bash
cd backend
docker compose up --build
```

The following services will be available:

- API: http://localhost:3000
- PostgreSQL: localhost:5432

## Project Structure

```
.
├── backend/           # NestJS backend + Docker setup
│   ├── src/          # Source code
│   ├── test/         # E2E tests
│   ├── docker-compose.yml
│   └── Dockerfile
└── README.md
```

## Environment Variables

The `.env` file is optional - Docker Compose already includes the necessary environment variables.

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
  "alias": "my-link",                     // optional
  "expiresAt": "2025-12-31T23:59:59Z"     // optional
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

## 📝 Frontend

*(Section to be added when frontend is implemented)*

## License

This project is licensed under the MIT License.