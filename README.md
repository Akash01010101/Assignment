# Event Ticket Booking System

This is a production-grade, full-stack seat reservation and booking system. It includes both a user-facing booking flow (with robust concurrency handling to prevent double-bookings) and an Admin panel to manage events, oversee seats, and view the bookings dashboard.

## Tech Stack
- **Backend**: Node.js 20 LTS + Express 4
- **Database**: MongoDB 7 + Mongoose 8
- **Auth**: JWT (access token only) + bcrypt for password hashing + role-based access (`user` / `admin`)
- **Frontend**: React 18 (Vite) + Plain CSS
- **HTTP Client**: Axios
- **Local DB**: Docker Compose (MongoDB only, configured as a replica set)
- **Process Model**: Two separate processes (Backend on :5000, Frontend on :5173)

## Prerequisites
- Node.js 20+
- Docker and Docker Compose (for MongoDB replica set)
- npm

## Setup & Run — Backend

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Setup Environment Variables:
   ```bash
   cp .env.example .env
   ```
   *Make sure to fill in `JWT_SECRET`, `ADMIN_SEED_EMAIL`, and `ADMIN_SEED_PASSWORD` in your `.env` file.*

3. Start MongoDB Replica Set:
   ```bash
   docker compose up -d
   ```
   **Important:** Wait for the container to start, then initiate the replica set. Run:
   ```bash
   docker exec -it event_booking_mongo mongosh --eval "rs.initiate()"
   ```

4. Seed the database with sample events:
   ```bash
   npm run seed
   ```

5. Create the admin user (required to access the admin panel):
   ```bash
   npm run create-admin
   ```
   *Note: This is the ONLY way to get an admin account; standard registration never produces an admin role.*

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Runs on http://localhost:5000*

7. Run backend tests (requires running MongoDB replica set):
   ```bash
   npm test
   ```

## Setup & Run — Frontend

1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Setup Environment Variables:
   ```bash
   cp .env.example .env
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Runs on http://localhost:5173. Ensure the backend is already running.*

## How To Use It

### As a Regular User
1. Register and Login.
2. Browse the Events List.
3. Click an event to view the seat map.
4. Select available seats and click Reserve to lock them for 10 minutes. Watch the countdown timer.
5. Click Confirm Booking.
6. Check the `/my-bookings` page for your confirmed bookings.
*Note: If the countdown timer expires, the reservation is automatically canceled, and the seats become available again.*

### As an Admin
1. Log in with the credentials configured in `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`.
2. Access the "Admin" link in the header.
3. View the Admin Dashboard for aggregate stats.
4. Go to Events to create a new event.
5. In another browser or incognito window, verify the new event appears in the public event list.
6. From the public view, reserve a seat. Return to the Admin panel to view the reserved seat status.
7. Try deleting the event in the Admin panel while the reservation is active — a blocking error will correctly appear preventing the deletion.

## API Reference

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register` | POST | None | Register new user (always creates `user` role) |
| `/api/auth/register-business` | POST | None | Register a business account (creates user with pending status) |
| `/api/auth/login` | POST | None | Authenticate user |
| `/api/events` | GET | None | List upcoming events with available seats |
| `/api/events/:id` | GET | None | Get event details and seat statuses |
| `/api/reserve` | POST | User | Hold available seats for an event temporarily |
| `/api/bookings` | POST | User | Confirm a temporary reservation |
| `/api/bookings/me` | GET | User | Get user's confirmed bookings |
| `/api/admin/events` | GET | Admin | View all events including past and detailed seat statuses |
| `/api/admin/events` | POST | Admin | Create an event and generate seats |
| `/api/admin/events/:id` | PUT | Admin | Update event details (name, venue, dateTime) |
| `/api/admin/events/:id` | DELETE | Admin | Delete event (fails if active reservations/bookings exist) |
| `/api/admin/events/:id/seats` | GET | Admin | View detailed list of seats for an event |
| `/api/admin/seats/:seatId/release` | PATCH | Admin | Force a reserved seat back to available |
| `/api/admin/bookings` | GET | Admin | View all confirmed bookings (paginated, filterable) |
| `/api/admin/business-applications` | GET | Admin | List all pending, approved, or rejected business applications |
| `/api/admin/business-applications/:id/approve` | PUT | Admin | Approve an application and upgrade user to organizer role |
| `/api/admin/business-applications/:id/reject` | PUT | Admin | Reject an application |
| `/api/admin/stats` | GET | Admin | View aggregate statistics |

## Design Decisions — Double-Booking Prevention
To ensure robust concurrency and prevent double-booking, this system relies on **MongoDB Multi-Document Transactions**:
- **Atomic Operations**: When a user reserves multiple seats, the seat documents are updated and a reservation document is created. If another request attempts to reserve one of these seats simultaneously, the `modifiedCount` verification inside the transaction fails, rolling back all operations and throwing a 409 error.
- **Data Integrity**: At the schema level, a compound unique index on `{ eventId, seatNumber }` guarantees that two physical seats with the same number cannot be created for a single event.
- **Expiration Protection**: The server actively verifies the `expiresAt` timestamp upon booking confirmation, preventing expired reservations from being confirmed regardless of the background TTL cleanup process.

## Design Decisions — Roles & Access Control
The platform relies on three distinct user roles: `user`, `organizer`, and `admin`.

1. **Schema Integrity**: The `User` model defines the `role` field. The standard public registration endpoint deliberately discards any provided `role` value, ensuring a new user is always given the default `user` role.
2. **Business Accounts**: Users can submit an application to become an Event Organizer via the `/api/auth/register-business` endpoint. This creates an account with a `pending` business profile. Only an `admin` can review these applications and upgrade their role to `organizer`.
3. **Middleware Security**: A `requireAdmin` middleware inspects the `role` directly from the validated JWT token. This middleware ensures non-admins receive a 403 Forbidden on any `/api/admin/*` routes. While the frontend UI hides the Admin link for standard users, the true boundary is enforced by this backend middleware.

## Assumptions Made
- A `GET /api/bookings/me` endpoint was added to allow users to view their booking history.
- The `totalSeats` value cannot be altered after an event is created, avoiding the complexity of regenerating and syncing seats.
- Deleting an event with active reservations/bookings is blocked, preventing orphaned references, instead of offering a complex force-cancel-and-notify flow.
- Added Success (`#4ADE80`) and Error (`#FF6B6B`) colors to the design palette for better user feedback mechanisms.

## Known Limitations / What I'd add with more time
- No pagination for the public events list.
- No payment integration or checkout flow.
- No email confirmation notifications.
- No frontend testing suite (e.g., React Testing Library or Cypress).
- No refresh tokens; JWTs are static and expire after 24 hours.
- No force cancellation mechanism for admins when dealing with events with active bookings.
- No audit log of administrative actions.
