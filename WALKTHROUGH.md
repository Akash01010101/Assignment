# EventHub - Complete User & Evaluator Walkthrough

Welcome to the **EventHub** project walkthrough! This application was developed as a hiring assignment to demonstrate proficiency in full-stack MERN development, complex state management, concurrent database transactions, and role-based access control.

This guide is designed for evaluators testing the platform's capabilities. The application features three distinct user scopes: **Attendees** (Standard Users), **Event Organizers** (Scoped Multi-Tenancy), and **Administrators** (Global Oversight).

---

## 1. Using the Platform as an Attendee

As an attendee, your goal is to find great events and secure your favorite seats without worrying about double-bookings or glitches.

### Getting Started
1. **Sign Up**: Click **"Get Started"** in the top right corner. Enter your name, email, and a password to create your free account.
2. **Log In**: If you already have an account, click **"Login"**.

### Finding & Booking an Event
1. **Browse Events**: Once logged in, click **"Events"** in the top navigation bar. You will see a list of all upcoming events, complete with dates, venues, and how many seats are still available.
2. **Choose Your Seats**: Click on an event to open the Interactive Seat Map. 
   - **Available seats** are highlighted.
   - **Reserved seats** (someone else is currently looking at them) or **Booked seats** (already purchased) are grayed out and cannot be clicked.
3. **Lock Them In**: Click on the seats you want. Then, click **"Reserve Seats"**.

### The 10-Minute Lock (Concurrency Test)
To evaluate the concurrency logic, try opening the same event in two different incognito windows.
- As soon as you click "Reserve" in one window, a 10-minute timer starts. 
- During these 10 minutes, the selected seats are locked in the database via MongoDB multi-document transactions.
- If you attempt to click the exact same seat simultaneously in another window, the backend transaction uses atomic updates to verify the `modifiedCount`. The system will safely abort the second request and throw a 409 error, guaranteeing no double-bookings.
- If the timer runs out, a backend TTL index and cron job safely releases the locks, returning the seats to `available` state.

### Confirming Your Booking
1. To finalize, click **"Confirm Booking"** before the 10-minute timer expires.
2. Success! You can now view your tickets anytime by clicking **"My Bookings"** in the top navigation bar.

---

## 2. Testing the Event Organizer Role (Multi-Tenancy)

To test the application's multi-tenancy and data scoping capabilities, you can apply for an Event Organizer account. Organizers are restricted to managing their own isolated data.

### Applying for a Business Account
1. On the homepage (while logged out), click **"List your Event"** in the top right corner.
2. Submit the business application form. This creates an account with a `user` role but adds a `pending` business profile status to the database. You must wait for Admin approval to proceed.

### Managing Scoped Events
Once an Administrator approves your account, your dashboard unlocks and your role is upgraded to `organizer` via the backend `/api/admin/business-applications/:id/approve` endpoint.
1. Log in. You will notice a new **"Dashboard"** button in the top navigation bar.
2. **Multi-Tenant Dashboard**: The API routes apply a strict MongoDB query filter (`{ organizer: req.user.id }`). You will see statistics **only for the events you own**.
3. **Create an Event**: Click **"Manage Events"** and hit the **"Create Event"** button.
   - The backend attaches your `organizer` ID to the newly created Event document.
   - The platform will dynamically generate the requested number of `Seat` documents associated with this new event ID.
4. **Track Sales**: The "View Bookings" API endpoints are secured. You can only view bookings where the `eventId` is owned by your specific organizer ID, preventing cross-tenant data leaks.

---

## 3. Testing the Administrator Role (Global Oversight)

Administrators have unrestricted access to all data and endpoints, enforcing the highest level of role-based access control.

### Authenticating as Admin
The `admin` role cannot be acquired through the standard UI registration flow. You must either run the `createAdmin.js` script or use the pre-seeded admin credentials provided in the `.env` file to log in.

### Approving Organizers
1. Once logged in as an Admin, access the **"Dashboard"** from the header.
2. Navigate to **"Business Apps"**.
3. Here, you can test the `PUT /api/admin/business-applications/:id/approve` endpoint. Approving a pending application will update the database, instantly granting that user `organizer` status and giving them access to their isolated dashboard.

### Global Dashboard & Management
1. **Global Stats**: The Admin Dashboard aggregates data across all tenants. The `getAdminStats` API controller checks `req.user.role === 'admin'` and skips the multi-tenancy filter to return the global count of events and bookings.
2. **Manage Events**: The master list displays *every* event on the platform. Attempting to delete an event with active bookings will trigger a `409 Conflict` error to test data integrity mechanisms.
3. **Seat Management**: Admins have the ability to forcefully override a seat lock. If a seat is stuck in a `reserved` state, clicking it in the Admin Seat Map will trigger a `PATCH` request to release it and nullify the associated `Reservation` document.
4. **View Bookings**: Admins bypass the `eventId` query restrictions to see a global, paginated feed of every confirmed booking.

---

