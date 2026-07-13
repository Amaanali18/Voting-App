# Voting App - Architecture Documentation

## Overview

A full-stack voting application with Spring Boot backend and React frontend. Users can create polls, vote on existing polls, and view results in real-time.

**Stack:**
- **Backend:** Spring Boot 3.x, Java 21, Spring Security, JWT, PostgreSQL, JPA/Hibernate
- **Frontend:** React 19, Vite, React Router v7, Tailwind CSS v4, Axios

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL LAYER                                 │
│  ┌──────────────┐         HTTPS/REST          ┌────────────────────────┐    │
│  │   Browser    │ ◄─────────────────────────► │    React Frontend      │    │
│  │  (Client)    │      Cookie-based Auth      │   (Port 5173 dev)      │    │
│  └──────────────┘                             └───────────┬────────────┘    │
│                                                          │                  │
└──────────────────────────────────────────────────────────┼──────────────────┘
                                                           │
                                    ┌──────────────────────┴──────────────────┐
                                    │        API Gateway / Load Balancer      │
                                    │           (Production)                  │
                                    └──────────────────────┬──────────────────┘
                                                           │
┌──────────────────────────────────────────────────────────┼─────────────────┐
│                                                          ▼                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SPRING BOOT BACKEND (Port 8080)                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐   │   │
│  │  │ Auth Ctrl   │  │ Home Ctrl   │  │ JWT Filter  │  │ Audit     │   │   │
│  │  │             │  │             │  │             │  │ Filter    │   │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘   │   │
│  │         │                │                │                │        │   │
│  │  ┌──────▼────────────────▼────────────────▼────────────────▼─────┐  │   │
│  │  │                    SECURITY CONFIG                            │  │   │
│  │  │  CORS | CSRF Disable | Stateless Session | JWT Filter Chain   │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  │                              │                                      │   │
│  │  ┌───────────────────────────▼───────────────────────────────────┐  │   │
│  │  │                      SERVICE LAYER                            │  │   │
│  │  │  ┌────────────────┐  ┌────────────────┐                       │  │   │
│  │  │  │ AuthService    │  │ VoteService    │                       │  │   │
│  │  │  │ (Register,     │  │ (Create,       │                       │  │   │
│  │  │  │  Login,        │  │  Get, Vote,    │                       │  │   │
│  │  │  │  Logout)       │  │  Exists)       │                       │  │   │
│  │  │  └────────────────┘  └────────────────┘                       │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  │                              │                                      │   │
│  │  ┌───────────────────────────▼───────────────────────────────────┐  │   │
│  │  │                      REPOSITORY LAYER (JPA)                   │  │   │
│  │  │  ┌───────────┐ ┌────────────┐ ┌──────────────┐                │  │   │
│  │  │  │ UserRepo  │ │ VotingRepo │ │VoteRecordRepo│                │  │   │
│  │  │  └───────────┘ └────────────┘ └──────────────┘                │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────┬──────────────────────────────────────────┘   │
│                             │                                              │
│  ┌──────────────────────────▼──────────────────────────────────────────┐   │
│  │                     POSTGRESQL DATABASE                             │   │
│  │  ┌─────────┐ ┌───────────┐ ┌─────────────┐ ┌──────────┐             │   │
│  │  │ users   │ │ vote_room │ │vote_record  │ │vote_room_│             │   │
│  │  │         │ │           │ │             │ │options/  │             │   │
│  │  │         │ │           │ │             │ │counter   │             │   │
│  │  └─────────┘ └───────────┘ └─────────────┘ └──────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Module Structure

```
src/main/java/com/amaan/backend/
├── config/                 # Security & Infrastructure
│   ├── SecurityConfig.java      # Spring Security, CORS, JWT filter chain
│   ├── JwtAuthFilter.java       # Extracts/validates JWT from cookie
│   ├── JwtUtil.java             # JWT generation/validation (HS384)
│   ├── AuditLogFilter.java      # Request logging (user, path, status, duration)
│   └── AuditLogger.java         # Structured logging to file
├── controller/             # REST Endpoints
│   ├── AuthController.java      # /api/auth/register, /login, /logout
│   └── HomeController.java      # /api/voting/ (create, get, vote, exists)
├── service/                # Business Logic
│   ├── AuthService.java         # Interface
│   ├── AuthServiceImpl.java     # User registration, login, logout, cookie mgmt
│   ├── voteService.java         # Interface
│   └── voteServiceImpl.java     # Poll CRUD, voting logic, 24hr expiry
├── repo/                   # Data Access (Spring Data JPA)
│   ├── UserRepo.java
│   ├── VotingRepo.java
│   └── VoteRecordRepo.java
├── entity/                 # JPA Entities
│   ├── User.java                # id, username, email, password, createdAt
│   ├── VoteRoom.java            # id, name, question, options[], counter[], createdAt
│   └── VoteRecord.java          # id, roomId, userId, optionIndex, votedAt
├── helpers/dtos/           # Request/Response DTOs
│   ├── LoginDTO.java            # login (username/email), password
│   ├── RegisterDTO.java         # username, email, password
│   ├── CastVoteDTO.java         # optionIndex
│   └── voteRoomCreateDTO.java   # name, question, options[]
└── BackendApplication.java      # Entry point
```

