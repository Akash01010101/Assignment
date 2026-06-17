1. Below is implementation plan 
2. Make regular commits , each commit should have a proper description of what was done in that commit
3. Make premium frontend and backend



# Implementation Plan: Event Ticket Booking System

**Audience:** AI coding agent implementing this end-to-end.
**Goal:** A production-grade, full-stack seat reservation and booking system that would pass a senior engineer's code review at a hiring stage. Prioritize correctness (no double-booking, no race conditions) over feature breadth.

**Scope note:** This plan includes a role-based admin panel (event management, seat oversight, a bookings dashboard) and a user-facing booking history view, in addition to the core reserve/book flow from the original brief. These are explicitly scoped additions beyond the brief's literal text — the brief's `GET /api/events` endpoints are read-only and never specify how events get created in the first place. Building an admin flow answers the natural follow-up question "how does data get into this system in the real world" instead of leaving it to a one-off seed script. Every admin-specific addition in this document is called out as such, so the README's design-decisions section can explain — not just disclose — why it's there.

Read this entire document before writing any code. Build in the order listed — each phase depends on the one before it.

---

## 0. Tech Stack & Non-Negotiable Decisions

These are fixed. Do not substitute alternatives without a strong reason documented in a comment.

| Layer | Choice | Reason |
|---|---|---|
| Backend runtime | Node.js 20 LTS + Express 4 | As specified |
| Database | MongoDB 7 + Mongoose 8 | Mongoose for schema validation; native transactions for atomicity |
| Auth | JWT (access token only, no refresh token) + bcrypt for password hashing + role field on `User` (`'user'`/`'admin'`) | Simple but real — not a mock header. Role lives in the token payload so admin checks are a cheap claim-read, not a DB lookup |
| Frontend | React 18 (Vite, not CRA) + plain CSS (no Tailwind/MUI) | Vite for fast setup; plain CSS so the custom color palette below isn't fighting a framework's defaults |
| HTTP client | Axios | Cleaner interceptor support for attaching JWT than raw fetch |
| Local DB | Docker Compose (MongoDB only) | Self-contained `docker compose up` for reviewers without their own Mongo |
| Process model | Two separate processes (backend on :5000, frontend dev server on :5173) | Standard separation; documented in README |

Do not add Redis, Bull/BullMQ, Socket.io, or any other infra. The brief is intentionally scoped — adding unrequested infrastructure reads as over-engineering in a hiring review, not sophistication.

---

## 1. Repository Structure

```
event-booking/
├── docker-compose.yml
├── README.md
├── .gitignore
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── server.js                 # entrypoint, http server + graceful shutdown
│   │   ├── app.js                     # express app, middleware wiring
│   │   ├── config/
│   │   │   ├── db.js                  # mongoose connection
│   │   │   └── env.js                 # env var loading + validation (fail fast on missing)
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   ├── Seat.js
│   │   │   ├── Reservation.js
│   │   │   └── User.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── reservationController.js
│   │   │   ├── bookingController.js
│   │   │   └── admin/
│   │   │       ├── adminEventController.js   # create/update/delete events
│   │   │       ├── adminSeatController.js     # view/adjust seats for an event
│   │   │       ├── adminBookingController.js  # all-bookings dashboard, filtering
│   │   │       └── adminStatsController.js    # aggregate stats for dashboard
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── reservationRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   └── admin/
│   │   │       ├── adminEventRoutes.js
│   │   │       ├── adminSeatRoutes.js
│   │   │       ├── adminBookingRoutes.js
│   │   │       └── adminStatsRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # verifies JWT, attaches req.user
│   │   │   ├── requireAdmin.js        # blocks non-admin role, see Section 5.6
│   │   │   ├── errorHandler.js        # centralized error -> HTTP response mapping
│   │   │   ├── validate.js            # express-validator result handler
│   │   │   └── asyncHandler.js        # wraps async controllers, forwards rejections to next()
│   │   ├── services/
│   │   │   ├── reservationService.js  # core transactional logic — see Section 4
│   │   │   ├── bookingService.js
│   │   │   ├── reservationCleanup.js  # background sweep for expired reservations
│   │   │   └── adminEventService.js   # event CRUD + seat generation/regeneration logic
│   │   ├── validators/
│   │   │   ├── authValidators.js
│   │   │   ├── reservationValidators.js
│   │   │   ├── bookingValidators.js
│   │   │   └── adminEventValidators.js
│   │   └── utils/
│   │       ├── ApiError.js            # custom error class with statusCode
│   │       └── logger.js              # simple structured logger (pino or console wrapper)
│   ├── scripts/
│   │   ├── seed.js                    # creates sample events + seats for manual testing
│   │   └── createAdmin.js             # promotes/creates a single admin user, see Section 9.5
│   └── tests/
│       ├── reservation.test.js        # concurrency test — see Section 8
│       ├── booking.test.js
│       └── adminAccess.test.js        # non-admin gets 403 on every admin route, see Section 8
└── frontend/
    ├── package.json
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   ├── axiosClient.js         # base instance, attaches JWT, handles 401
        │   ├── authApi.js
        │   ├── eventsApi.js
        │   ├── reservationsApi.js
        │   ├── bookingsApi.js
        │   └── admin/
        │       ├── adminEventsApi.js
        │       ├── adminSeatsApi.js
        │       ├── adminBookingsApi.js
        │       └── adminStatsApi.js
        ├── context/
        │   └── AuthContext.jsx        # holds user + token + role, exposes login/logout
        ├── hooks/
        │   ├── useEvents.js
        │   ├── useEventDetail.js
        │   ├── useReservationTimer.js # countdown logic, see Section 6.4
        │   ├── useSeatSelection.js
        │   └── useMyBookings.js
        ├── components/
        │   ├── layout/
        │   │   ├── Header.jsx
        │   │   └── PageContainer.jsx
        │   ├── auth/
        │   │   ├── LoginForm.jsx
        │   │   ├── RegisterForm.jsx
        │   │   └── AdminRoute.jsx     # like ProtectedRoute, but also checks role === 'admin'
        │   ├── events/
        │   │   ├── EventList.jsx
        │   │   ├── EventCard.jsx
        │   │   └── EventDetailHeader.jsx
        │   ├── seats/
        │   │   ├── SeatGrid.jsx
        │   │   ├── Seat.jsx
        │   │   └── SeatLegend.jsx
        │   ├── reservation/
        │   │   ├── ReservationPanel.jsx
        │   │   ├── CountdownTimer.jsx
        │   │   └── ConfirmBookingButton.jsx
        │   ├── bookings/
        │   │   └── BookingHistoryCard.jsx
        │   ├── admin/
        │   │   ├── AdminSidebar.jsx
        │   │   ├── EventForm.jsx          # shared create/edit form
        │   │   ├── EventTable.jsx
        │   │   ├── DeleteEventDialog.jsx  # handles the active-bookings edge case, see 5.7
        │   │   ├── SeatStatusTable.jsx
        │   │   ├── BookingsTable.jsx
        │   │   ├── BookingsFilterBar.jsx
        │   │   └── StatsCard.jsx
        │   └── common/
        │       ├── Button.jsx
        │       ├── Spinner.jsx
        │       ├── ErrorBanner.jsx
        │       └── Toast.jsx
        ├── pages/
        │   ├── EventsPage.jsx
        │   ├── EventDetailPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── MyBookingsPage.jsx
        │   └── admin/
        │       ├── AdminDashboardPage.jsx     # stats overview, entry point
        │       ├── AdminEventsPage.jsx        # list + create + edit + delete
        │       ├── AdminEventSeatsPage.jsx    # per-event seat status view
        │       └── AdminBookingsPage.jsx      # all bookings, filterable
        ├── styles/
        │   ├── theme.css               # CSS custom properties — see Section 7
        │   └── global.css
        └── utils/
            └── formatDate.js
```

