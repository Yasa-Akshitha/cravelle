# Cravelle — AI-Powered Food Discovery & Delivery Platform

Cravelle is a modern, responsive full-stack food recommendation and delivery web application. Cravelle helps users discover food based on the places they visit every day (colleges, tech offices, shopping malls, parks, and neighbourhoods), their current GPS location, personal food preferences, meal budget, and cravings.

The platform provides end-to-end food discovery, an intelligent **Cravelle AI Concierge** grounded in verified local menus, cart and checkout workflows, live 6-stage delivery progression tracking with simulated demo advancement, and an authorized administrative management portal.

---

## 1. System Architecture

```text
cravelle/
├── frontend/                     # React.js 18 + Vite 5 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, LocationModal, RestaurantCard, DishCard,
│   │   │                         # NearbyMap, CartDrawer, CravelleAIChatbot, Footer
│   │   ├── pages/                # HomePage, RestaurantListingPage, RestaurantDetailPage,
│   │   │                         # CheckoutPage, OrdersListPage, OrderTrackingPage,
│   │   │                         # ProfilePage, AdminDashboardPage, LoginPage, RegisterPage
│   │   ├── context/              # AuthContext, LocationContext, CartContext
│   │   ├── services/             # api, auth, restaurant, location, recommendation,
│   │   │                         # cart, order, chat, admin
│   │   └── types/                # Strict TypeScript interfaces for all domain entities
│   ├── package.json
│   └── vercel.json               # SPA routing rewrite configuration for Vercel
├── backend/                      # Java 17/21 + Spring Boot 3.2.5 (Maven)
│   ├── src/main/java/com/cravelle/
│   │   ├── config/               # SecurityConfig, CorsConfig, DatabaseInitializer, Swagger
│   │   ├── controller/           # Auth, Location, Recommendation, Restaurant, Dish,
│   │   │                         # Cart, Order, Chatbot, Admin, Health, UserPreference
│   │   ├── service/              # Business logic & transaction handling
│   │   ├── repository/           # 19 Spring Data JPA repositories
│   │   ├── entity/               # Hibernate JPA entities
│   │   ├── dto/                  # Request & response transfer objects with validation
│   │   ├── security/             # JWT authentication filter & user principal
│   │   ├── recommendation/       # Haversine distance math & place rationale synthesis
│   │   ├── delivery/             # 6-stage delivery tracking & demo simulator
│   │   └── chatbot/              # Grounded LLM client & verified dish synthesizer
│   ├── src/main/resources/
│   │   ├── db/migration/         # Flyway migrations (V1__init_food_schema, V2__seed_food_data)
│   │   └── application.properties
│   ├── Dockerfile                # Multi-stage production container build for Render
│   └── pom.xml
├── database/
│   ├── schema.sql                # Production MySQL 8 schema (18 food tables)
│   └── seed_data.sql             # Production seed restaurants, dishes & places
└── README.md
```

---

## 2. Technology Stack

### Frontend (Deploy on Vercel)
- **Framework**: React 18 with Vite 5 and TypeScript
- **Styling**: Tailwind CSS 3.4 with custom warm food palette (`cravelle` orange, `coral`, `cream`, `charcoal`, `veg` green, `nonveg` red)
- **Typography**: Google Fonts (*Outfit* display headers & *Plus Jakarta Sans* body)
- **Routing**: React Router 6 SPA
- **HTTP Client**: Axios with automatic JWT Bearer token injection and ApiResponse unwrapping
- **Icons**: Lucide React
- **Maps**: Interactive Food Radar component with coordinate pins and user GPS center

### Backend (Deploy on Render)
- **Language & Runtime**: Java 17+ (Java 21 compatible)
- **Framework**: Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Spring Security)
- **Build Tool**: Apache Maven (with `mvnw` and `mvnw.cmd`)
- **Security**: Stateless JWT authentication (JJWT 0.12.5) with BCrypt password hashing
- **Database Engine**: MySQL 8.0+ (with Flyway migration management and H2 in-memory MySQL mode for local testing)
- **AI Integration**: Spring AI / Java HTTP Client grounded in verified backend database records
- **Documentation**: OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
- **Testing**: JUnit 5 and Mockito test suite

---

## 3. Core Features

