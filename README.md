# 🏛️ GrandVenues — Party & Wedding Hall Booking System

A full-stack, production-ready web application for party and wedding hall reservations, real-time slot availability checking, race-condition protected online booking, and venue administration.

Built following the specification from [`hall-booking-system-plan.md`](file:///C:/Users/abdur/Downloads/hall-booking-system-plan.md).

---

## 🚀 Key Highlights & Features

- **Venue Catalog & Hall Browsing**:
  - Filter halls by search query, guest capacity range, and pricing per slot.
  - Photo gallery with thumbnails, amenity checklists, and tariff breakdowns.
- **Real-Time Availability Checker**:
  - Color-coded date picker calendar.
  - Slot availability checking across `Morning (09:00 - 14:00)`, `Evening (18:00 - 23:00)`, and `Full Day (09:00 - 23:00)`.
  - Overlap and conflict prevention: If a "Full Day" slot is reserved, morning and evening slots are automatically marked unavailable, and vice versa.
- **Online Booking & Race Condition Guard**:
  - Form validation with React Hook Form.
  - Database transactions to prevent double-booking collisions.
  - Unique booking references generated in format `HALL-YYYY-XXXXX`.
  - Instant online payment or pay-at-venue reservation options.
- **Notifications & Communication**:
  - Automated HTML email notification simulator and Nodemailer integration for booking receipts, venue confirmations, cancellations, and admin alerts.
- **Manager / Admin Dashboard**:
  - Dashboard analytics: Total bookings, pending reviews, revenue, and occupancy rate.
  - Searchable, filterable bookings table with CSV export.
  - Confirm / Cancel booking status actions.
  - Hall management: Add new venues, upload photos, edit descriptions, adjust capacities, and set prices.
- **Track & Manage Booking**:
  - Self-serve booking status tracking and cancellation for customers.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React.js 18** with **Vite** and **TypeScript**
- **Tailwind CSS** for responsive styling
- **Lucide Icons**
- **React Hook Form** for form validation
- **React Router v6**
- **Zustand** for lightweight global state
- **React Hot Toast** for notifications
- **Axios** with API client interceptors

### Backend (`/server`)
- **Node.js** with **Express.js** and **TypeScript**
- **Prisma ORM** (configured with SQLite for zero-friction local execution, fully compatible with PostgreSQL / Supabase)
- **Zod** schema request validation
- **JWT (jsonwebtoken)** + **bcryptjs** for admin authentication
- **Nodemailer** for email notifications (with mock transport fallback)
- **Multer** for venue image uploads
- **Helmet**, **CORS**, and **Express Rate Limit** for security

---

## 📋 Default Credentials

- **Admin Login Portal**: `http://localhost:5173/admin/login`
- **Email**: `admin@hallbooking.com`
- **Password**: `admin123`

---

## 🏁 Quick Start & Running the Project

### 1. Install Dependencies
From the root directory:
```bash
npm run install:all
```
*(Or run `npm install` inside both `server` and `client` directories).*

### 2. Seed Database (Pre-seeded with 4 Halls, Time Slots & Sample Bookings)
```bash
npm run seed
```

### 3. Run Server & Client Concurrently
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Verification & Automated Tests
To run the end-to-end integration test suite:
```bash
cd server
npx tsx test-api.ts
```
This tests hall retrieval, slot calculations, race condition collision guards, email dispatching, payment verification, and admin dashboard metrics.

---

## 📁 Project Architecture

```
party-hall/
├── package.json              # Root concurrent launcher
├── README.md
├── server/
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma schema (Halls, Slots, Bookings, Admins)
│   │   ├── seed.ts           # Sample data seed
│   │   └── dev.db            # SQLite database
│   ├── src/
│   │   ├── config/           # Database & environment variables
│   │   ├── middleware/       # JWT auth, Zod validation, error handler
│   │   ├── modules/
│   │   │   ├── halls/        # Hall listing, details, and CRUD
│   │   │   ├── availability/ # Slot overlap & availability algorithm
│   │   │   ├── bookings/     # Booking transactions and payments
│   │   │   └── admin/        # Auth, stats, reports, and CSV export
│   │   ├── services/         # Email notifications & payment service
│   │   ├── app.ts            # Express configuration & security
│   │   └── server.ts         # Server bootstrap
│   ├── uploads/              # Local uploaded images
│   ├── test-api.ts           # Automated test suite
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── client/
    ├── src/
    │   ├── api/              # Axios API clients
    │   ├── components/
    │   │   ├── common/       # Navbar, Footer, Badge, LoadingSpinner
    │   │   ├── halls/        # HallCard, HallGallery, AmenitiesList
    │   │   ├── booking/      # AvailabilityCalendar, SlotSelector, BookingForm
    │   │   └── admin/        # StatsCard, BookingTable, HallFormModal
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Halls.tsx
    │   │   ├── HallDetail.tsx
    │   │   ├── BookingPage.tsx
    │   │   ├── BookingSuccess.tsx
    │   │   ├── CheckBooking.tsx
    │   │   └── admin/        # AdminLogin, AdminDashboard, AdminBookings, AdminHalls
    │   ├── store/            # Zustand auth and booking store
    │   ├── types/            # TypeScript data contracts
    │   ├── App.tsx           # Routes & route protection
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.ts
    ├── package.json
    └── tsconfig.json
```
