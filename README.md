# 🍔 Bite Now

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=white)

> **Bite Now — Fresh Food, Delivered Fast**

Bite Now is a production-ready, real-time food delivery platform built as a monorepo with a React + Vite frontend and an Express + PostgreSQL backend.

## 🚀 About the Project

Bite Now enables customers to browse restaurants, place orders, track delivery in real time, and manage favorites and reviews. The platform supports restaurant owners with menu administration and order management, delivery partners with live location tracking, and administrators with analytics and user management.

**Target audience:** students, developers, startups, and businesses looking for a modern food delivery proof-of-concept.

**Key goals:**
- Provide a full-featured food delivery experience
- Showcase real-time ordering and tracking using Socket.IO
- Demonstrate scalable monorepo architecture
- Use modern frontend and backend tooling with production-ready deployment options

## ⭐ Features

### Customer Features
- Browse restaurants with search and filtering
- View restaurant menus, categories, and item details
- Add items to cart and manage quantities
- Place orders with real-time status updates
- Track order progress live on a map
- Leave reviews and ratings for completed orders
- Save favorite restaurants for repeat visits

### Restaurant Owner Features
- Owner dashboard for restaurant operations
- Manage menu items, categories, pricing, and availability
- Receive new orders in real time
- Accept, prepare, and update order status
- View order history and analytics

### Delivery Partner Features
- Delivery partner login workflow
- Accept available delivery requests
- Share live GPS location during delivery
- Update delivery status and mark orders delivered
- Track route progress with map-based UI

### Admin Features
- Admin dashboard to manage users, orders, and restaurants
- Monitor system analytics and platform health
- Control user roles and access
- Review restaurant activity, orders, and customer feedback

## 🧱 Built With

### Frontend
- React (Vite)
- Tailwind CSS
- shadcn/ui
- React Router
- Redux Toolkit
- TanStack Query
- React Hook Form
- Framer Motion
- Leaflet + OpenStreetMap

