# BookEase — Product Specification

**Multi-tenant SaaS booking platform**

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | March 2026 |
| **Stack** | Nuxt 3 / TailwindCSS / Pinia / MongoDB |
| **Status** | Draft |

---

## PART I — FUNCTIONAL SPECIFICATION

---

### 1. Project Overview

#### 1.1 Context

BookEase is a SaaS web platform that enables any type of business (hair salon, cinema, event venue, etc.) to offer an online booking system to their customers. The application is built on a multi-tenant architecture: each manager has their own isolated space, configurable to fit their business type.

#### 1.2 Goals

- Allow a manager to create and manage their business online
- Allow their customers to browse availability and book a time slot or a seat
- Deliver a smooth, modern, and responsive experience
- Be extensible to new resource types without architectural rework

#### 1.3 Primary Use Cases

- **Hair salon**: appointment booking on time slots defined by a service provider
- **Cinema / event**: seat booking in a fixed-capacity venue for a scheduled screening or event

---

### 2. Personas

| Persona | Description | Key needs |
|---|---|---|
| **Manager (tenant)** | Owner of a business registered on BookEase | Manage resources, slots, and bookings |
| **End customer** | User who wants to book a service | Find an available slot, book easily |
| **Super Admin** | BookEase platform administrator | Oversee tenants, moderate, access global stats |

---

### 3. Functional Scope

#### 3.1 Authentication & Account Management

- Sign up / sign in via email + password
- OAuth sign in (Google) — optional in v2
- Roles: `super_admin` / `manager` / `client`
- Profile management (name, email, password)
- Password reset via email

#### 3.2 Business Management Module (Manager)

- Create a business with: name, description, category, logo, address
- Configure booking type: by time slot (hair salon) or by seat/screening (cinema)
- Manage resources: service providers (hairdresser), rooms / screenings (cinema)
- Define opening hours
- Enable / disable bookings
- Configure optional online payment per business

#### 3.3 Booking Module (Customer)

