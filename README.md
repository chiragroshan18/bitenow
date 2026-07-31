<div align="center">
  <img src="assets/banner.png" alt="Food Delivery App Banner" width="100%">

  # 🍔 Food Delivery Platform

  **A production-ready, real-time food ordering and tracking ecosystem built with the PERN stack.**

  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
  
  [![Forks](https://img.shields.io/github/forks/rosha/food-delivery-app?style=flat-square)](https://github.com/rosha/food-delivery-app/network/members)
  [![Stars](https://img.shields.io/github/stars/rosha/food-delivery-app?style=flat-square)](https://github.com/rosha/food-delivery-app/stargazers)
  [![Issues](https://img.shields.io/github/issues/rosha/food-delivery-app?style=flat-square)](https://github.com/rosha/food-delivery-app/issues)

  [**Documentation**](#api-documentation) • [**Report Bug**](#) • [**Request Feature**](#)
</div>

---

## 📑 Table of Contents

1. [About The Project](#-about-the-project)
2. [Features](#-features)
3. [Technologies Used](#-technologies-used)
4. [Architecture](#-architecture)
5. [Folder Structure](#-folder-structure)
6. [Installation Guide](#-installation-guide)
7. [Environment Variables](#-environment-variables)
8. [Usage Guide](#-usage-guide)
9. [Screenshots](#-screenshots)
10. [API Documentation](#-api-documentation)
11. [AI Assistant / Technical Internals](#-ai-assistant--technical-internals)
12. [System Oversight / Performance & Security](#-system-oversight--performance--security)
13. [Contributing & License](#-contributing--license)

---

## 🚀 About The Project

### The Problem
Traditional food delivery architectures often suffer from stale data, slow polling-based status updates, and disconnected user experiences across different stakeholder views (Customer, Owner, Driver). 

### The Solution
This platform introduces an event-driven architecture utilizing **WebSockets (Socket.io)** over a robust **PERN (PostgreSQL, Express, React, Node)** foundation to provide sub-second real-time state synchronization across four distinct application interfaces.

### Target Users

| Persona | Role | Primary Needs |
| :--- | :--- | :--- |
| **Hungry Customers** | `CUSTOMER` | Browse restaurants, build carts, securely checkout, track orders in real-time. |
| **Restaurant Owners** | `RESTAURANT_OWNER` | Manage menu availability, accept/reject orders, track live earnings. |
| **Delivery Partners** | `DELIVERY_PARTNER` | Accept delivery assignments, view routing/addresses, update drop-off status. |
| **Platform Admins** | `ADMIN` | Monitor system health, manage user accounts, oversee dispute resolutions. |

### Future Scope
- AI-driven delivery route optimization using spatial mapping APIs.
- Redis-backed rate limiting and caching for high-traffic menu endpoints.
- Integrated payment gateways (Stripe/Razorpay) with escrow mechanisms.

---

## ✨ Features

<details>
<summary><b>🛍️ Customer App Features</b></summary>
<br>

- **Geo-located Restaurant Discovery:** Search and filter restaurants based on distance and rating.
- **Real-time Order Tracking:** Live status updates (`PLACED` -> `DELIVERED`) via WebSockets.
- **Favorites & Reviews:** Save favorite restaurants and leave post-order reviews.
- **Secure Address Management:** Multi-address storage with default selections.
</details>

<details>
<summary><b>🏪 Restaurant Owner Dashboard</b></summary>
<br>

- **Live Order Queue:** Instantly receive new orders without page reloads.
- **Dynamic Menu Management:** Add/edit items, toggle availability, manage categories.
- **Performance Analytics:** Track order volume and review sentiment.
</details>

<details>
<summary><b>🛵 Delivery Partner App</b></summary>
<br>

- **Order Assignments:** Opt-in to available nearby deliveries.
- **Routing & Status:** View customer addresses and sequentially update order states.
</details>

<details>
<summary><b>🛡️ Admin Portal</b></summary>
<br>

- **User Oversight:** Ban/Suspend accounts and manage platform access.
- **System Metrics:** High-level overview of total sales, active drivers, and system health.
</details>

---

## 🛠️ Technologies Used

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, React Router DOM, React Hook Form |
| **State & Fetching**| Redux Toolkit, React Query (@tanstack/react-query), Zod Validation |
| **Backend** | Node.js (v20+), Express.js, Socket.io (WebSockets) |
| **Database/ORM** | PostgreSQL, Prisma Client (`schema.prisma`) |
| **Auth & Security** | JWT (JSON Web Tokens), Bcrypt.js, Helmet, Express CORS |
| **Infrastructure** | Cloudinary (Image Hosting), Multer (File Uploads), Docker (Containerization) |

---

## 🏗️ Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph Client [Client Applications (React)]
        C[Customer App]
        R[Restaurant Dashboard]
        D[Delivery App]
        A[Admin Portal]
    end

    subgraph API [API Gateway & Services (Express/Node)]
        Auth[Auth Service]
        Order[Order Service]
        Menu[Menu Service]
        Geo[Geo & Routing Service]
        WS[WebSocket Manager]
    end

    subgraph Data [Data Layer]
        PG[(PostgreSQL)]
        Prisma[Prisma ORM]
    end

    subgraph External [Third-Party Services]
        Cloudinary[Cloudinary (Images)]
    end

    C --> Auth & Order & Menu & WS
    R --> Auth & Order & Menu & WS
    D --> Auth & Geo & Order & WS
    A --> Auth & Geo

    Auth & Order & Menu & Geo --> Prisma
    Prisma --> PG
    Menu --> Cloudinary
```

### Order Placement Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant API as Express API
    participant WS as Socket Manager
    participant DB as PostgreSQL
    actor Owner as Restaurant Owner

    Customer->>API: POST /api/orders (Cart Data)
    API->>DB: Prisma.Order.create()
    DB-->>API: orderId
    API->>WS: emit("new_order", orderDetails)
    WS-->>Owner: Receive "new_order" event
    API-->>Customer: 201 Created (Order Placed)
    Owner->>API: PUT /api/orders/{id}/status (ACCEPTED)
    API->>DB: Prisma.Order.update()
    API->>WS: emit("order_status_changed", ACCEPTED)
    WS-->>Customer: Receive status update
```

---

## 📂 Folder Structure

```text
food-delivery-app/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level views (Admin, Delivery, Owner)
│   │   ├── routes/             # AppRoutes, PrivateRoutes
│   │   ├── services/           # API fetchers (auth, order, restaurant)
│   │   ├── store/              # Redux slices (auth, cart, ui)
│   │   └── utils/              # Helper functions (geo.js)
│   └── package.json
├── server/                     # Node/Express Backend
│   ├── prisma/                 # Database schema & migrations
│   │   ├── schema.prisma       # Prisma declarative schema
│   │   └── seed.js             # DB seeding scripts
│   ├── src/
│   │   ├── config/             # DB, Cloudinary, Multer configurations
│   │   ├── controllers/        # Request handlers (auth, orders, etc.)
│   │   ├── middlewares/        # Auth, Validation, Error Handling
│   │   ├── models/             # Business logic interfaces
│   │   ├── routes/             # Express Router definitions
│   │   ├── services/           # Core business logic & external APIs
│   │   ├── sockets/            # Socket.io event listeners & emitters
│   │   └── validators/         # Zod schemas for payload validation
│   └── index.js                # Server entry point
├── docker-compose.yml          # Optional: Local infrastructure orchestration
├── package.json                # Root workspace configuration
└── README.md
```

---

## ⚙️ Installation Guide

### Prerequisites
- **Node.js** >= 20.0.0
- **PostgreSQL** installed and running locally.
- **Cloudinary** Account for image uploads.

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rosha/food-delivery-app.git
   cd food-delivery-app
   ```

2. **Install Dependencies (Workspace Setup)**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**
   Duplicate `.env.example` to `.env` in both `server/` and `client/` directories and fill in the values (see [Environment Variables](#-environment-variables)).

4. **Database Setup (Prisma)**
   ```bash
   cd server
   npx prisma migrate dev --name init
   npx prisma generate
   npm run prisma:seed # Optional: Populate mock data
   ```

5. **Start Development Servers**
   From the root directory:
   ```bash
   # Terminal 1: Run the backend
   npm run dev:server
   
   # Terminal 2: Run the frontend
   npm run dev:client
   ```

### Docker Setup
If utilizing the provided `Dockerfile`:
```bash
docker build -t food-delivery-app .
docker run -p 5000:5000 --env-file server/.env food-delivery-app
```

---

## 🔐 Environment Variables

### `server/.env`
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | API Server Port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/food_app` |
| `JWT_SECRET` | Secret key for signing tokens | `supersecretkey_1234` |
| `CLOUDINARY_URL` | Cloudinary connection URI | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` |

### `client/.env`
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Express server URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |

---

## 📖 Usage Guide

### Placing an Order (Customer)
1. Register/Login as a `CUSTOMER`.
2. Browse the homepage and click on an available Restaurant.
3. Add `MenuItem`s to your Cart.
4. Proceed to Checkout, select a saved `Address`.
5. Submit the order and remain on the `OrderTracking` page to watch live updates.

### Fulfilling an Order (Restaurant)
1. Login with a `RESTAURANT_OWNER` account.
2. Navigate to `/owner-dashboard`.
3. Incoming orders will pop up instantly. Click **Accept** to change status to `PREPARING`.
4. Update to `READY_FOR_PICKUP` once cooking is complete.

---

## 📸 Screenshots

| Customer Dashboard | Order Tracking (Live) |
| :---: | :---: |
| ![Customer](docs/screenshots/customer-home.png) | ![Tracking](docs/screenshots/live-tracking.png) |
| *Browsing restaurants with live map integration.* | *Real-time order status and delivery updates.* |

| Restaurant Owner Panel | Admin Oversight |
| :---: | :---: |
| ![Owner](docs/screenshots/owner-dashboard.png) | ![Admin](docs/screenshots/admin-panel.png) |
| *Managing incoming orders and updating menu items.* | *Platform-wide metrics and user management.* |

*(Note: Replace placeholder paths with actual image assets in `/docs/screenshots/`)*

---

## 🔌 API Documentation

**Base URL:** `http://localhost:5000/api`  
**Authentication:** Bearer Token required via `Authorization` header.

### 1. Authenticate User
**`POST /api/auth/login`**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "password123"}'
```
**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "user": {
    "id": "uuid-123",
    "email": "user@test.com",
    "role": "CUSTOMER"
  }
}
```

### 2. Place Order
**`POST /api/orders`**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "restaurantId": "rest-uuid",
        "addressId": "addr-uuid",
        "items": [
          {"menuItemId": "item-uuid", "quantity": 2, "price": 12.99}
        ]
      }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "order": {
    "id": "order-uuid",
    "status": "PLACED",
    "totalAmount": 25.98
  }
}
```

---

## 🤖 AI Assistant / Technical Internals

To ensure robust data consistency across our decentralized services:
- **Execution Pipeline:** Validations are run linearly: `Zod Request Validation` -> `Role Authorization` -> `Business Logic` -> `Prisma Transaction` -> `Socket Emission`.
- **Fallback Strategies:** If the Socket server disconnects, the client gracefully degrades to React Query's smart polling mechanism every 15 seconds.
- **Data Grounding:** Geographic bounding boxes ensure customers can only query and place orders at restaurants within a 15-mile radius, calculated at the database level.

---

## 🛡️ System Oversight / Performance & Security

- **Strict Validation:** Every request payload is structurally verified using Zod schemas (`src/validators`) before reaching controllers.
- **Security Headers:** The Express app is wrapped in `Helmet.js` to prevent XSS, clickjacking, and sniff attacks.
- **Password Hashing:** Bcrypt implements salt-round scaling to protect user passwords at rest.
- **Optimized Queries:** Prisma ORM utilizes efficient SQL batching and selected `includes` to prevent N+1 query problems.

---

## 🤝 Contributing & License

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**License:** This project is licensed under the UNLICENSED model.

---

## 👨‍💻 Author & Acknowledgements

- Built with ❤️ by **[rosha]**
- Special thanks to the open-source maintainers of Vite, Prisma, and Socket.io.