### Backend
- Node.js
- Express.js
- [Socket.IO](https://socket.io/)
- JWT + bcrypt

### Database
- PostgreSQL
- Prisma ORM

### Deployment
- Docker
- Railway / Vercel

## 🖼️ Screenshots

> Replace these placeholders with real screenshots when available.

- **Home Page**
  ![Home Page](./docs/screenshots/home-page.png)
- **Restaurant Detail Page**
  ![Restaurant Detail Page](./docs/screenshots/restaurant-detail.png)
- **Cart Page**
  ![Cart Page](./docs/screenshots/cart-page.png)
- **Order Tracking Page**
  ![Order Tracking Page](./docs/screenshots/order-tracking.png)
- **Owner Dashboard**
  ![Owner Dashboard](./docs/screenshots/owner-dashboard.png)
- **Delivery Dashboard**
  ![Delivery Dashboard](./docs/screenshots/delivery-dashboard.png)
- **Admin Dashboard**
  ![Admin Dashboard](./docs/screenshots/admin-dashboard.png)

## 🧠 Architecture

### Monorepo structure

```text
food-delivery-app/
├── client/          # React + Vite frontend
│   ├── public/
│   └── src/
├── server/          # Express API backend
│   ├── prisma/
│   └── src/
├── Dockerfile
├── .dockerignore
└── README.md
```

### High-level flow

```text
[Customer] -> [React Frontend] -> [Express API] -> [PostgreSQL / Prisma]
                                  ↕
                              [Socket.IO Real-time]
                                  ↕
                           [Delivery Partner / Admin UI]
```

### API pipeline flow

```text
Client request -> Express route -> Controller -> Service -> Prisma DB / Socket.IO event -> Response
```

## 🗄️ Database Schema

Models used in Bite Now:

- **User**: customer, owner, rider, admin
- **Address**: saved delivery addresses
- **Restaurant**: restaurant profile and metadata
- **MenuItem**: restaurant menu items
- **Order**: order details and status
- **OrderItem**: line items for each order
- **Review**: customer reviews and ratings
- **Favorite**: customer favorites and saved restaurants

## 📡 API Endpoints

| Area | Endpoint | Description |
| --- | --- | --- |
| Auth | `POST /api/auth/register` | Create a new user account |
| Auth | `POST /api/auth/login` | Authenticate and obtain JWT |
| Auth | `GET /api/auth/me` | Get current user profile |
| Restaurant | `GET /api/restaurants` | List restaurants and search |
| Restaurant | `GET /api/restaurants/:id` | Get restaurant details |
| Restaurant | `POST /api/restaurants` | Create restaurant (owner) |
| Order | `POST /api/orders` | Place a new order |
| Order | `GET /api/orders` | Get orders for current user |
| Order | `PATCH /api/orders/:id` | Update order status |
| Admin | `GET /api/admin/users` | List users and roles |
| Admin | `GET /api/admin/orders` | List all orders |
| Review | `POST /api/reviews` | Add a review to an order |
| Review | `GET /api/reviews` | List reviews |
| Favorite | `POST /api/favorites` | Add a favorite restaurant |
| Favorite | `GET /api/favorites` | List user favorites |

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 20+
- npm
- PostgreSQL
- Docker (optional)
- `.env` environment variables setup

### Clone repository

```bash
git clone https://github.com/your-username/food-delivery-app.git
cd food-delivery-app
```

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file for the server with values such as:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/fooddelivery
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Run Prisma migrations

```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

### Start servers

```bash
npm run dev:server
npm run dev:client
```

## 💡 Usage Guide

### Customer flow
1. Browse restaurants
2. Search dishes and open restaurant details
3. Add items to cart
4. Checkout and place order
5. Track delivery status live

### Owner flow
1. Login as restaurant owner
2. Manage menu items and prices
3. Accept incoming orders
4. Update order status to preparing and ready

### Rider flow
1. Login as delivery partner
2. Accept available delivery requests
3. Share GPS location while en route
4. Mark orders as delivered when complete

## 🔐 Test Credentials

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer1@fooddelivery.test` | `password123` |
| Owner | `owner1@fooddelivery.test` | `password123` |
| Rider | `rider1@fooddelivery.test` | `password123` |
| Admin | `admin@fooddelivery.test` | `password123` |

## 📦 Module Progress

| Module | Description | Status |
| --- | --- | --- |
| 1 | Project Initialization | ✅ Complete |
| 2 | Folder Structure | ✅ Complete |
| 3 | UI/UX Design System | ✅ Complete |
| 4 | React Frontend Setup | ✅ Complete |
| 5 | Backend Setup | ✅ Complete |
| 6 | PostgreSQL + Prisma Setup | ✅ Complete |
| 7 | Authentication (JWT) | ✅ Complete |
| 8 | Restaurant & Menu Management | ✅ Complete |
| 9 | Cart & Order Management | ✅ Complete |
| 10 | Real-Time Order Tracking (Socket.IO) | ✅ Complete |
| 11 | Map Integration (Leaflet + OpenStreetMap) | ✅ Complete |
| 12 | Delivery Partner Live GPS Sharing | ✅ Complete |
| 13 | Admin Dashboard | ✅ Complete |
| 14 | Authentication UI (Login & Register Pages) | ✅ Complete |
| 15 | Restaurant Browsing & Menu Pages | ✅ Complete |
| 16 | Cart & Checkout UI | ✅ Complete |
| 17 | Restaurant Owner Dashboard | ✅ Complete |
| 18 | Delivery Partner Dashboard | ✅ Complete |
| 19 | Order History & Restaurant Search/Filter | ✅ Complete |
| 20 | Admin Dashboard UI | ✅ Complete |
| 21 | Ratings & Reviews | ✅ Complete |
| 22 | Order Cancellation | ✅ Complete |
| 23 | General Polish Pass (skeletons, error boundary, mobile nav) | ✅ Complete |
| 24 | Accessibility Improvements | ⏳ Pending |
| 25 | Multi-language Support | ⏳ Pending |
| 26 | Payment Gateway Integration | ⏳ Pending |
| 27 | Push Notifications | ⏳ Pending |
| 28 | Performance Optimization | ⏳ Pending |
| 29 | E2E Testing | ⏳ Pending |
| 30 | Production Deployment | ⏳ Pending |

## 👥 Project Team

- Project Owner — Fullstack Developer
- Solo developer building Bite Now with a focus on real-time delivery, mobile-friendly UX, and scalable architecture.

## 📄 License

This project is licensed under the **MIT License**.

---

> Bite Now is a production-ready, real-time food delivery platform designed to showcase restaurant discovery, cart-based ordering, live delivery tracking, and admin operations.