- Search and browse a business
- View available slots or seats in real time
- Select and confirm a booking
- Online payment if enabled by the manager (via Stripe)
- Receive a confirmation email
- Cancel a booking (subject to the business's cancellation policy)

#### 3.4 Manager Dashboard

- Overview: bookings for today, this week, this month
- Booking list and management (statuses: confirmed, cancelled, pending)
- Basic statistics: fill rate, revenue, attendance
- Notifications on new bookings or cancellations

#### 3.5 Administration Module (Super Admin)

- List of all registered tenants
- Activate / suspend a tenant
- Global platform statistics

---

### 4. Detailed Use Cases

#### UC-01: A manager creates their business

**Actor:** Manager  
**Precondition:** The manager is registered and signed in

**Main flow:**
1. They navigate to their space and click "Create a business"
2. They fill in general information (name, category, description, logo)
3. They choose the booking type (time slots or screenings/seats)
4. They configure their resources (providers or rooms) and opening hours
5. They publish their business — it is now visible to customers

#### UC-02: A customer books a time slot (hair salon)

**Actor:** Customer  
**Precondition:** The business is published and active

**Main flow:**
1. The customer visits the business page
2. They select a service provider and a date
3. They browse available slots and pick one
4. They confirm their booking (payment if enabled)
5. They receive a confirmation email with the details

#### UC-03: A customer books a seat (cinema)

**Actor:** Customer

**Main flow:**
1. The customer browses available screenings
2. They select a screening and view remaining seats
3. They choose their seat(s) and confirm
4. They receive their confirmation email

---

### 5. Business Rules

- A booked slot cannot be booked by another customer (concurrency lock)
- A booking can be cancelled up to X hours before the appointment (configurable by the manager)
- Payment is triggered only if the manager has enabled this option
- Each tenant's data is strictly isolated
- A user can hold both a customer account and a manager account (with different businesses)

---

## PART II — TECHNICAL SPECIFICATION

---

### 6. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Nuxt 3 | SSR/SSG, file-based routing, skill development |
| UI | TailwindCSS | Already mastered, consistent with current stack |
| State management | Pinia | Vue 3 standard, already mastered |
| Backend (API) | Nuxt 3 / Nitro (API routes) | Unified fullstack, no separate Express server |
| Database | MongoDB (Atlas) | Flexible for multi-tenant schemas, free cloud tier |
| ODM | Mongoose | Familiar, simplifies data modeling |
| Authentication | nuxt-auth-utils + bcrypt | Lightweight, Nuxt-native |
| Payment | Stripe (optional) | Industry standard, well documented |
| Emails | Resend + Vue Email | Simple API, Vue-native templates — consistent with the stack |
| Testing | Vitest + Vue Test Utils | Already mastered, consistent |
| CI/CD | GitHub Actions | Native GitHub integration |
| Hosting | Vercel + MongoDB Atlas | Free tier sufficient for demo |

---

### 7. Architecture

#### 7.1 Overview

The application follows a monorepo architecture with Nuxt 3 handling both the frontend and the backend via API routes (powered by Nitro). Data is hosted on MongoDB Atlas. The multi-tenant model is implemented through a `tenantId` field present on every document in the database.

#### 7.2 Project Structure

```
/
├── pages/               # Application routes (Nuxt file-based routing)
├── components/          # Reusable Vue components
├── composables/         # Reusable logic (useAuth, useBooking, etc.)
├── stores/              # Pinia stores (auth, tenant, booking)
├── server/
│   ├── api/             # Nitro API routes (REST)
│   ├── models/          # Mongoose models
│   ├── middleware/       # Auth and tenant middleware
│   └── utils/           # Helpers (email, stripe, etc.)
└── tests/               # Unit and integration tests
```

---

### 8. Data Model

#### 8.1 Collection `User`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `email` | String (unique) | Sign-in email address |
| `passwordHash` | String | Hashed password (bcrypt) |
| `role` | Enum (`super_admin`, `manager`, `client`) | Global user role |
| `firstName` / `lastName` | String | First and last name |
| `createdAt` | Date | Account creation date |

#### 8.2 Collection `Tenant` (Business)

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Tenant identifier |
| `ownerId` | ObjectId (ref: User) | Business manager |
| `name` | String | Business name |
| `category` | Enum (`barbershop`, `cinema`, `event`, ...) | Business type |
| `bookingType` | Enum (`slot`, `seat`) | Booking mode |
| `isActive` | Boolean | Business published or not |
| `paymentEnabled` | Boolean | Online payment enabled |
| `cancellationHours` | Number | Max cancellation window (hours) |
| `slug` | String (unique) | Public URL of the business |

#### 8.3 Collection `Resource` (Provider / Room)

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Resource identifier |
| `tenantId` | ObjectId (ref: Tenant) | Owning tenant |
| `name` | String | Name (e.g. John, Room A) |
| `type` | Enum (`provider`, `room`) | Service provider or room |
| `capacity` | Number | Number of seats (type `room`) |
| `isActive` | Boolean | Resource active |

#### 8.4 Collection `Slot` (Time Slot / Screening)

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Slot identifier |
| `tenantId` | ObjectId (ref: Tenant) | Owning tenant |
| `resourceId` | ObjectId (ref: Resource) | Associated resource |
| `startAt` | Date | Slot or screening start time |
| `endAt` | Date | Slot or screening end time |
| `capacity` | Number | Total seats |
| `bookedCount` | Number | Booked seats |
| `isActive` | Boolean | Slot open for booking |

#### 8.5 Collection `Booking`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Booking identifier |
| `tenantId` | ObjectId (ref: Tenant) | Concerned tenant |
| `slotId` | ObjectId (ref: Slot) | Booked slot |
| `userId` | ObjectId (ref: User) | Customer who booked |
| `status` | Enum (`pending`, `confirmed`, `cancelled`) | Booking status |
| `quantity` | Number | Number of seats booked |
| `paymentStatus` | Enum (`none`, `pending`, `paid`) | Payment status |
| `stripeSessionId` | String | Stripe session ID (if payment) |
| `createdAt` | Date | Booking date |

---

### 9. API Routes

#### 9.1 Authentication

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Sign in and create a session |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/auth/me` | Signed-in user profile |
| `POST` | `/api/auth/reset-password` | Request a password reset |

#### 9.2 Tenants (Businesses)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/tenants` | List all tenants (`super_admin`) |
| `POST` | `/api/tenants` | Create a business |
| `GET` | `/api/tenants/:slug` | Business detail (public) |
| `PUT` | `/api/tenants/:id` | Update own business (`manager`) |
| `DELETE` | `/api/tenants/:id` | Delete a business (`manager`) |

#### 9.3 Slots

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/tenants/:id/slots` | List available slots |
| `POST` | `/api/tenants/:id/slots` | Create a slot (`manager`) |
| `PUT` | `/api/slots/:id` | Update a slot (`manager`) |
| `DELETE` | `/api/slots/:id` | Delete a slot (`manager`) |

#### 9.4 Bookings

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings/me` | My bookings (customer) |
| `GET` | `/api/tenants/:id/bookings` | Tenant bookings (`manager`) |
| `PATCH` | `/api/bookings/:id/cancel` | Cancel a booking |

---

### 10. Security & Multi-tenant Architecture

- Every API request verifies the user's identity through an authentication middleware (server-side session)
- The `tenantId` is always verified server-side — a manager cannot access another tenant's data
- Sensitive routes (create, update, delete) are protected by role verification
- Passwords are hashed with bcrypt (minimum cost factor: 12)
- Sensitive variables (Stripe keys, MongoDB URI, etc.) are stored in environment variables and never committed
- CSRF protection built into Nuxt

---

### 11. Concurrency & Data Integrity

Booking a slot is a critical operation that multiple customers may attempt simultaneously. The chosen strategy is:

- Use `findOneAndUpdate` with a capacity condition (`bookedCount < capacity`) as a single atomic MongoDB operation
- Return a `409 Conflict` error if the slot is full at the time of validation
- When Stripe payment is involved, the booking is first created with a `pending` status, then confirmed via a Stripe webhook after successful payment

---

### 12. Roadmap & Prioritization

| Phase | Content | Priority |
|---|---|---|
| **v1 — MVP** | Auth, tenant creation, slots, simple booking (no payment), confirmation email | High |
| **v1.1** | Manager dashboard, basic statistics, booking cancellation | High |
| **v1.2** | Stripe integration (optional payment) | Medium |
| **v2** | Google OAuth, real-time notifications, mobile app (Nuxt/Capacitor) | Low |
| **v2+** | Multi-language, advanced analytics, public API for third-party integrations | Future |

---

### 13. Testing & Quality

- Unit tests for Vue components with Vitest + Vue Test Utils
- API route tests with Vitest (Mongoose mocks)
- Linting: ESLint + Prettier configured
- CI/CD: GitHub Actions running lint + tests on every push to `main`
- Storybook to document reusable UI components

---

### 14. Environments

| Env | Purpose | Infrastructure |
|---|---|---|
| `development` | Local development | localhost:3000, local MongoDB or Atlas free tier |
| `staging` | Testing and demos | Vercel Preview, MongoDB Atlas |
| `production` | Live version | Vercel Production, MongoDB Atlas |

---

*— End of specification v1.0 —*
