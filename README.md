# 🗳️ Voting App

A full-stack real-time polling application with secure cookie-based authentication. Create polls, share them via unique URLs, and vote with instant results.

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?logo=springboot)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **🔐 Secure Authentication** - JWT in HttpOnly cookies (SameSite=None, Secure), BCrypt passwords
- **📊 Real-time Polling** - Create polls with unlimited options, vote once per user
- **🔗 Shareable Links** - Unique poll URLs (`/poll-name`) for easy sharing
- **📈 Live Results** - Visual progress bars with vote counts and percentages
- **⏱️ Auto-expiry** - Polls expire after 24 hours
- **📝 Audit Logging** - All requests logged with user, path, status, duration
- **🎨 Modern UI** - Tailwind CSS v4, responsive design

---

## 🏗 Architecture Overview

```
┌─────────────┐     HTTPS + Cookies      ┌─────────────┐
│   React     │ ◄──────────────────────► │ Spring Boot │
│  (Port 5173)│     withCredentials      │  (Port 8080)│
└─────────────┘                          └──────┬──────┘
                                                │
                                         ┌──────▼──────┐
                                         │ PostgreSQL  │
                                         └─────────────┘
```

**Authentication Flow:**
1. User submits credentials → `/api/auth/login`
2. Backend validates → generates HS384 JWT → sets HttpOnly cookie
3. All subsequent requests include cookie automatically
4. `JwtAuthFilter` extracts/validates JWT → sets `SecurityContext`
5. Controllers access user ID from context

---

## 🚀 Quick Start

### Prerequisites
- Java 21
- Node.js 20+
- React 19
- Spring Boot 3.5+
- PostgreSQL 16+
- Git

### Backend Setup
```bash
cd backend

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run (uses Maven wrapper)
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

---

## ⚙️ Configuration

### Backend (`.env`)
```properties
DATABASE_URL=jdbc:postgresql://localhost:5432/voting
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
JWT_SECRET=your-64-char-minimum-secret-key-here
JWT_EXPIRATION_MS=86400000
FRONTEND_URL=http://localhost:5173
SPRING_PROFILES_ACTIVE=dev
```

### Frontend (`.env`)
```properties
VITE_BACKEND_URL=http://localhost:8080
```

---

## 📡 API Reference

### Auth
| Method   | Endpoint             | Body                          | Response                      |
|----------|----------------------|-------------------------------|-------------------------------|
| POST     | `/api/auth/register` | `{username, email, password}` | `{id, name, email}` + cookie  |
| POST     | `/api/auth/login`    | `{login, password}`           | `{id, name, email}` + cookie  |
| POST     | `/api/auth/logout`   | -                             | `"Logged out"` + clear cookie |

### Voting (Auth Required)
| Method   | Endpoint                         | Body                                  | Response           |
|----------|----------------------------------|---------------------------------------|--------------------|
| POST     | `/api/voting/create`             | `{name, question, options: string[]}` | VoteRoom           |
| GET      | `/api/voting/{name}`             | -                                     | `[VoteRoom]`       |
| POST     | `/api/voting/{name}/vote`        | `{optionIndex: number}`               | `"Vote recorded"`  |
| GET      | `/api/voting/existsByName?name=` | -                                     | `boolean`          |

**VoteRoom Response:**
```json
{
  "id": "uuid",
  "name": "poll-name",
  "question": "Favorite color?",
  "options": ["Red", "Blue", "Green"],
  "counter": [10, 5, 3],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 🛡 Security Highlights

| Feature          | Implementation                                             |
|------------------|------------------------------------------------------------|
| Password Hashing | BCrypt (strength 10)                                       |
| JWT Algorithm    | HS384                                                      |
| Token Storage    | HttpOnly, Secure, SameSite=None cookie                     |
| Token Expiry     | 24 hours                                                   |
| CORS             | Strict origin allowlist + credentials                      |
| CSRF Protection  | SameSite=None + cookie-based (no token needed)             |
| SQL Injection    | Spring Data JPA parameter binding                          |
| Audit Trail      | Per-request logging (user, method, path, status, duration) |

---

## 📁 Project Structure

```
Voting-App/
├── backend/                 # Spring Boot 3.x
│   ├── src/main/java/com/amaan/backend/
│   │   ├── config/          # Security, JWT, Audit
│   │   ├── controller/      # AuthController, HomeController
│   │   ├── service/         # Business logic
│   │   ├── repo/            # JPA Repositories
│   │   ├── entity/          # User, VoteRoom, VoteRecord
│   │   └── helpers/dtos/    # Request/Response DTOs
│   └── pom.xml
│
├── frontend/                # React 19 + Vite 6
│   ├── src/
│   │   ├── Routes/          # Routes, Axios, Layout, ProtectedRoute
│   │   ├── Pages/           # Home, Login, Register, Poll, Create, ViewPoll
│   │   └── Components/      # About, NotFound
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🐳 Production Deployment

### Backend
```bash
./mvnw clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
pnpm run build
# Serve dist/ with nginx
```

### Docker Compose
```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: voting
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes: [postgres_data:/var/lib/postgresql/data]

  backend:
    build: ./backend
    environment: [DATABASE_URL=jdbc:postgresql://db:5432/voting, ...]
    depends_on: [db]

  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [backend]

volumes: {postgres_data: {}}
```

---

## 🧪 Development

```bash
# Backend with hot reload
cd backend && ./mvnw spring-boot:run

# Frontend with HMR
cd frontend && pnpm run dev

# Run tests
cd backend && ./mvnw test
```

---

## 📄 License

MIT License - feel free to use for learning or production.

---

## 🙏 Acknowledgments

- Spring Boot team for excellent framework
- React team for hooks and modern patterns
- Tailwind CSS for utility-first styling
- JWT.io for token debugging