---

## 2. Data Models (Mongoose Schemas)

Build these first. Every field below is required unless marked optional. Add `timestamps: true` to every schema.

### 2.1 `User`
```
email: String, required, unique, lowercase, trim, validated as email format
passwordHash: String, required, select: false (never returned in queries by default)
name: String, required, trim
role: String, enum ['user', 'admin'], default 'user', required
```
- Pre-save hook hashes `password` (virtual, not stored) into `passwordHash` using bcrypt with a salt round of 10. If implementing this as a plugin vs inline hook, inline is fine for this scope.
- Instance method `comparePassword(candidate)` returning a boolean.
- **Security-critical:** `POST /api/auth/register` (Section 3.1) must never accept a `role` field from the request body, even if one is sent. Hardcode `role: 'user'` server-side in the registration controller regardless of what's in `req.body`, and explicitly omit `role` from the destructured/validated fields so there's no path where a client-supplied value reaches the model constructor. The only way a user becomes `'admin'` is the `createAdmin.js` script (Section 9.5), run directly against the database by whoever controls the deployment — never through a public HTTP endpoint. This is the single most important security property in the entire auth system: get it wrong and anyone can `curl` their way to admin.

### 2.2 `Event`
```
name: String, required, trim
venue: String, required, trim
dateTime: Date, required
totalSeats: Number, required, min: 1, integer
```
- Index on `dateTime` (events list will sort by it).
- No `seats` array embedded here — seats are a separate collection (see 2.3) so seat-level atomic updates don't require rewriting the whole event document.

### 2.3 `Seat`
```
eventId: ObjectId, ref 'Event', required, indexed
seatNumber: String, required (e.g., "A1", "B12" — not just a number, so layout can imply rows)
status: String, enum ['available', 'reserved', 'booked'], default 'available', required
reservationId: ObjectId, ref 'Reservation', default null   // which reservation currently holds this seat, if any
```
- **Compound unique index**: `{ eventId: 1, seatNumber: 1 }` unique — prevents duplicate seat numbers per event at the DB level, independent of application logic.
- **Compound index**: `{ eventId: 1, status: 1 }` — every seat-grid fetch filters by both.
- One `Seat` document per physical seat. `totalSeats` on `Event` and the actual count of `Seat` documents for that `eventId` must match — created together at event-creation/seed time (see seed script in Section 9).

### 2.4 `Reservation`
```
userId: ObjectId, ref 'User', required, indexed
eventId: ObjectId, ref 'Event', required, indexed
seatNumbers: [String], required, validated non-empty array
status: String, enum ['active', 'confirmed', 'expired', 'cancelled'], default 'active'
expiresAt: Date, required
```
- **TTL index** on `expiresAt`: `{ expiresAt: 1 }, { expireAfterSeconds: 0 }`. This makes MongoDB itself delete expired reservation documents automatically (default sweep interval ~60s) as a safety net. **Do not rely on the TTL index alone for correctness** — it is a cleanup mechanism, not the expiry check. The booking endpoint must independently verify `expiresAt > now` at request time (see Section 4.3), because the TTL background sweep runs on its own schedule and a reservation can be logically expired for up to 60 seconds before Mongo physically deletes it.
- Status `'expired'`/`'cancelled'` is set by the cleanup job *before* TTL deletion removes the document, purely so seat status can be reverted to `'available'` first (see `reservationCleanup.js` in Section 5).

---

## 3. API Contract

All endpoints prefixed `/api`. All request/response bodies are JSON. All authenticated endpoints require header `Authorization: Bearer <token>`.

### 3.1 Auth (not in the original brief, but "basic user authentication" requires it — implement minimally)

**POST `/api/auth/register`**
- Body: `{ email, password, name }` — note `role` is intentionally not an accepted field; see Section 2.1's security note.
- Validation: email format, password min length 8, name non-empty.
- 201 → `{ user: { id, email, name, role: 'user' }, token }`
- 409 if email already exists.

**POST `/api/auth/login`**
- Body: `{ email, password }`
- 200 → `{ user: { id, email, name, role }, token }`
- 401 on bad credentials (do not reveal whether email exists vs password wrong — same generic message for both).
- The JWT payload itself must include `role` alongside `id` and `email` — `requireAdmin` (Section 5.6) reads role straight off the verified token, it does not re-query the database per request.

### 3.2 Events

**GET `/api/events`** — public, no auth required
- Query params: none required for this scope (no pagination needed given assignment scale, but add `?page=&limit=` support trivially if time permits — not required).
- 200 → `{ events: [ { id, name, venue, dateTime, totalSeats, availableSeats } ] }`
- `availableSeats` is computed via a `countDocuments({ eventId, status: 'available' })` aggregation per event, or a single aggregation pipeline across all events grouping by status — prefer the aggregation pipeline (one query, not N+1).

**GET `/api/events/:id`** — public
- 200 → `{ event: { id, name, venue, dateTime, totalSeats }, seats: [ { seatNumber, status } ] }`
- 404 if event id doesn't exist or is malformed (validate ObjectId format before querying; an invalid format should 404/400, not 500).

### 3.3 Reservation

**POST `/api/reserve`** — auth required
- Body: `{ eventId, seatNumbers: [String] }`
- Validation: `eventId` valid ObjectId, `seatNumbers` non-empty array of strings, max reasonable length (cap at e.g. 10 seats per reservation — document this as a deliberate limit, not a bug).
- Business logic: see Section 4.2 in full.
- 201 → `{ reservation: { id, eventId, seatNumbers, expiresAt, status: 'active' } }`
- 409 if any requested seat is not `'available'` (already reserved or booked by someone else) — response should specify *which* seats were unavailable: `{ error: 'SEATS_UNAVAILABLE', unavailableSeats: [...] }` so the frontend can show a precise message and refresh the grid.
- 404 if event doesn't exist.
- 400 if a `seatNumber` doesn't belong to the event.

**(Implicit) Reservation cancellation is not a separate endpoint in the brief.** Do not add `DELETE /api/reservations/:id` unless trivial — out of scope, but it's fine to skip.

