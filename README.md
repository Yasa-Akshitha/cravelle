# Cravelle — Luxury Fashion E-Commerce Platform

Cravelle is an editorial, luxury fashion e-commerce web application featuring high-end women's apparel, fluid mulberry silks, tailored outerwear, artisanal accessories, and an intelligent **Cravelle AI** shopping stylist powered by real LLM integration and catalog grounding.

---

## 1. Project Overview & Features

- **Editorial Fashion Experience**: Warm cream, soft blush, taupe, and subtle gold palette with serif typography, large editorial campaign banners, and micro-animations.
- **Full-Stack Separation**: Decoupled React + Vite + TypeScript frontend and Java 17+ Spring Boot 3 backend.
- **Persistent Catalog & Variants**: Server-side product filtering by category, price, and query; multi-variant support (size/color/stock) with live availability checks.
- **Persistent Shopping Bag**: Authenticated server-side cart persistence, live price recalculation, and free shipping progress tracker.
- **Atelier Wishlist**: Saved favorite items with instant add-to-bag capability.
- **Bespoke Checkout**: Saved addresses, payment selection (Cash on Delivery or Test Gateway), atomic order placement, inventory reduction, and order cancellation with stock restoration.
- **Cravelle AI Personal Stylist**: Real conversational shopping assistant that answers policy questions, queries active catalog products from the database, and renders interactive product recommendation cards.
- **Administrative Atelier**: Role-protected dashboard for sales metrics, product CRUD with variants, order fulfillment updates, and newsletter management.
- **Security**: BCrypt password hashing, stateless JWT Bearer authorization, input validation, and sanitized global exception responses.

---

## 2. Technology Stack & Architecture

### Frontend
- **Framework**: React 18 with Vite 5 & TypeScript
- **Styling**: Tailwind CSS 3.4 with custom typography and luxury palette
- **Routing**: React Router 6 (SPA)
- **HTTP Client**: Centralized Axios client with automatic Bearer token injection
- **Icons**: Lucide React
- **Hosting Target**: Vercel

### Backend
- **Language & Runtime**: Java 17+ (Java 21 compatible)
- **Framework**: Spring Boot 3.2.5
- **Build Tool**: Apache Maven (with `mvnw` and `mvnw.cmd`)
- **Security**: Spring Security 6 with JJWT 0.12.5 (stateless token authentication)
- **ORM**: Spring Data JPA & Hibernate 6
- **Database Migrations**: Flyway (V1 Schema, V2 Seed Catalog)
- **API Documentation**: Springdoc OpenAPI 2.5 & Swagger UI
- **Hosting Target**: Render (Docker or Native Maven Web Service)

### Database
- **Production**: MySQL 8.0+
- **Local Fallback / Unit Tests**: Embedded H2 database in MySQL-compatible mode

---

## 3. Architecture & Layering

```
Browser Client (React + TypeScript)
        │
        ▼ (REST APIs over HTTPS via VITE_API_BASE_URL)
Spring Boot Layer (cravelle-backend)
  ├── Security Filters (JWT Token Validation)
  ├── Controllers (@RestController)
  ├── Services (Business Logic & Transactions)
  ├── Chatbot Engine (MySQL Grounding + LLM Completion)
  ├── Repositories (Spring Data JPA)
  └── Flyway Migrations
        │
        ▼
MySQL 8.0 Database (Entities: users, categories, products, variants, orders, chat, etc.)
```

---

## 4. Folder Structure

```
cravelle/
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/      # Navbar, Footer, ProductCard, ChatbotModal, SearchModal
│   │   ├── context/         # AuthContext, CartContext, WishlistContext
│   │   ├── pages/           # Home, Shop, ProductDetail, Cart, Wishlist, Checkout, Profile, Admin
│   │   ├── services/        # Centralized Axios API client & endpoints
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── App.tsx          # Application routing
│   │   ├── main.tsx         # React root
│   │   └── index.css        # Tailwind styling & Google Fonts
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── vercel.json          # SPA rewrite rules
│   └── .env.example
├── backend/
│   ├── src/main/java/com/cravelle/
│   │   ├── CravelleApplication.java
│   │   ├── chatbot/         # ChatbotService, LlmClient, StorePolicyService
│   │   ├── config/          # SecurityConfig, CorsConfig, OpenApiConfig, DatabaseInitializer
│   │   ├── controller/      # REST API endpoints (Auth, Products, Orders, Admin, etc.)
│   │   ├── dto/             # Request & Response Data Transfer Objects
│   │   ├── entity/          # JPA Hibernate entities
│   │   ├── exception/       # GlobalExceptionHandler & custom exceptions
│   │   ├── payment/         # PaymentService (COD & Test Gateway)
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│   │   ├── service/         # Transactional business logic
│   │   └── util/            # Slug and string helpers
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-dev.properties
│   │   └── db/migration/    # Flyway V1 & V2 SQL scripts
│   ├── src/test/java/com/cravelle/ # JUnit 5 and Mockito test suite
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── Dockerfile           # Multi-stage production container build
│   └── .env.example
├── database/
│   ├── schema.sql           # Complete MySQL DDL schema documentation
│   └── seed_data.sql        # Sample catalog products & initial admin accounts
└── README.md
```

---

## 5. Prerequisites

