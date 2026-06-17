# Event Booking System - Interview Q&A

This document covers potential interview questions and comprehensive answers based on the architecture and design decisions made for the Event Ticket Booking application (MERN stack).

## 1. Architecture & General Concepts

**Q: What is the overall architecture of this application?**
A: The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js). 
- **Frontend**: A React SPA that handles UI state, routing, and real-time user feedback. It communicates with the backend via REST APIs.
- **Backend**: A Node/Express server handling business logic, authentication, and database interactions.
- **Database**: MongoDB serves as the primary data store, utilizing multi-document transactions to guarantee data consistency during concurrent bookings.

**Q: Why did you choose MongoDB for this project?**
A: MongoDB's document model maps perfectly to our domain (Events, Seats, Reservations, Users). Crucially, MongoDB supports multi-document ACID transactions (introduced in v4.0+). This allows us to guarantee that checking seat availability and updating seat statuses across multiple documents happens atomically, which is critical for preventing double bookings.

## 2. Preventing Double Bookings & Concurrency

**Q: How do you prevent double booking when multiple users try to reserve the same seat simultaneously?**
A: We prevent double booking using MongoDB **Multi-Document Transactions** and **Atomic Updates**.
1. When a user requests to reserve seats, the backend starts a transaction session.
2. It queries all requested seats where the status is strictly `'available'`.
3. If the number of seats returned matches the number requested, it means no one else grabbed them.
4. Within the same transaction, it updates those seats to `'reserved'` and creates a `Reservation` document.
5. If another user attempts to reserve the same seats simultaneously, the query in step 2 will fail to find all requested seats as `'available'` because the first transaction has locked/modified them, causing the second request to safely abort and return an error to the user.

**Q: What happens if the database crashes in the middle of a booking transaction?**
A: Because we use ACID transactions, the operations are all-or-nothing. If the database crashes or the Node server fails before the transaction is explicitly committed (`session.commitTransaction()`), MongoDB automatically rolls back all changes (seat status updates and reservation creation). The data remains in its consistent state prior to the attempt.

## 3. The Reservation Lifecycle

**Q: How do you handle the 10-minute reservation timer?**
A: There are two mechanisms working together to handle expirations:
1. **Frontend Countdown**: The React app receives the `expiresAt` timestamp from the server when a reservation is created. It runs a local interval to display a real-time countdown to the user.
2. **Backend TTL Index / Cron Job**: Relying on the frontend is insecure, so the backend enforces the timeout. A MongoDB TTL (Time-To-Live) index automatically deletes `Reservation` documents after 10 minutes. Furthermore, a background Node cron job periodically scans for expired reservations and resets the associated seats back to the `'available'` state so they can be booked by others.

**Q: What is the difference between a "Reservation" and a "Booking"?**
A: 
- **Reservation**: A temporary lock (10 minutes) on a seat. The seat status is `'reserved'`, and a `Reservation` document tracks the expiration time. The user has not finalized the transaction yet.
- **Booking**: The permanent confirmation. When a user confirms, the `Reservation` document is deleted, the seat status is permanently updated to `'booked'`, and a `Booking` record is generated.

## 4. Frontend State & Error Handling

**Q: How do you handle a scenario where a user sees a seat as "available" on the grid, but when they click "Reserve", it's no longer available?**
A: This is a classic concurrency issue. The frontend grid represents a snapshot in time. If a user clicks "Reserve" but the backend transaction fails (because another user beat them to it), the backend returns a `400 Bad Request` with an error indicating the seats are no longer available. 
The React frontend catches this API error, displays a toast notification (ErrorBanner) to the user, and re-fetches the latest seat data (`/api/events/:id/seats`) to refresh the grid with the correct, up-to-date statuses.

**Q: How did you implement component-based architecture in React for this app?**
A: The UI is broken down into reusable components:
- **Layouts**: `Header`, `PageContainer`
- **Common UI**: `Button`, `ErrorBanner`, `Spinner`
- **Feature Specific**: `SeatGrid`, `Legend`, `ReservationTimer`
This promotes reusability, easier testing, and separation of concerns. Custom hooks (like `useSeatSelection`, `useEvents`) abstract away complex state logic and API fetching from the visual components.

## 5. Security & Authentication

**Q: How is user authentication handled?**
A: We use JWT (JSON Web Tokens). When a user logs in or registers, the server generates a token containing their user ID and role, signed with a secret key. This token is stored securely on the frontend (localStorage/Context) and sent in the `Authorization` header (`Bearer <token>`) for all protected API requests. The backend `authMiddleware` verifies this token before allowing access to routes like `/api/reserve` or `/api/bookings`.

**Q: How do you handle authorization (e.g., preventing a regular user from accessing Admin routes)?**
A: The JWT payload includes the user's `role` (e.g., `'user'` or `'admin'`). 
- On the backend, an `adminMiddleware` checks `req.user.role === 'admin'`. If not, it returns a `403 Forbidden` error.
- On the frontend, an `<AdminRoute>` wrapper component checks the context state. If the user is not an admin, it redirects them away from admin dashboard routes.

## 6. Performance & Optimization

**Q: How do you optimize database queries for speed, especially when fetching thousands of seats?**
A: 
1. **Indexes**: We index fields that are frequently queried together, such as `{ eventId: 1, seatNumber: 1 }` on the Seat collection.
2. **Lean Queries**: We use Mongoose's `.lean()` method for read-only endpoints (like fetching the seat grid). This bypasses the heavy Mongoose document instantiation and returns plain JavaScript objects, significantly reducing memory overhead and response times.