### 1. Location & Place-Based Discovery
- **Browser Geolocation API**: Prompt for GPS access with fallback manual location selection.
- **Places You Visit**: Personalized food recommendations inspired by:
  - **Colleges & Campuses** (e.g. PES University Campus)
  - **Offices & Tech Parks** (e.g. Prestige Tech Cloud, RMZ Ecospace)
  - **Shopping Malls** (e.g. Phoenix Marketcity)
  - **Neighbourhoods & Hubs** (e.g. Indiranagar 100ft Road, Koramangala 5th Block)
- **Saved Places Manager**: Users can save and manage their daily hubs with one click.
- **Privacy & Consent**: Transparent location tracking with clear-history and delete-place controls.

### 2. Grounded AI Food Concierge (Cravelle AI)
- Floating assistant drawer accessible across every page.
- Natural-language queries (e.g., *"What should I eat near my college under ₹250?"*, *"Suggest healthy bowls near my office"*).
- Grounded strictly in actual restaurant and dish records from the backend database (no hallucinated prices or restaurants).
- Renders interactive dish cards with price, rating, and direct **Order** action buttons.

### 3. Food Ordering & Live 6-Stage Delivery Tracking
- Single-restaurant cart validation with automated item totals, delivery fees, and 5% GST taxes.
- Cash on Delivery (COD) and Razorpay Test Mode checkout options.
- Visual 6-Stage Delivery Progression:
  1. `ORDER_PLACED`
  2. `RESTAURANT_CONFIRMED`
  3. `BEING_PREPARED`
  4. `READY_FOR_PICKUP`
  5. `OUT_FOR_DELIVERY`
  6. `DELIVERED`
- **Simulate Next Step (Demo Mode)**: Interactive button on the tracking page to advance the simulated delivery stage in real-time.

### 4. Admin Dashboard
- Role-protected management for partner restaurants and menus.
- Real-time stock toggle (`In Stock` / `Sold Out`).
- Live order status dispatcher and revenue metrics.

---

## 4. Pre-Seeded Test Credentials

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@cravelle.com` | `Cravelle123!` | Full admin dashboard access |
| **Customer** | `rahul@example.com` | `Cravelle123!` | Student @ PES University campus |
| **Customer** | `priya@example.com` | `Cravelle123!` | Techie @ Prestige Tech Park |

---

## 5. Local Setup & Running Instructions

### Prerequisites
- Java Development Kit (JDK 17 or JDK 21)
- Node.js 18+ and npm

### 1. Run Backend (Java Spring Boot)
```bash
cd backend

# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux/macOS:
./mvnw spring-boot:run
```
*The backend starts at `http://localhost:8080`. Flyway automatically creates the database schema and seeds sample restaurants, dishes, and places.*

### 2. Run Frontend (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
*The frontend starts at `http://localhost:5173`.*

### 3. Run Backend Automated Tests
```bash
cd backend
.\mvnw.cmd test
```
*Runs all 6 unit and integration test suites (`CravelleApplicationTests`, `AuthServiceTest`, `CartServiceTest`, `ChatbotServiceTest`).*

---

## 6. Environment Variables

### Backend (`backend/.env` or Render environment settings)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP port for backend server | `8080` |
| `DB_URL` | MySQL JDBC connection string | `jdbc:mysql://localhost:3306/cravelledb` |
| `DB_USERNAME` | MySQL database user | `root` |
| `DB_PASSWORD` | MySQL database password | `password` |
| `JWT_SECRET` | 256-bit secret string for token signing | `cravelleSecretKeyFoodTechApp2026SecureLongString123` |
| `AI_API_KEY` | Real AI Language Model API key | `""` (graceful verified synthesizer fallback active) |
| `AI_MODEL` | AI model identifier | `gemini-1.5-flash` |
| `FRONTEND_URL` | Deployed frontend domain for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env` or Vercel environment settings)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | URL pointing to the deployed Java backend | `http://localhost:8080` |

---

## 7. Deployment Instructions

### Deploy Frontend to Vercel
1. Link your GitHub repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   - `VITE_API_BASE_URL`: URL of your deployed Render backend (e.g. `https://cravelle-backend.onrender.com`).

### Deploy Backend to Render
1. Create a new **Web Service** on Render pointing to your repository.
2. Select **Docker** environment (uses `backend/Dockerfile`), or **Java Maven** runtime.
3. Root Directory: `backend`.
4. Environment Variables:
   - Configure `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and `FRONTEND_URL`.
   - Set `PORT` to `8080` (or leave default for Render).
5. The healthcheck endpoint is live at `/health`.
