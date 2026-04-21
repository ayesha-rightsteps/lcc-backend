# LCC Academy Backend — Implementation Plan

This document outlines the step-by-step plan for building the backend based on `prd.md` and the architecture defined in `AGENTS.md`.

## 1. Foundation & Authentication (Features 1, 2, & 3)
- **Models**:
  - `User` (Admin & Student roles, fields for onboarding: name, phone, course, durations, validation/expiry). Include `allowedIps` array and `isBlocked` flag.
  - `Session` (optional or inline inside User's `lastSeen`, `lastLat`, `lastLng`) for tracking.
- **Auth Module (`src/modules/auth`)**:
  - `login` (email/username + password)
  - Admin login vs Student login logic (IP tracking & locking logic applies to students)
- **User/Admin Module (`src/modules/users`)**:
  - `createStudent` (Admin only - generates username/password, sends email via Resend)
  - `resetPassword`, `blockIP`, `resetIPs`

## 2. Session Tracking & Admin Controls (Features 4 & 5)
- **Session Tracking (`src/modules/sessions` or `users`)**:
  - `POST /student/heartbeat` (Updates lastSeen, lat, lng)
- **Admin Controls (`src/modules/admin`)**:
  - Endpoints to deactivate, block, reactivate, extend validity, revoke access.
  - Integration with JWT validation middleware to reject tokens if `isActive: false` or expired.

## 3. Content Library (Feature 6)
- **Models**:
  - `Content` (title, type, driveId, description)
  - `ContentAccess` (mapping user to content, or array inside Content/User)
- **Content Module (`src/modules/content`)**:
  - Admin: `createContent`, `grantAccess`, `revokeAccess`
  - Student: `listMyContent`
  - `GET /content/stream/:id` (Backend proxy to Google Drive, streams back to client to prevent downloading)

## 4. Support Tickets (Feature 8)
- **Models**: `Ticket` (student ref, subject, status, messages array)
- **Ticket Module (`src/modules/tickets`)**:
  - Student: `createTicket`, `replyTicket`, `getMyTickets`
  - Admin: `getAllTickets`, `replyTicket`, `updateTicketStatus`

## 5. Consultations (Feature 9)
- **Models**: `Consultation` (student ref, reason, status, meeting details, payment details, isFree)
- **Consultation Module (`src/modules/consultations`)**:
  - Student: `requestConsultation`, `getMyConsultations` (checks `freeConsultationUsed`)
  - Admin: `getPendingConsultations`, `acceptConsultation`, `rejectConsultation`, `markCompleted`, `markPaid`

## 6. Admin Reports (Feature 7)
- **Report Module (`src/modules/reports` or `admin`)**:
  - `getDashboardStats` (Active students, expiring soon, blocked)
  - `getLoginHistory`, `getSuspiciousLogins`, `getContentAccessLogs`
  - `getLocationTrail`

## Execution Steps:
1. **Setup base models** (User).
2. **Build Auth Module** + JWT Middleware + IP Locking.
3. **Build Admin Onboarding** (Student Creation + Resend Email integration).
4. **Build Student Session Tracking** & Admin Controls.
5. **Build Content Library** with Drive Proxy.
6. **Build Tickets & Consultations**.
7. **Build Admin Reports**.
