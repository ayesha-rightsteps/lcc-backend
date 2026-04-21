# Master Frontend Implementation Plan & Backend Overview

Welcome to the frontend development phase of **LCC Academy**! 

The backend architecture is complete. This document is your unified guide to understanding the backend, how features act together, and exactly what order you should build the React user interfaces to progressively map to our backend.

---

## 🏗 Backend Architecture Overview

The backend is built around **7 Core Modules** governing the entire academy system. 

It uses strict **JWT Bearer Token Authorization**.
Base URL: `VITE_API_BASE_URL` (typically `http://localhost:5000/v1` or `https://api.lcc.com/v1`)

### General Rules for Frontend:
1. **Never use raw `axios` inside components.** Always use the preconfigured `src/services/api.js` instance to ensure interceptors append the `Authorization: Bearer <Token>` properly.
2. **Handle Errors Gracefully:** All backend errors respond with `err.response.data.message`. Bind this to your UI toasts or field errors.
3. **Dual Routes:** The backend has distinct logics for `"student"` level tokens vs `"admin"` level tokens.

---

## 🚀 Step-by-Step Implementation Roadmap

Follow these 7 phases to build the React application out methodically.

### Phase 1: Authentication Engine (Module 1)
**Goal:** Establish user sessions and login.
1. Build the global state (e.g., Zustand or Context) for User Auth (`user`, `token`).
2. Build the `/login` page UI.
3. Connect `POST /auth/login`. 
   - Note: The backend will automatically capture the device IP. The backend will throw a `403 IP Limit Reached` if a student triggers a 3rd unique IP. Handle this specifically in the UI (e.g., "Please contact Sir to reset your devices").
4. Setup protected route wrappers (`<ProtectedRoute adminOnly={false}>`).

### Phase 2: Sir's Admin Onboarding (Module 2)
**Goal:** Allow Sir to create new students (Since students cannot register themselves).
1. Build the **Admin Dashboard - Add Student** form. Include fields: 
   - Full Name, Phone, Email, Course Name, Payment Amount, Course Duration (in days).
2. Connect `POST /users/students`.
3. The backend will automatically generate the username + password, send the welcome email directly, and compute the exact validity expiry date. Show the generated credentials in a success modal so Sir has them.

### Phase 3: Session Tracking & Safety Controls (Module 3)
**Goal:** Track student presence and allow Sir to block users.
1. **Student Side (Background):** Add a global `useEffect` interval that polls `POST /users/heartbeat` every 15 minutes while the user is logged in. Pass navigator `lat` and `lng`.
2. **Admin Side (Student Profile View):** Build UI panels for:
   - Status toggle: Connect `PATCH /users/:id/status` (actions: `deactivate`, `block`, `reactivate`, `extend_validity`).
   - Security panel: Connect `POST /users/:id/reset-password`.
   - IP Manager: Connect `PATCH /users/:id/ips` (action: `reset` or `block_ip`).

### Phase 4: Google Drive Content Library (Module 4)
**Goal:** Securely stream videos and PDFs without downloads.
1. **Admin Side:** 
   - Build form to add content: `POST /content` (Title, Type: pdf/video, DriveId).
   - Build UI to map content to students: `POST /content/:contentId/access` (action: `grant`/`revoke`).
2. **Student Side:**
   - Fetch assigned dashboard content: `GET /content/my-content`.
   - **Crucial Player Logic:** When building the Video/PDF viewer, set the source directly to the backend proxy stream: `GET /content/:contentId/stream`. Do not try to resolve the Drive URL physically. The backend will safely pipe the bytes, preventing hot-linking / downloading.

### Phase 5: Help Desk / Support Tickets (Module 5)
**Goal:** Internal ticketing system.
1. **Student Side:** 
   - Ticket Request Form: `POST /tickets` (Subject, message).
   - Ticket List & Thread View: `GET /tickets/my-tickets`.
   - Reply Form: `POST /tickets/:id/reply`.
2. **Admin Side:**
   - Master Ticket Inbox: `GET /tickets`.
   - Thread View & Response: `POST /tickets/:id/reply`.
   - Status Updater Dropdown: `PATCH /tickets/:id/status` (`open` -> `in_progress` -> `resolved` -> `closed`).

### Phase 6: Paid & Free Consultations (Module 6)
**Goal:** Direct 1-on-1 scheduling with auto-refund magic.
1. **Student Side:**
   - Request Call Form: `POST /consultations`. The backend automatically tracks if it's their "1 Free Call".
2. **Admin Side:**
   - Pending Requests Panel: `GET /consultations`.
   - **Accept Modal:** Sir enters the Google Meet link, Date, and Time. Connects to `POST /consultations/:id/accept`, which auto-emails the student the calendar details.
   - **Reject Modal:** Connecting to `POST /consultations/:id/reject` will silently refund the student's "Free Call" quota if it was a free tier request.
   - **Mark Payment:** `PATCH /consultations/:id/status` to mark completion + manual payment amounts.

### Phase 7: Admin Analytics Dashboard (Module 7)
**Goal:** The ultimate command center for Sir.
1. Build the Hero Stat Cards: Consume `GET /reports/summary`.
2. Build the "Expiring Soon" alert box (Data comes populated inside the summary endpoint).
3. Build the "Security Risk / IPs" table: Consume `GET /reports/suspicious-ips`.
4. Build the "Recently Watched" content ledger: Consume `GET /reports/content-logs`.
5. Build the real-time Student Location Radar: Consume `GET /reports/student/:id/radar`.

### Phase 8: Piracy & Security Alerts (Module 8)
**Goal:** Detect heuristic attempts to steal content directly off the screen.
1. **Student Side (Background):** Add window `blur` and keydown listeners mapping to Cmd+Shift+3, Cmd+Shift+4, or Print Screen inside the Content Viewer component. Immediately trigger `POST /security/alerts` if intercepted. Let the video pause to cause friction.
2. **Admin Side:** 
   - Add a Notification Bell/Widget showing count of unread Security Alerts (`GET /security/alerts?isReviewed=false`).
   - Allow Sir to click "Dismiss" tying to `PATCH /security/alerts/:id/review`. This lets admins actively hunt out account sharing and screen ripping.

---

## 📌 Important Developer Tips
> **Check the `/docs/frontend-guides/` folder!**
> There are 5 specific markdown files that provide the exact JSON payload shapes, endpoints, and dummy data responses for every single route mentioned above. Keep them open side-by-side as you build!