### 3.4 Booking

**POST `/api/bookings`** — auth required
- Body: `{ reservationId }`
- Business logic: see Section 4.3 in full.
- 201 → `{ booking: { eventId, seatNumbers, bookedAt } }` (a "booking" is not a new persisted entity per the brief — see 4.3 for what actually gets written)
- 410 (Gone) if the reservation has expired — distinct from 404, since the resource *did* exist. Body: `{ error: 'RESERVATION_EXPIRED' }`.
- 403 if `reservationId` belongs to a different user than the authenticated caller.
- 404 if `reservationId` doesn't exist at all.
- 409 if reservation status is not `'active'` (e.g., already confirmed — idempotency edge case, see Section 4.3).

**GET `/api/bookings/me`** — auth required — **added for this scope, not in the original brief**
- Returns the calling user's own confirmed bookings, for the frontend's "my bookings" page (Section 6.7).
- 200 → `{ bookings: [ { reservationId, event: { id, name, venue, dateTime }, seatNumbers, bookedAt } ] }`, sorted by `bookedAt` descending.
- Query: `Reservation.find({ userId: req.user.id, status: 'confirmed' }).populate('eventId')`. This is a straightforward read — no transaction needed, since nothing is being mutated.
- 200 with an empty array if the user has no bookings yet — not a 404. An empty list is a normal, valid state for this endpoint.

### 3.5 Admin — Events

All endpoints below require both `authMiddleware` and `requireAdmin` (Section 5.6) — a regular authenticated user hitting any of these gets 403, not 401 (401 means "we don't know who you are"; 403 means "we know who you are and you're not allowed").

**GET `/api/admin/events`**
- Like `GET /api/events` but includes events regardless of date (past included) and adds a `bookedSeats`/`reservedSeats` breakdown per event, not just `availableSeats` — an admin needs the full status split to manage inventory.
- 200 → `{ events: [ { id, name, venue, dateTime, totalSeats, availableSeats, reservedSeats, bookedSeats } ] }`

**POST `/api/admin/events`**
- Body: `{ name, venue, dateTime, totalSeats, seatsPerRow }` — `seatsPerRow` is new here (not in the public schema) and controls how `totalSeats` gets split into row letters when seats are generated (e.g. `totalSeats: 50, seatsPerRow: 10` → rows A–E, 10 seats each). Default `seatsPerRow` to 10 if omitted.
- Validation: `name`/`venue` non-empty, `dateTime` a valid future-or-present date (reject dates in the past — creating an event that already happened is almost certainly a typo, not an intentional action), `totalSeats` a positive integer with a sane upper bound (e.g. 500, to keep seat generation fast and the grid usable).
- Business logic: creates the `Event` document, then generates exactly `totalSeats` `Seat` documents in one batch (`insertMany`, not a loop of individual `save()` calls — this matters at even moderate seat counts) with seat numbers following the row pattern, all `status: 'available'`. Do this as a single transaction (event create + seat insertMany together) so a failure partway through doesn't leave an event with zero or partial seats.
- 201 → `{ event: { id, name, venue, dateTime, totalSeats } }`
- 400 on validation failure, with field-level messages (Section 5.4's validator pattern applies here too).

**PUT `/api/admin/events/:id`**
- Body: `{ name?, venue?, dateTime? }` — partial update, any subset of these three fields.
- **Deliberately excludes `totalSeats` from this endpoint.** Changing seat count after seats already exist (and possibly have reservations/bookings against them) is a different, harder operation than editing a name or venue — see the seat regeneration note below. Keep this endpoint to the safe, low-risk fields only.
- 200 → the updated event.
- 404 if the event doesn't exist. 400 on validation failure.

**DELETE `/api/admin/events/:id`**
- **The one genuinely tricky admin endpoint — read this carefully.** An event with active reservations or confirmed bookings cannot simply be deleted out from under those users.
- Business logic: before deleting, check `Reservation.countDocuments({ eventId, status: { $in: ['active', 'confirmed'] } })`.
  - If that count is `0`: delete the `Event`, all its `Seat` documents, and any `expired`/`cancelled` `Reservation` documents for it, in one transaction. Clean deletion, nothing left behind.
  - If that count is `> 0`: **do not delete.** Respond 409 with `{ error: 'EVENT_HAS_ACTIVE_BOOKINGS', activeCount: <n> }`. The frontend (Section 6.8) surfaces this as a blocking message, not a silent failure — an admin needs to know *why* delete didn't go through.
- This is intentionally conservative. A more advanced version might offer a force-cancel-and-notify flow, but that introduces user-facing cancellation messaging that's out of scope here — flag it in the README's limitations section instead of half-building it.

### 3.6 Admin — Seats

**GET `/api/admin/events/:id/seats`**
- Returns the full seat list for one event with status, for the admin's per-event seat view (Section 6.8's `AdminEventSeatsPage`).
- 200 → `{ seats: [ { seatNumber, status, reservationId } ] }` — note this includes `reservationId`, unlike the public `GET /api/events/:id` response, since an admin debugging a stuck seat needs to trace it back to a reservation.

**PATCH `/api/admin/seats/:seatId/release`**
- A narrow, deliberately limited admin action: force a single seat from `reserved` back to `available`, bypassing the normal expiry wait. This is the realistic "a customer called support, their payment failed, free up the seat" operation.
- Validation: only allowed when current status is `'reserved'` — releasing an already-`'available'` seat is a no-op (200, not an error), and releasing a `'booked'` seat is rejected with 409 (booked seats represent a completed transaction; "un-booking" one is a refund/cancellation decision, not a seat-management one, and is out of scope — note this distinction in the README).
- If the seat has a `reservationId`, this should also update that `Reservation`'s `seatNumbers` or status as appropriate so the reservation record doesn't end up claiming a seat that's now free elsewhere — keep this logic inside `adminEventService` alongside the rest of the seat-state transitions, not duplicated in the controller.
- 200 → the updated seat.

### 3.7 Admin — Bookings & Stats

