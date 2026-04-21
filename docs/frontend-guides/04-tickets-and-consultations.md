# Frontend Guide: Module 5 & 6 — Tickets and Consultations

This document handles Support channels and One-on-One Consultations.

## 1. Support Tickets

### Student Actions
- **Create Ticket:** `POST /v1/tickets`
  - Body: `{ "subject": "Login issues", "message": "My IP is locked." }`
- **Get My Tickets:** `GET /v1/tickets/my-tickets`
- **Reply:** `POST /v1/tickets/:ticketId/reply`
  - Body: `{ "message": "Thanks!" }`

### Admin Actions
- **Get All Tickets:** `GET /v1/tickets` (Supports `?status=open`)
- **Change Status:** `PATCH /v1/tickets/:ticketId/status`
  - Body: `{ "status": "resolved" }` // open | in_progress | resolved | closed
- **Reply:** `POST /v1/tickets/:ticketId/reply`

---

## 2. Consultations

### Student Actions
- **Request Call:** `POST /v1/consultations`
  - Body: `{ "reason": "Need help with Writing Task 2 structure" }`
  - *Logic Check:* If `User.freeConsultationUsed === false`, this call is legally marked as `isFree: true`. Next time they submit, it defaults to paid logic.
- **Get My Requests:** `GET /v1/consultations/my-consultations`

### Admin Actions
- **Get Pending:** `GET /v1/consultations` (Supports `?status=pending`)
- **Accept/Schedule:** `POST /v1/consultations/:id/accept`
  - Body: `{ "meetingLink": "https://meet.google.com/xyz", "meetingDate": "2026-05-01", "meetingTime": "14:30" }`
  - *Effect:* Fires an acceptance email directly to student.
- **Reject:** `POST /v1/consultations/:id/reject`
  - Body: `{ "rejectionReason": "Too busy this week" }` (optional)
- **Mark Complete/Paid:** `PATCH /v1/consultations/:id/status`
  - Body: `{ "status": "completed", "paymentStatus": "paid", "paymentAmount": 1500 }` (Payment logic is manual proxy)