- **Java JDK**: 17 or higher (`java -version`)
- **Maven**: 3.8+ (or use the included `./mvnw`)
- **Node.js**: 18+ or 20+ (`node -v`)
- **npm**: 9+ (`npm -v`)
- **MySQL**: 8.0+ (optional locally, as an in-memory MySQL-compatible database runs automatically for testing and dev)

---

## 6. Environment Variables Configuration

### Backend Environment Variables (`backend/.env` or Render Dashboard)

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Web server port | `8080` |
| `DB_URL` | JDBC URL for MySQL database | `jdbc:mysql://localhost:3306/cravelle?createDatabaseIfNotExist=true&useSSL=false` |
| `DB_USERNAME` | Database username | `root` or `cravelle_user` |
| `DB_PASSWORD` | Database password | `your_secret_db_password` |
| `DB_DRIVER` | JDBC driver class name | `com.mysql.cj.jdbc.Driver` |
| `JWT_SECRET` | 256-bit secret key for HMAC-SHA256 signing | Min 32 character random string |
| `JWT_EXPIRATION_MS`| Token lifetime in ms | `86400000` (24 hours) |
| `FRONTEND_URL` | Allowed CORS origins (comma-separated) | `https://cravelle.vercel.app,http://localhost:5173` |
| `AI_API_KEY` | LLM API key (OpenAI or Google Gemini) | `AIzaSy...` or `sk-...` |
| `AI_MODEL` | LLM model identifier | `gemini-1.5-flash` or `gpt-4o-mini` |
| `AI_BASE_URL` | OpenAI-compatible endpoint | `https://generativelanguage.googleapis.com/v1beta/openai` |

### Frontend Environment Variables (`frontend/.env` or Vercel Dashboard)

| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_BASE_URL` | URL to the deployed Java backend | `http://localhost:8080` (local) or `https://cravelle-backend.onrender.com` (prod) |

---

## 7. Local Setup & Execution Instructions

### Step 1: Run the Backend

```bash
cd backend

# Build and execute all tests
./mvnw clean test

# Run the Spring Boot application locally
./mvnw spring-boot:run
```
*(On Windows PowerShell, use `.\mvnw.cmd spring-boot:run` or `mvn spring-boot:run`).*

The backend starts on `http://localhost:8080`.
- **Health Check**: `http://localhost:8080/health`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

#### Default Pre-Seeded Accounts:
- **Administrator**: `admin@cravelle.com` / `Cravelle123!`
- **Customer**: `sophia@example.com` / `Cravelle123!`

### Step 2: Run the Frontend

In a separate terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 8. Cravelle AI Assistant Architecture

The Cravelle AI assistant implements strict database grounding:
1. The customer sends an inquiry to `POST /api/chat`.
2. The `ChatbotService` extracts styling keywords, occasion, or budget and queries matching active products from MySQL via `ProductRepository`.
3. If the user is authenticated and asks about order tracking, their recent orders are retrieved from `OrderRepository`.
4. A grounded prompt is assembled with store policies, real verified products with exact IDs, and recent conversation history.
5. The `LlmClient` dispatches the request to the configured LLM API. If the key is unconfigured or a network timeout occurs, an intelligent catalog synthesis fallback executes seamlessly.
6. Recommended product IDs in the response are verified against the database before returning structured `ProductRecommendationCard` widgets to the frontend.

---

## 9. Deployment Instructions

### Deploy Frontend on Vercel

1. Push your repository to GitHub.
2. In the Vercel dashboard, click **Add New Project** and select your repository.
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, set:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com`
5. Deploy. `frontend/vercel.json` ensures full SPA client-side routing on page refresh.

### Deploy Backend on Render

1. Create a managed MySQL instance (on Aiven, PlanetScale, Railway, or AWS RDS).
2. On Render, click **New +** &rarr; **Web Service**.
3. Select your repository and set the **Root Directory** to `backend`.
4. Set the **Environment** to `Docker` (Render will automatically detect `backend/Dockerfile`).
5. In **Environment Variables**, configure:
   - `DB_URL`: `jdbc:mysql://<host>:<port>/<dbname>?useSSL=true&requireSSL=true&serverTimezone=UTC`
   - `DB_USERNAME`: `<your_db_username>`
   - `DB_PASSWORD`: `<your_db_password>`
   - `DB_DRIVER`: `com.mysql.cj.jdbc.Driver`
   - `JWT_SECRET`: `<a-secure-random-32-char-string>`
   - `FRONTEND_URL`: `https://<your-vercel-domain>.vercel.app`
   - `AI_API_KEY`: `<your_gemini_or_openai_api_key>`
   - `AI_MODEL`: `gemini-1.5-flash`
   - `AI_BASE_URL`: `https://generativelanguage.googleapis.com/v1beta/openai`
6. Click **Deploy Web Service**. Flyway will automatically run schema migrations `V1` and `V2` upon startup.

---

## 10. Testing

### Run Backend Unit & Integration Tests:
```bash
cd backend
mvn clean test
```

### Run Frontend Production Build Validation:
```bash
cd frontend
npm run build
```

---

## 11. Security & Best Practices Summary

- Plaintext passwords are never stored; all credentials use BCrypt hashing.
- Controllers never touch raw database entities; DTOs ensure encapsulation.
- All monetary totals and inventory deductions are computed and executed on the backend within ACID transactions.
- Wildcard CORS is prohibited when handling authenticated requests.
- Chatbot prompts never leak API secrets, and product recommendations are strictly checked against existing inventory.