### Authentication Flow

```
┌─────────┐     1. POST /api/auth/login       ┌──────────────┐
│ Client  │ ────────────────────────────────► │AuthController│
│         │  { login: "email@x.com",          │              │
│         │   password: "secret" }            │              │
└─────────┘                                   │ 2. Validate  │
                                              │   credentials│
                                              │ 3. Generate  │
                                              │    JWT       │
                            4. Set-Cookie     │              │
         HttpOnly; Secure; SameSite=None ◄────│ 5. Return    │
              token=eyJhbGc...                │    user JSON │
                                              └──────────────┘
```

**Cookie Settings:**
- `HttpOnly: true` - XSS protection
- `Secure: true` - HTTPS only (production)
- `SameSite: None` - Cross-origin (frontend:5173 → backend:8080)
- `Path: /` - All routes
- `MaxAge: 86400` - 24 hours

### Request Authentication (Subsequent Requests)

```
┌─────────┐                                    ┌──────────────┐
│ Client  │ ─── GET /api/voting/create ──────► │ JwtAuthFilter│
│         │    Cookie: token=eyJhbGc...        │              │
└─────────┘                                    │ 1. Extract   │
                                               │    cookie    │
                                               │ 2. Validate  │
                                               │    signature │
                                               │ 3. Parse     │
                                               │    userId    │
                                               │ 4. Set       │
                                               │    Security  │
                                               │    Context   │
                                               └──────┬───────┘
                                                      │
                                               ┌──────▼────────┐
                                               │ HomeController│
                                               │ @PostMapping  │
                                               │  gets userId  │
                                               │ from context  │
                                               └───────────────┘
```

---

## Frontend Architecture

### Module Structure

```
src/
├── main.jsx                 # App entry, RouterProvider + Toaster
├── Routes/
│   ├── Routes.jsx           # Route definitions (React Router v7)
│   ├── AxiosHelper.js       # Axios instance with withCredentials: true
│   ├── Layout.jsx           # Shared layout wrapper
│   └── ProtectedRoute.jsx   # No-op (auth handled by backend cookies)
├── Pages/
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # POST /api/auth/login → /poll
│   ├── Register.jsx         # POST /api/auth/register → /poll
│   ├── Poll.jsx             # Search poll by name → /:name
│   ├── Create.jsx           # POST /api/voting/create → /:name
│   ├── Vote.jsx             # Legacy (kept for compatibility)
│   └── ViewPoll.jsx         # GET /api/voting/:name, vote UI
├── Components/
│   ├── store.js             # About, NotFound components
│   └── ...
└── index.css                # Tailwind v4 imports
```

### Route Map

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/` | Home | Public | Landing |
| `/login` | Login | Public | Login form |
| `/register` | Register | Public | Register form |
| `/poll` | Poll | Protected* | Search/enter poll name |
| `/create` | Create | Protected* | Create new poll |
| `/:name` | ViewPoll | Protected* | View & vote on poll |
| `*` | NotFound | - | 404 |

*Protected = Backend validates JWT cookie; no frontend auth check needed

### API Integration

```javascript
// AxiosHelper.js - All requests include cookies automatically
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,  // http://localhost:8080
    withCredentials: true  // Critical for cookie-based auth
})

// Usage in components
await api.post('/api/auth/login', { login: email, password })
await api.post('/api/voting/create', { name, question, options })
await api.get(`/api/voting/${pollName}`)
await api.post(`/api/voting/${pollName}/vote`, { optionIndex })
```

---

## Database Schema

### Tables

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Vote Rooms (Polls)
CREATE TABLE vote_room (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    question TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Options (ElementCollection)
CREATE TABLE vote_room_options (
    vote_room_id UUID REFERENCES vote_room(id),
    options VARCHAR(255)
);

-- Vote Counters (ElementCollection)
CREATE TABLE vote_room_counter (
    vote_room_id UUID REFERENCES vote_room(id),
    counter BIGINT
);

-- Vote Records (Audit trail + duplicate prevention)
CREATE TABLE vote_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES vote_room(id),
    user_id UUID REFERENCES users(id),
    option_index INTEGER NOT NULL,
    voted_at TIMESTAMP NOT NULL,
    UNIQUE(room_id, user_id)  -- One vote per user per poll
);
```

---

## API Specification

### Authentication