**GET `/api/admin/bookings`**
- Returns confirmed bookings across *all* users and events, for the admin bookings dashboard (Section 6.8's `AdminBookingsPage`).
- Query params: `eventId?` (filter to one event), `from?`/`to?` (date range on `bookedAt`), `page?`/`limit?` (this endpoint should paginate from day one, unlike the public events list — an admin's booking history will realistically grow past a single page faster than the events list will).
- 200 → `{ bookings: [ { reservationId, user: { id, email, name }, event: { id, name }, seatNumbers, bookedAt } ], total, page, limit }`

**GET `/api/admin/stats`**
- A small aggregate-stats endpoint backing the dashboard's overview cards (Section 6.8's `AdminDashboardPage`).
- 200 → `{ totalEvents, totalBookings, totalRevenuePotential: null, topEventsByBookings: [ { eventId, name, bookedSeats } ] (top 5), overallSeatUtilization: <percentage across all events> }`
- `totalRevenuePotential` is explicitly `null` here — there is no `price` field anywhere in the data model (the brief never specifies one), so don't fabricate a revenue number from nothing. Leaving the key present but null, with a one-line code comment explaining why, is more honest than omitting it silently or inventing a placeholder price just to make the stat non-empty.

---

## 4. Concurrency & Double-Booking Prevention — Core Design

This is the section the implementing agent must get exactly right. It is also the section a reviewer will scrutinize most closely. Implement using **MongoDB multi-document transactions**, not just atomic single-document updates — because both reserve and book touch multiple `Seat` documents (one per seat number) plus a `Reservation` document, and all of those writes must succeed or fail together.

### 4.1 Why transactions, not just atomic ops

A single `findOneAndUpdate` is atomic for *one* document. Reserving 3 seats means 3 seat documents need to flip from `available` → `reserved`, plus 1 reservation document needs to be created. If seat 2 of 3 is taken by a concurrent request mid-way through, without a transaction you'd be left with seat 1 reserved, seat 2 failed, seat 3 never attempted — a corrupted partial state. A transaction makes the whole group atomic: either all seats flip and the reservation is created, or none of it persists.

MongoDB transactions require a replica set (even a single-node one) — note this in the Docker Compose setup (Section 9) and README, since a vanilla standalone `mongo` container will throw `Transaction numbers are only allowed on a replica set member`.

### 4.2 Reserve flow (`reservationService.reserveSeats`)

```
START SESSION, START TRANSACTION

1. Validate event exists (read, can be outside or inside transaction — inside is safer against
   a concurrent event deletion, but events aren't deletable in this scope, so outside is fine
   for a query, but the seat reads/writes below MUST be inside the transaction).

2. Within the transaction:
   a. Query all Seat documents matching { eventId, seatNumber: { $in: seatNumbers } }.
      - If count returned !== seatNumbers.length -> abort transaction, throw 400
        (one or more seat numbers don't exist for this event).
      - If any returned seat.status !== 'available' -> abort transaction, throw 409
        with the list of offending seatNumbers (this is the critical check).

   b. Create the Reservation document:
      { userId, eventId, seatNumbers, status: 'active', expiresAt: now + 10 minutes }

   c. Update all matching Seat documents:
      updateMany(
        { eventId, seatNumber: { $in: seatNumbers }, status: 'available' },  // guard clause repeated here
        { $set: { status: 'reserved', reservationId: <new reservation _id> } }
      )
      - CRITICAL: re-check `status: 'available'` in the update filter itself, not just in
        step 2a's read. This closes the gap between "I read it as available" and "I'm now
        writing reserved" within the same transaction. Compare the updateMany's
        `modifiedCount` to `seatNumbers.length` — if they don't match, another operation
        beat this one to at least one seat even within the transaction snapshot; abort and
        throw 409. (In practice, MongoDB's transaction isolation — snapshot read concern —
        makes this scenario rare, but the modifiedCount check is the defense-in-depth layer
        and costs nothing to include.)

COMMIT TRANSACTION (on success) / ABORT TRANSACTION (on any thrown error in steps 2a-2c)
END SESSION

Return the created Reservation.
```

**Retry on transient transaction errors:** MongoDB transactions can fail with a `TransientTransactionError` label under contention (e.g., write conflicts from two users reserving overlapping seats simultaneously). Wrap the transaction in a retry loop (3 attempts, since this is a small-scope app — not unbounded) that re-runs the whole transaction body if the error has that label, and surfaces the error normally otherwise. This is standard MongoDB driver guidance, not optional polish — without it, legitimate concurrent reservations that should resolve cleanly (one wins, one gets a 409) can instead bubble up as a 500.

### 4.3 Booking flow (`bookingService.confirmBooking`)

```
START SESSION, START TRANSACTION

1. Fetch the Reservation by reservationId, INSIDE the transaction.
   - Not found -> abort, throw 404.
   - reservation.userId !== authenticated user's id -> abort, throw 403.
   - reservation.status !== 'active' -> abort, throw 409 (already confirmed/cancelled/expired-and-already-handled).
   - reservation.expiresAt <= now -> abort, throw 410 RESERVATION_EXPIRED.
     (This is the independent expiry check referenced in Section 2.4 — never trust that
     "the document still exists" means "the reservation is still valid." Always compare
     expiresAt to the current server time explicitly, every single call.)

2. Update all Seat documents for this reservation:
   updateMany(
     { eventId: reservation.eventId, seatNumber: { $in: reservation.seatNumbers }, status: 'reserved', reservationId: reservation._id },
     { $set: { status: 'booked' } }
   )
   - Compare modifiedCount to reservation.seatNumbers.length. Mismatch -> abort, throw 409
     (defensive — should not happen if the state machine above is followed correctly, but
     a mismatch here means something is inconsistent and committing anyway would be wrong).

3. Update the Reservation: { status: 'confirmed' }
   (Do NOT delete the reservation document — the brief says "removes the reservation,"
   which for this implementation means it's no longer active/blocking, not that the audit
   record disappears. Setting status to 'confirmed' and removing it from the TTL deletion
   path — see note below — preserves a booking history, which is what a real booking system
   would do and what a reviewer would expect. If a literal delete is wanted instead, swap
   step 3 for `deleteOne`, but document this trade-off explicitly in the README's design
   notes either way.)

   Note: a Reservation with status 'confirmed' should no longer be deleted by the TTL index
   purely for hitting its expiresAt — but MongoDB's TTL index does not check status, it only
   checks expiresAt. To prevent a confirmed reservation from being silently deleted later by
   TTL just because its original 10-minute window passed, either (a) clear/null out
   expiresAt on confirmation so the TTL index has nothing to match, or (b) accept that the
   TTL deletes the Reservation row eventually but the booked Seat documents already have
   status 'booked' independently and are unaffected by the Reservation's deletion. Option
   (a) is recommended: set expiresAt to null on confirm, since Seat is the source of truth
   for "is this seat booked" — Reservation's expiresAt is purely about the *active hold*
   window.

COMMIT TRANSACTION
END SESSION

Return booking confirmation built from the seat numbers and event id.
```

### 4.4 Expired reservation cleanup (`reservationCleanup.js`)

A `setInterval` (every 30–60 seconds) background job in the backend process, started in `server.js` alongside the HTTP listener:
```
1. Find Reservation documents where status === 'active' AND expiresAt <= now.
2. For each (or batched via a transaction per reservation, same pattern as booking):
   a. Set Seat documents back to { status: 'available', reservationId: null }
      for that reservation's seatNumbers (guard: status === 'reserved' AND
      reservationId === this reservation's id, so a seat that's already moved on
      isn't touched).
   b. Set Reservation status to 'expired'.
3. Log how many were cleaned up (for visibility, not required for correctness).
```
This job exists *in addition to* the request-time expiry check in 4.3, not instead of it. The job's job is to release seats back to the pool promptly for *other* users browsing the seat grid; the request-time check in 4.3 is what actually prevents an expired reservation from being booked, even if this job hasn't run yet in the last few seconds. Restate this distinction in code comments at the top of the file — it is easy for someone reading the code later to assume the background job alone is "the" fix and remove the request-time check by mistake.

### 4.5 Summary table for the README's design-decisions section

| Failure mode | Prevented by |
|---|---|
| Two users reserve the same seat simultaneously | Transaction + status-guarded `updateMany` filter + `modifiedCount` check in 4.2 |
| Reservation transaction partially applies (some seats flip, others don't) | Multi-document MongoDB transaction — all-or-nothing |
| Booking an expired reservation | Explicit `expiresAt` check at request time in 4.3, independent of TTL deletion |
| Seat double-booked at the schema level even if app logic has a bug | Unique compound index `{ eventId, seatNumber }` on `Seat` |
| Stale "reserved" seats blocking others forever | TTL index (safety net) + active cleanup job (prompt release) |
| Booking a reservation that isn't the caller's | `userId` ownership check in 4.3 step 1 |
| Double-confirming the same reservation (e.g., user double-clicks "Confirm") | `status !== 'active'` check in 4.3 step 1 makes the second call fail with 409, not silently succeed twice |

---

## 5. Middleware & Cross-Cutting Concerns

### 5.1 `authMiddleware.js`
- Reads `Authorization: Bearer <token>` header.
- Missing/malformed header → 401 `{ error: 'UNAUTHORIZED' }`.
- `jwt.verify` failure (expired/invalid signature) → 401, same shape.
- On success, attach `{ id, email, role }` to `req.user` from the token payload. Do not re-query the DB on every request just to populate `req.user` — the token payload is sufficient for this scope. Including `role` here is what makes `requireAdmin` below a one-line check rather than a database hit.

### 5.2 `requireAdmin.js` — **added for the admin panel, runs after `authMiddleware`**
- A second, separate middleware — not a flag passed into `authMiddleware`. Keeping them as two composable middlewares (`router.use(authMiddleware, requireAdmin)` on admin routers) means every non-admin route stays exactly as simple as it was before the admin panel existed, and the distinction between "not logged in" and "logged in but not allowed" stays visible in the route definitions themselves.
- Logic: `if (req.user.role !== 'admin') throw new ApiError(403, 'FORBIDDEN')`. That's the entire middleware — it must run after `authMiddleware` has already populated `req.user`, so it can never be the first middleware in a chain.
- Applied to every router under `routes/admin/` (Section 1's repo structure) via `router.use(authMiddleware, requireAdmin)` at the top of each admin route file, rather than repeating both middlewares on every individual route handler — one line per file, not one line per endpoint.
- **Test this explicitly** (Section 8 adds `adminAccess.test.js` for exactly this): a regular `'user'`-role token hitting any `/api/admin/*` route must get 403, never 200 and never 500. This is the test most likely to be skipped under time pressure and most likely to be the first thing a security-conscious reviewer checks by hand.

### 5.3 `errorHandler.js`
- Centralized Express error-handling middleware (4-arg signature, registered last in `app.js`).
- Catches `ApiError` instances (custom class with `statusCode` + `message` + optional `details`) and responds with that exact shape.
- Catches Mongoose `ValidationError` → 400 with field-level messages.
- Catches Mongoose `CastError` (malformed ObjectId) → 400, not 500.
- Catches MongoDB duplicate key errors (code 11000) → 409.
- Anything unrecognized → 500 with a generic message in production (`NODE_ENV === 'production'`) but the real stack trace logged server-side either way. Never leak stack traces to the client in production responses.

### 5.4 `asyncHandler.js`
- Standard wrapper: `const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);`
- Every controller function is wrapped in this so thrown errors/rejected promises reach `errorHandler.js` instead of crashing the process or hanging the request.

### 5.5 Validation (`express-validator`)
- Every route with a body or param gets a validator chain defined in `validators/`, run via a shared `validate.js` middleware that checks `validationResult(req)` and throws a 400 `ApiError` with the array of validation messages if not empty.
- Do not rely on Mongoose schema validation alone for request validation — Mongoose validation errors are harder to map to clean field-level API responses and run later in the pipeline (after a document is already constructed). Validate input shape at the route boundary first.

### 5.6 Other Express setup in `app.js`
- `helmet()` for basic security headers.
- `cors()` configured with the actual frontend origin (from env var, not `*`) since auth tokens are involved.
- `express.json()` with a reasonable size limit (e.g., `'10kb'` — this app has no file uploads).
- Basic rate limiting on `/api/auth/login` and `/api/auth/register` specifically (e.g., `express-rate-limit`, 10 requests per 15 minutes per IP) — login endpoints are the most realistic abuse target in this app and it's a one-line addition that signals production awareness.

### 5.7 The delete-with-active-bookings pattern, frontend side
Section 3.5's `DELETE /api/admin/events/:id` can return a 409 with `activeCount`. The `DeleteEventDialog.jsx` component (Section 1's repo structure) is what surfaces this: clicking delete always opens a confirmation dialog first (never an immediate destructive action on a single click), and if the delete call comes back 409, the dialog switches from a generic confirmation to an explicit message — "this event has N active reservation(s) or booking(s) and cannot be deleted" — rather than a generic toast. This is a small UI detail, but it's the one place in the whole admin panel where the backend's most carefully-considered business rule (Section 3.5) becomes visible to whoever's using the app, so it's worth the dedicated component rather than folding it into a generic error banner.

---

## 6. Frontend Implementation Notes

### 6.1 Routing
Use `react-router-dom` v6. Routes: `/login`, `/register`, `/` (events list, protected), `/events/:id` (detail + seat grid, protected), `/my-bookings` (protected, Section 6.7). A simple `ProtectedRoute` wrapper component redirects to `/login` if no token in `AuthContext`.

**Admin routes — added for this scope:** `/admin` (dashboard), `/admin/events` (list/create/edit/delete), `/admin/events/:id/seats` (seat status view), `/admin/bookings` (all-bookings table). All nested under an `AdminRoute` wrapper (Section 1's repo structure) that checks both "is logged in" and `user.role === 'admin'` — failing the role check redirects to `/` (the regular events page), not `/login`, since the user *is* authenticated, just not authorized for this section. Don't reuse `ProtectedRoute` for this with a prop flag; a separate, explicitly-named component makes the role gate visible in the route definitions themselves, the same reasoning as keeping `requireAdmin` separate from `authMiddleware` on the backend (Section 5.2).

The header/nav (`Header.jsx`) conditionally renders an "Admin" link only when `user?.role === 'admin'` — this is a UX convenience, not a security boundary; the actual enforcement is `AdminRoute` on the frontend and `requireAdmin` on the backend. Hiding a link is not access control, and the README's limitations section should say so explicitly rather than implying the hidden link is what protects the admin panel.

### 6.2 `AuthContext.jsx`
- Holds `{ user, token }` in state, where `user` now includes `role` (`{ id, email, name, role }`), persisted to `localStorage` (key: `eventBooking_auth`) so a refresh doesn't log the user out.
- Exposes `login(email, password)`, `register(...)`, `logout()`.
- `axiosClient.js` reads the token from this context (via a request interceptor referencing a module-level getter, or by setting the header explicitly after login/on app load — either works, pick one and be consistent) and attaches `Authorization: Bearer <token>` to every request.
- A response interceptor catches 401s globally and triggers `logout()` + redirect to `/login` — covers the case where a token expires mid-session. A 403 response is handled differently (Section 6.8's admin pages): it does not log the user out, since 403 means "you're logged in, just not allowed here" — logging out an authenticated user because they hit a 403 would be a confusing, wrong reaction to a normal authorization boundary.

### 6.3 Seat grid (`SeatGrid.jsx` + `Seat.jsx`)
- Render seats in a grid grouped by row (derive row from `seatNumber`'s leading letter, e.g. `"A1"` → row `A`). If seat numbering doesn't cleanly imply rows for some generated dataset, falling back to a flat grid of N columns is acceptable — don't over-build a layout parser for this.
- Each `Seat` is a button-like element, color-coded per Section 7's palette, disabled (not clickable) if `status === 'booked'`. Seats with `status === 'reserved'` are also not selectable by *this* user (they're held by someone else, or by this user in a *different* prior reservation — this app doesn't need to distinguish "reserved by me" vs "reserved by someone else" since the brief doesn't ask for multi-reservation-in-flight support per user).
- Local selection state (`useSeatSelection` hook) tracks which `available` seats the current user has clicked, independent of backend state, until "Reserve" is clicked.
- Clicking a seat already at `available` toggles it in/out of the local selection set. Clicking anything else does nothing (and the cursor should indicate non-interactivity via CSS).

### 6.4 Reservation + countdown (`useReservationTimer.js`, `CountdownTimer.jsx`)
- On successful `POST /api/reserve`, store `{ reservationId, expiresAt }` in component state (`EventDetailPage`, lifted above the seat grid and reservation panel so both can react to it).
- `useReservationTimer(expiresAt)` computes remaining seconds via `setInterval` (every 1s), returns `{ minutes, seconds, isExpired }`.
- When `isExpired` flips true client-side: disable the "Confirm Booking" button immediately, show a message ("Your reservation has expired — please select seats again"), and re-fetch the event detail (to get fresh seat statuses, since the backend cleanup job may have already released them, or may do so within the next ~30-60s). Do not let the client-side timer alone be trusted as proof the reservation is valid up until it expires — the *server* is the source of truth (per Section 4.3); the client timer is purely UX, telling the user when to expect a failure, not preventing the actual request.
- On `POST /api/bookings` returning 410 (expired), show the same "please select seats again" messaging regardless of what the client timer currently displays — the server's 410 always wins over the client's clock, since clocks can drift and a tab can be backgrounded/throttled by the browser, making the client interval an imprecise approximation.

### 6.5 Error display
- A single `ErrorBanner` component, shown contextually (e.g., above the seat grid for reservation conflicts, above the confirm button for booking failures). Use the `unavailableSeats` array from a 409 response (Section 3.3) to highlight specifically which seats failed, not just a generic "something went wrong."
- After any reservation/booking failure caused by seat-state conflicts, automatically re-fetch `GET /api/events/:id` so the grid reflects current reality rather than showing stale "available" seats that are actually now taken.

### 6.6 Loading & empty states
- Every async fetch (`useEvents`, `useEventDetail`) exposes `{ data, isLoading, error }`. Render a `Spinner` during `isLoading`, an `ErrorBanner` on `error`, and an explicit "No events available" message if `data` resolves to an empty array — don't just render nothing.

### 6.7 `MyBookingsPage.jsx` — **added for this scope**
- Fetches `GET /api/bookings/me` (Section 3.4) via `useMyBookings`, renders a list of `BookingHistoryCard`s, each showing event name/venue/date, the booked seat numbers, and when the booking was confirmed.
- Empty state ("You haven't booked anything yet" + a link back to the events list) follows the same pattern as 6.6 — an empty array is not an error.
- This page is read-only by design; it does not offer cancellation, since no cancellation endpoint exists in this scope (Section 3.3's note) and adding a cancel button with nothing behind it would be a dead-end UI element.

### 6.8 Admin panel pages — **added for this scope**
- **`AdminDashboardPage.jsx`** — fetches `GET /api/admin/stats`, renders `StatsCard` components for total events, total bookings, and overall seat utilization, plus a small "top 5 events by bookings" list. This is the admin's landing page after the `/admin` route.
- **`AdminEventsPage.jsx`** — fetches `GET /api/admin/events`, renders `EventTable` with edit/delete actions per row and a "create event" button opening `EventForm` (shared between create and edit — same form component, different submit handler and initial values, not two separate forms). Delete goes through `DeleteEventDialog` per Section 5.7's pattern, never a bare confirm().
- **`AdminEventSeatsPage.jsx`** — fetches `GET /api/admin/events/:id/seats`, renders `SeatStatusTable` (a simple table, not the visual seat grid from the public side — an admin needs a scannable list with a release action per reserved seat, not a spatial layout) wired to `PATCH /api/admin/seats/:seatId/release`.
- **`AdminBookingsPage.jsx`** — fetches `GET /api/admin/bookings`, renders `BookingsTable` plus `BookingsFilterBar` (event dropdown, date range) that re-fetches with query params on change, plus pagination controls reflecting the `total`/`page`/`limit` from the response.
- All four pages share one layout shell with `AdminSidebar.jsx` for navigation between them — build this shell once (e.g. an `AdminLayout` wrapping `<Outlet />`) rather than duplicating a nav bar across four page components.

---

## 7. Visual Design — Color System

Define these as CSS custom properties in `frontend/src/styles/theme.css`, referenced everywhere else — no hardcoded hex values in component files.

```css
:root {
  --color-bg: #030303;
  --color-bg-alt: #000000;
  --color-text-primary: #F5F6F5;
  --color-text-muted: #505253;
  --color-accent: #C84DFF;
  --color-accent-secondary: #9A54E8;
  --color-accent-dark: #6A2FB8;
  --color-surface: #111111;
  --color-surface-alt: #1A1A1A;

  /* Seat status colors — not in the brief's table, chosen to stay within the same palette family */
  --color-seat-available: var(--color-surface-alt);   /* neutral dark, looks selectable */
  --color-seat-available-border: var(--color-text-muted);
  --color-seat-selected: var(--color-accent);          /* bright violet — clearly "yours, pending" */
  --color-seat-reserved: var(--color-accent-dark);      /* deep violet — held, not by you, muted vs selected */
  --color-seat-booked: var(--color-text-muted);         /* gray, low-emphasis, unavailable */
  --color-success: #4ADE80;   /* not in brief's palette — a green is needed for "booking confirmed" success
                                  states and there's no success color provided. Document this addition in
                                  the README as a deliberate, minimal extension to the given palette. */
  --color-error: #FF6B6B;     /* same reasoning — needed for error banners, not in the original table */
}

body {
  background: var(--color-bg);
  color: var(--color-text-primary);
}
```

Use `--color-surface` / `--color-surface-alt` for cards (event cards, the reservation panel), `--color-accent` for primary buttons and active/selected states, `--color-accent-secondary` for secondary buttons or hover states, and `--color-text-muted` for timestamps, helper text, and disabled states. Keep contrast in mind: `#F5F6F5` text on `#111111`/`#1A1A1A` surfaces is the primary readable combination; don't put muted gray text on the black background directly for anything load-bearing (it will fail contrast checks).

---

## 8. Testing

Minimum viable test coverage — this is a hiring-stage app, not a project with a full test pyramid, so be deliberate about which two things actually matter:

1. **`reservation.test.js` — concurrency test (the most important test in this codebase).** Spin up two (or more) concurrent calls to the reservation service/endpoint targeting the *same* seat for the *same* event, and assert that exactly one succeeds and the other receives a 409 with that seat listed in `unavailableSeats`. This is the test that actually proves Section 4's design works, as opposed to just reading correctly. Use an in-memory or Dockerized test MongoDB replica set (e.g., `mongodb-memory-server` configured for replica set mode, since transactions need one) — do not skip this test by mocking the database, since the entire point is verifying real transactional behavior.
2. **`booking.test.js`** — covers: booking succeeds for a valid active reservation; booking fails with 410 for an expired one (construct a reservation with `expiresAt` in the past directly via the model, bypassing the 10-minute wait, then call the booking endpoint); booking fails with 403 when called by a different user than the reservation's owner.
3. **`adminAccess.test.js`** — **added for the admin panel.** Create one `'user'`-role and one `'admin'`-role test user directly via the model (bypassing registration, same as the expired-reservation test above bypasses the 10-minute wait). Assert the `'user'` token gets 403 on every `/api/admin/*` route (events list, create, update, delete, seats, bookings, stats — loop over the route list rather than writing seven near-identical test blocks), and the `'admin'` token gets through to a 200/201 on the same routes. This is the test that actually proves Section 5.2's `requireAdmin` middleware is wired correctly on every admin router, not just the first one tested by hand during development.

Document in the README how to run tests (`npm test` in `backend/`) and that they require a running MongoDB replica set (the same Docker Compose setup used for development covers this, since the compose file should configure single-node replica set mode — see Section 9).

Frontend tests are not required for this scope given time constraints — note this as a deliberate, stated trade-off in the README rather than silently omitting them.

---

## 9. Local Development Setup

### 9.1 `docker-compose.yml` (repo root)
- Single MongoDB service, image `mongo:7`, with the container started using `--replSet rs0` (required for transactions, per Section 4.1).
- An init step (either a `command` override running `rs.initiate()` via `mongosh` on first boot, or a documented manual step in the README — "manual step" is acceptable here to keep the compose file simple, just don't skip documenting it) to actually initialize the replica set, since `--replSet` alone starts Mongo in replica-set *mode* but doesn't initiate it.
- Expose port `27017`, with a named volume for data persistence across restarts.

### 9.2 `backend/.env.example`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-booking?replicaSet=rs0
JWT_SECRET=replace-this-with-a-long-random-string
JWT_EXPIRES_IN=24h
RESERVATION_TTL_MINUTES=10
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
ADMIN_SEED_EMAIL=admin@example.com
ADMIN_SEED_PASSWORD=replace-this-too
```
`RESERVATION_TTL_MINUTES` as an env var (not hardcoded `10` in the service file) so the 10-minute window the brief specifies is configurable without touching code — small thing, but it's the kind of detail that separates "matches the spec" from "matches the spec and clearly understood why." `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` exist solely for `createAdmin.js` (Section 9.5) — they are not read anywhere else in the app, and should never be committed with real values, only placeholders in `.env.example`.

### 9.3 `frontend/.env.example`
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 9.4 `backend/scripts/seed.js`
A standalone script (`node scripts/seed.js`, also exposed as `npm run seed`) that:
- Connects to the configured `MONGODB_URI`.
- Clears existing `Event` and `Seat` collections (development convenience — log a warning that this is destructive).
- Creates 3–4 sample `Event` documents with varied `dateTime` (some past, mostly future — though the brief doesn't require filtering past events out of the list, consider whether `GET /api/events` should default to upcoming events only; if implemented, document that choice explicitly rather than leaving it ambiguous).
- For each event, creates `Seat` documents matching its `totalSeats`, with seat numbers following the `A1`–`A10`, `B1`–`B10`, etc. pattern from Section 6.3, all starting as `available`.
- Logs a summary of what was created.

This script is what makes the README's "how to run this" section actually produce a usable app on first run, instead of an empty events list with nothing to click.

### 9.5 `backend/scripts/createAdmin.js` — **added for the admin panel**
A standalone script (`node scripts/createAdmin.js`, also exposed as `npm run create-admin`) that:
- Connects to the configured `MONGODB_URI`.
- Reads `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` from env. If either is missing, exit with a clear error rather than silently using a fallback — an admin account should never be created with a value nobody chose.
- If a `User` with that email already exists: update its `role` to `'admin'` in place (idempotent — running this script twice doesn't create a duplicate or error out, it just confirms the role).
- If not: create a new `User` with that email/password and `role: 'admin'` directly, bypassing the registration endpoint entirely (this script talks to the model, not the API — it is the one and only code path in the whole system, alongside direct DB access, that can produce an admin user, per Section 2.1's security note).
- Logs a confirmation, including the email, but never logs the password.

This is the script the README's setup section points to for getting an admin login to actually test the admin panel with — without it, the admin panel exists in code but nobody running through the README can reach it, which defeats the purpose of building one.

---

## 10. README.md — Required Structure

The agent implementing this must produce a README with at least these sections, fully filled in (not left as a template) once the app is built:

1. **Overview** — one paragraph, what this app does. Mention the admin panel here too, not just the public booking flow — a reader skimming the overview should know on first read that this isn't just a single-role app.
2. **Tech stack** — bullet list matching Section 0.
3. **Prerequisites** — Node version, Docker (for Mongo), npm.
4. **Setup & run — backend**
   - `cd backend && npm install`
   - `cp .env.example .env` (and instruction to fill in `JWT_SECRET`, plus `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` for the admin script below)
   - `docker compose up -d` (from repo root) + the replica-set initiation step from 9.1, written out as an exact command
   - `npm run seed` (so there's data to see)
   - `npm run create-admin` (Section 9.5) — so there's an admin login to test the admin panel with; state explicitly that this is the *only* way to get an admin account, registration never produces one
   - `npm run dev` (or `npm start`) — state which port it runs on
   - `npm test` — and the replica-set requirement
5. **Setup & run — frontend**
   - `cd frontend && npm install`
   - `cp .env.example .env`
   - `npm run dev` — state the port (Vite default 5173) and that it expects the backend already running
6. **How to use it** — two short numbered walkthroughs, not one:
   - **As a regular user:** register → login → see events list → click an event → select seats → reserve → watch the countdown → confirm → see success → check `/my-bookings`. Mention what happens if you let it expire.
   - **As an admin:** log in with the `create-admin` credentials → the "Admin" link appears in the header → create an event → view it on the public events page in another tab/incognito window to confirm it actually shows up → go to that event's seat view → reserve a seat as a regular user in the other tab → come back and see it reflected as reserved → try deleting an event with an active reservation and see the blocking message (Section 3.5/5.7). This last step is worth calling out explicitly in the README since it's the one edge case most worth demonstrating live.
7. **API reference** — a compact table of endpoint, method, auth required (none / user / admin — three tiers now, not two), one-line description. (Full request/response shapes can point back to this plan doc or be summarized — don't duplicate Section 3 verbatim, that's redundant; a table is enough for a README.)
8. **Design decisions — double-booking prevention** — this should essentially restate Section 4.5's table in prose, in the implementer's own words once the code exists, since a reviewer reading the README is specifically looking for whether the author can *explain* their concurrency strategy, not just whether the code happens to work.
9. **Design decisions — admin access control** — a short, separate paragraph (don't bury this inside section 8, it's a distinct concern) explaining the `role` field, why registration can never set it (Section 2.1), and the two-layer enforcement (`requireAdmin` on the backend is the actual boundary; the hidden nav link on the frontend is convenience only, per Section 6.1's note). This is the second concurrency-adjacent thing a reviewer is likely to probe on, so it deserves the same explanatory care as the booking logic.
10. **Assumptions made** — explicitly list things this plan leaves to the implementer's judgment that aren't in the original brief, for example (the implementer should adjust this list to whatever was actually decided during the build, this is a starting point, not the final list):
   - Whether `Reservation` documents are deleted or soft-confirmed on booking (Section 4.3's note).
   - The seat cap per reservation (Section 3.3's "max 10 seats" guard).
   - Whether past events are filtered out of the events list (Section 9.4).
   - That basic auth (register/login) was added since the brief requires "basic user authentication" but doesn't specify a flow.
   - The two colors added to the given palette for success/error states (Section 7), since the brief's table didn't include any.
   - That an entire admin panel, a `role` field, and a `GET /api/bookings/me` endpoint were added beyond the brief's literal text, and why (Section 0's scope note) — this is the most consequential assumption in the whole list and should be stated first, not buried at the end.
   - The conservative delete-blocking behavior for events with active bookings (Section 3.5), instead of a more advanced force-cancel flow.
   - That seat count can't be edited after creation via `PUT /api/admin/events/:id` (Section 3.5's note on why `totalSeats` is excluded from that endpoint).
11. **Known limitations / what I'd add with more time** — a short, honest list (e.g., no pagination on the public events list, no email confirmation, no payment integration, no refresh tokens, frontend tests not included, no force-cancellation flow for events with active bookings, no audit log of admin actions). Including this section is itself a positive signal in a hiring review — it shows scope awareness rather than implying the submission is "finished" in an absolute sense.

---

## 11. Build Order Checklist

Work through this in order. Do not start frontend work until 1–8 are functionally complete and manually verified (e.g., via `curl` or Postman) — building UI against an API that doesn't exist yet or whose contract might still shift is wasted rework. Admin work is deliberately sequenced *after* the core reserve/book flow is solid, not interleaved with it — the admin panel is additive scope, and building it on top of a half-finished core flow risks both being unfinished instead of one being done well.

1. Repo scaffold + `docker-compose.yml` + Mongo replica set running and verified (`mongosh --eval "rs.status()"` succeeds).
2. Mongoose models (Section 2), with indexes actually created (verify via `db.seats.getIndexes()` after first run). Include `role` on `User` from the start — retrofitting a role field onto an existing auth system later is more error-prone than including it in the original schema.
3. Auth: register/login endpoints + JWT middleware, with `role` flowing through the JWT payload (Section 3.1) from day one, even before `requireAdmin` exists to consume it. Verify with a real `curl` round-trip before moving on, and explicitly verify that posting `{ "role": "admin" }` in the register body has zero effect on the created user (Section 2.1's security note) — confirm this by hand, don't assume the destructuring is correct.
4. Event endpoints (read-only, no concurrency concerns) — straightforward, do these to get early momentum.
5. Seed script — needed before reservation/booking can be tested manually.
6. Reservation service + endpoint (Section 4.2) — the hardest part. Write the concurrency test (Section 8, item 1) alongside this, not after — it's the fastest way to catch a transaction-logic bug before it's buried under more code.
7. Booking service + endpoint (Section 4.3) + expiry edge case test + `GET /api/bookings/me` (Section 3.4, a simple read once booking itself works).
8. Background cleanup job (Section 4.4) + centralized error handling + validation wired across all routes (Section 5.1, 5.3-5.6) — retrofit onto steps 3-7 if not done inline, but don't ship without it.
9. `requireAdmin` middleware (Section 5.2) + `createAdmin.js` script (Section 9.5) — build the gate and the only way through it together, then immediately write `adminAccess.test.js` (Section 8, item 3) before building a single admin feature behind it. Verify by hand with `curl`: a non-admin token gets 403 on a route that doesn't even have real logic yet (a stub `router.get('/admin/events', requireAdmin, (req,res) => res.json({ok:true}))` is enough to test the gate in isolation).
10. Admin event CRUD (Section 3.5) — create first (needed to have anything to edit/delete), then update, then delete last since it has the most business logic (the active-bookings check).
11. Admin seat view + release endpoint (Section 3.6).
12. Admin bookings + stats endpoints (Section 3.7) — these are pure reads with filtering/aggregation, no new concurrency concerns, safe to build quickly once the data exists from steps 10-11's manual testing.
13. Frontend: scaffold, theme, routing (including the now-larger route list from Section 6.1), `AuthContext` (carrying `role` from the start), axios client.
14. Frontend: events list + event detail + seat grid (read-only against real backend data first).
15. Frontend: reservation flow + countdown timer.
16. Frontend: booking confirmation flow + error states for the unavailable-seat and expired-reservation cases specifically (these are the two failure modes the brief explicitly calls out — verify both manually by triggering them, e.g. opening two browser tabs as different users) + `MyBookingsPage` (Section 6.7).
17. Frontend: `AdminRoute` + `AdminLayout`/`AdminSidebar` shell first, then the four admin pages in the same dependency order as the backend (events → seats → bookings/stats, Section 6.8). Verify the role gate visually too, not just via the backend test: log in as a non-admin and confirm both that the Admin nav link doesn't render and that manually navigating to `/admin` redirects away.
18. README — write this last, once actual run commands and actual design decisions are known, not as a template filled with placeholders.