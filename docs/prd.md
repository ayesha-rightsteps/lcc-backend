# PRD — LCC Academy Backend

## Product Overview

LCC Academy is a private educational platform. Students do not self-register.
The admin (Sir) manually onboards each student after payment is received.
The platform controls access strictly — who can log in, from where, to what content.

---

## Roles

| Role | Description |
|---|---|
| `admin` | Sir. Full control — creates students, manages content access, views reports, blocks/unblocks |
| `student` | Enrolled learner. Can only access what admin has granted. Read-only on content |

---

## Feature 1 — Student Onboarding (Admin Flow)

Admin creates a student account after payment is confirmed. The student never self-registers.

**Admin provides at creation time:**
- Full name
- Phone number
- Course name
- Payment amount
- Payment date
- Course duration (in days)
- Validity / expiry date (calculated or manual)

**Admin also provides:**
- Student's email address

**System auto-generates:**
- Username (e.g. `ayesha_lcc_0042`)
- Password (sent to student via email along with username)
- Enrollment ID

**After creation:**
- Student receives their username + password via email (Resend)
- Student logs in as-is — no password change required, ever
- Admin sees the student in dashboard immediately

---

## Feature 2 — Authentication

- Admin logs in via email + password (no OTP)
- Student logs in via username or email + password
- JWT access token (24h) + refresh token (7d)
- Students cannot change their own password — ever
- No self-registration. No forgot-password for students — admin resets it and emails the new one

---

## Feature 3 — IP Address Locking

Each student account is locked to a maximum of 2 IP addresses.

**How it works:**
- First login: IP is recorded as `allowedIps[0]`
- Second login from a different IP: recorded as `allowedIps[1]`
- Third+ login from a new IP: **blocked**. Admin sees an alert in the dashboard
- Admin can reset all IPs at once — student gets 2 fresh slots
- Admin can block a specific IP — that entry is marked `isBlocked: true` and that slot is freed for the next new IP the student logs in from
- A blocked IP is permanently denied even if it was previously allowed
- Admin's own account has no IP restriction

**What is stored per login attempt:**
- IP address
- Whether it was allowed or blocked
- Timestamp
- Device user-agent

---

## Feature 4 — Session & Location Tracking

Every time a student logs in or is active on the platform, their location is tracked.

**At login:**
- IP, timestamp, device, browser, lat/long (if provided by frontend)

**During active session (every 15 minutes):**
- Frontend pings `POST /student/heartbeat` with current lat/long
- Backend updates `lastSeen`, `lastLat`, `lastLng` on the student record
- This builds a session activity trail

**Admin can see:**
- Where a student logged in from (city/country from IP)
- Lat/long trail during a session
- Last seen timestamp
- Login history (paginated)

---

## Feature 5 — Student Account Controls

Admin has full control over each student account:

| Action | Effect |
|---|---|
| Deactivate | Student cannot log in. Existing tokens are invalidated |
| Block | Same as deactivate but flagged as blocked (different reason) |
| Reactivate | Student can log in again |
| Reset Password | Admin sets a new password — generated and emailed to student |
| Reset IPs | `allowedIps` cleared — student can register 2 new IPs |
| Block IP | Admin blocks a specific IP from `allowedIps` — that slot is freed for a new one |
| Revoke Content Access | Student can no longer access specific content |
| Extend Validity | Course expiry date pushed forward |

---

## Feature 6 — Content Library

Sir's content (PDFs, videos) is currently on Google Drive. The library module manages access control on top of it.

**Core principle:** Students can view content inside the platform. They cannot download it.

**How it works:**
- Admin adds content items to the library (title, type: pdf/video, Google Drive file ID, description)
- Admin grants access to a student (or a batch of students) per content item or per course
- Student sees only what they have been granted access to
- Content is served via a backend proxy endpoint — the Drive link is never exposed to the frontend
- Backend fetches from Drive using a service account, streams it to the frontend
- No direct Drive URLs. No downloadable links

**Admin can:**
- Add / remove content items
- Grant / revoke access per student
- Withdraw access even after it was granted (Sir can pull it back)
- See who has accessed which content and when

**Content types:**
- `pdf` — rendered in-browser via PDF viewer (no download button)
- `video` — streamed, not downloadable

**Access expiry:**
- Content access is tied to the student's course validity date
- When validity expires, content access is automatically blocked

---

## Feature 7 — Admin Reports

Admin dashboard gets data from these report APIs:

| Report | Description |
|---|---|
| Active students | Count + list of currently active (non-expired, non-blocked) students |
| Expiring soon | Students whose validity expires in the next 7 / 14 / 30 days |
| Blocked / deactivated | Students who are blocked or inactive |
| Login activity | Per-student login history with IP, location, device |
| Suspicious logins | Attempts from unregistered IPs (blocked attempts) |
| Content access log | Who accessed what content and when |
| Location map data | Lat/long pings for a specific student's session |

---

## Feature 8 — Support Tickets

Students can raise a support ticket for any issue. Admin responds from the dashboard.

**Student can:**
- Create a ticket (subject + message)
- View all their own tickets and their status
- See admin's response on a ticket
- Reply to admin's response (thread continues)

**Admin can:**
- View all tickets (paginated, filterable by status)
- Respond to a ticket
- Change ticket status — `open` → `in_progress` → `resolved` → `closed`
- See which student raised the ticket and their full profile link

**Ticket lifecycle:**
```
open → in_progress → resolved → closed
```
- New ticket is always `open`
- Admin moves it to `in_progress` when they start working on it
- `resolved` when admin has responded with a fix
- `closed` when the issue is done — no further replies expected

**Ticket model fields:**
- Student ref
- Subject
- Status: `open`, `in_progress`, `resolved`, `closed`
- Messages: thread array — `[{ sender (ref User), message, sentAt }]`
- `isActive` (soft delete, admin only)
- timestamps

**Rules:**
- Student cannot close or delete their own ticket
- Student can reply only if status is `open` or `in_progress`
- Admin can reply on any status
- No notifications for now (admin checks dashboard manually)

---

## Feature 9 — Consultation Requests

Students can request a one-on-one consultation with Sir. No payment gateway — Sir collects payment directly on call and then marks it as paid manually in the system.

**Student can:**
- Request a consultation (subject + preferred time slot + message)
- See their consultation history and current status
- First consultation is always free — system tracks this per student

**Admin (Sir) can:**
- View all pending consultation requests
- Accept or reject a request
- Mark a consultation as completed
- Mark payment as received (for paid consultations)
- See full history per student

**Student submits:**
- Reason for consultation (what they need help with)
- That's it — no time slot from student side, Sir decides the schedule

**Sir accepts by providing:**
- Meeting link (Google Meet, Zoom, etc.)
- Date
- Time
- Then hits accept → email fires automatically to student with all meeting details

**Consultation lifecycle:**
```
pending → accepted → completed
                  ↘ payment_pending → paid
         → rejected
```
- Student submits with reason → `pending`
- Sir adds meeting link + date + time → accepts → `accepted` → email sent to student
- Sir rejects → `rejected` (with optional reason, email sent to student)
- After the call, Sir marks → `completed`
- If it was a paid consultation, Sir marks payment → `payment_pending` then → `paid` after collecting on call

**Free vs Paid logic:**
- Each student gets exactly 1 free consultation
- System checks `freeConsultationUsed` on the student's record at request time
- If `false` → this request is free, set `isFree: true` on the consultation, then mark `freeConsultationUsed: true`
- All subsequent requests are paid — amount is set manually by Sir when marking payment received
- No Razorpay, no Stripe, no UPI integration — Sir collects directly on call

**Consultation model fields:**
- Student ref
- Reason (why they want the consultation)
- Status: `pending`, `accepted`, `rejected`, `completed`
- `isFree`: Boolean
- Meeting details (filled by Sir on accept):
  - `meetingLink`: String
  - `meetingDate`: Date
  - `meetingTime`: String
- `rejectionReason`: String (optional, filled on reject)
- `paymentStatus`: `not_applicable` (free) | `payment_pending` | `paid`
- `paymentAmount`: Number (filled by Sir after collecting on call)
- `paymentReceivedAt`: Date
- `isActive`, timestamps

**Emails sent automatically:**
- On `accepted` → student gets meeting link, date, time
- On `rejected` → student gets rejection reason (if provided)

---

## Security Requirements

- Passwords hashed with bcrypt (12 rounds)
- JWT is stateless — no Redis
- IP locking enforced at login middleware level
- Content Drive IDs are never sent to frontend — only the proxy endpoint URL
- All student endpoints require `authenticate` middleware
- All admin endpoints require `authenticate` + `isAdmin` middleware
- Student can only access their own data — never another student's
- Validity expiry is checked on every authenticated request for student role
- Rate limiting on login endpoint (prevent brute force)

---

## Out of Scope (for now)

- Student self-registration
- Payments / Razorpay / Stripe integration (manual payment confirmation by admin)
- Mobile app
- Live classes / video conferencing
- Quizzes / assessments
- Student-to-student interaction
- Multiple admins / sub-admin roles