| Method | Endpoint             | Request                         | Response                      |
|--------|----------------------|---------------------------------|-------------------------------|
| POST   | `/api/auth/register` | `{username, email, password}`   | `{id, name, email}` + cookie  |
| POST   | `/api/auth/login`    | `{login, password}`             | `{id, name, email}` + cookie  |
| POST   | `/api/auth/logout`   | -                               | `"Logged out"` + clear cookie |

### Voting

| Method | Endpoint                          | Auth | Request                               | Response          |
|--------|-----------------------------------|------|---------------------------------------|-------------------|
| POST   | `/api/voting/create`              | ✓ | `{name, question, options: string[]}` | VoteRoom          |
| GET    | `/api/voting/{name}`              | ✓ | -                                     | `[VoteRoom]`      |
| POST   | `/api/voting/{name}/vote`         | ✓ | `{optionIndex: number}`               | `"Vote recorded"` |
| GET    | `/api/voting/existsByName?name=`  | ✓ | -                                     | `boolean`         |

### VoteRoom Response Format

```json
[
  {
    "id": "uuid",
    "name": "poll-name",
    "question": "Favorite color?",
    "options": ["Red", "Blue", "Green"],
    "counter": [10, 5, 3],
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

## Security Implementation

### JWT Token

```java
// JwtUtil.generateToken(userId, email)
Claims:
  - sub: userId (UUID)
  - email: user email
  - iat: issued at
  - exp: 24 hours
  - signature: HS384
```

### Password Security

- BCrypt encoding (strength 10)
- Never logged or returned in responses

### CORS Configuration

```java
config.setAllowedOrigins(List.of(frontendUrl));  // http://localhost:5173
config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
config.setAllowedHeaders(List.of("*"));
config.setAllowCredentials(true);  // Required for cookies
```

---

## Environment Variables

### Backend (application.yaml → env)

| Variable                 | Description                   | Example                                   |
|--------------------------|-------------------------------|-------------------------------------------|
| `DATABASE_URL`           | PostgreSQL JDBC URL           | `jdbc:postgresql://localhost:5432/voting` |
| `DATABASE_USERNAME`      | DB username                   | `postgres`                                |
| `DATABASE_PASSWORD`      | DB password                   | `secret`                                  |
| `JWT_SECRET`             | HS384 signing key (32+ chars) | `super-secret-key-min-32-chars`           |
| `JWT_EXPIRATION_MS`      | Token lifetime                | `86400000` (24h)                          |
| `FRONTEND_URL`           | CORS origin                   | `http://localhost:5173`                   |
| `SPRING_PROFILES_ACTIVE` | Profile                       | `dev` / `prod`                            |

### Frontend (.env)

| Variable           | Description      |
|--------------------|------------------|
| `VITE_BACKEND_URL` | Backend base URL | `http://localhost:8080` |

---

## Deployment Considerations

### Production Checklist

- [ ] Set `JWT_SECRET` to strong random 64+ char string
- [ ] Use HTTPS (`Secure: true` on cookies)
- [ ] Configure `FRONTEND_URL` to production domain
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Use managed PostgreSQL (RDS, Cloud SQL, etc.)
- [ ] Enable HSTS, CSP headers
- [ ] Configure rate limiting
- [ ] Set up log aggregation
- [ ] Database migrations (Flyway/Liquibase) instead of `ddl-auto: update`

### Docker Example

```dockerfile
# Backend
FROM eclipse-temurin:21-jre
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Frontend (nginx)
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## Development Workflow

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
pnpm install
pnpm run dev

# Build
cd backend && ./mvnw clean package
cd frontend && pnpm run build
```

---

## Key Design Decisions

| Decision                               | Rationale                                                     |
|----------------------------------------|---------------------------------------------------------------|
| Cookie-based JWT                       | Secure, automatic, CSRF-resistant with SameSite               |
| Stateless sessions                     | Scalable, no server-side session store                        |
| ElementCollection for options/counters | Simple schema, no join tables needed                          |
| UUID primary keys                      | Distributed-friendly, no enumeration attacks                  |
| AuditLogFilter                         | Observability without business logic pollution                |
| Backend-driven auth                    | Frontend doesn't manage auth state; cookie is source of truth |
| H2 for dev, PostgreSQL for prod        | Zero-config local dev, production-grade prod                  |

---

## File Index

### Backend Core
- `SecurityConfig.java:34` - Filter chain, CORS
- `JwtAuthFilter.java:25` - Cookie → JWT → SecurityContext
- `AuthServiceImpl.java:50` - Login/register + cookie management
- `voteServiceImpl.java:43` - Poll CRUD + voting logic
- `AuditLogFilter.java:20` - Request logging

### Frontend Core
- `Routes.jsx:12` - Route definitions
- `AxiosHelper.js:4` - Authenticated HTTP client
- `ViewPoll.jsx:14` - Poll display + voting UI
- `ProtectedRoute.jsx:5` - Pass-through (backend enforces auth)