# Frontend Guide: Module 7 — Admin Reports & Dashboard Stats

This module feeds Sir's dashboard with real-time statistics, alerts, and tracking data.

## 1. Get Dashboard Summary Stats

**Endpoint:** `GET /v1/reports/summary`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Main dashboard aggregation — counts for total students, active students, students expiring within 14 days, open tickets, pending consultations, and unreviewed security alerts.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "totalStudents": 42,
    "activeStudents": 38,
    "blockedOrInactive": 4,
    "totalContent": 12,
    "openTickets": 3,
    "pendingConsultations": 5,
    "unreviewedAlerts": 2,
    "expiringSoon": [
      {
        "_id": "60d...",
        "fullName": "Student Name",
        "email": "student@example.com",
        "validityDate": "2026-04-30T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 2. Get Expiring Students

**Endpoint:** `GET /v1/reports/students/expiring?days=14`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Query Params:**
- `days` (optional, default `14`) — look-ahead window in days

**Description:** Returns students whose validity expires within the given number of days. Useful for renewal follow-up.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Expiring students fetched",
  "data": [
    {
      "_id": "60d...",
      "fullName": "Student Name",
      "email": "student@example.com",
      "phone": "03001234567",
      "courseName": "IELTS Preparation",
      "validityDate": "2026-05-05T00:00:00.000Z",
      "enrollmentId": "LCC-STU-123456"
    }
  ]
}
```

---

## 3. Consultation Report

**Endpoint:** `GET /v1/reports/consultations`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Full consultation stats including revenue from paid sessions.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Consultation report fetched",
  "data": {
    "total": 20,
    "pending": 5,
    "accepted": 8,
    "rejected": 2,
    "completed": 5,
    "totalRevenue": 25000,
    "paidSessions": 10,
    "recentPaid": [
      {
        "_id": "...",
        "paymentAmount": 2500,
        "student": { "_id": "...", "fullName": "Student Name", "email": "s@example.com" }
      }
    ]
  }
}
```

---

## 4. Ticket Report

**Endpoint:** `GET /v1/reports/tickets`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Ticket counts broken down by status.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Ticket report fetched",
  "data": {
    "total": 15,
    "open": 3,
    "inProgress": 4,
    "resolved": 6,
    "closed": 2
  }
}
```

---

## 5. Get Suspicious/Blocked IPs

**Endpoint:** `GET /v1/reports/suspicious-ips`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Returns students who have IPs explicitly marked as blocked — indicates possible account sharing attempts.

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "studentId": "...",
      "fullName": "Student Name",
      "email": "student@example.com",
      "blockedIps": ["192.168.1.5"]
    }
  ]
}
```

---

## 6. Location Trail & Activity Radar

**Endpoint:** `GET /v1/reports/student/:studentId/radar`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Returns the student's last known location (from heartbeat) and their registered IP list.

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "fullName": "Student Name",
    "lastSeen": "2026-04-21T05:30:00.000Z",
    "lastLat": 31.5204,
    "lastLng": 74.3587,
    "allowedIps": [
      { "ip": "1.2.3.4", "device": "Chrome Mac", "isBlocked": false }
    ]
  }
}
```

---

## 7. Content Access Log

**Endpoint:** `GET /v1/reports/content-logs`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Last 100 content access events — who opened what, when, from which device and IP.

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "student": { "fullName": "Student Name", "email": "s@ePending Consultationsxample.com" },
      "content": { "title": "Advanced Module 1", "type": "video" },
      "ip": "10.0.0.5",
      "device": "Safari iOS",
      "createdAt": "2026-04-21T18:00:00.000Z"
    }
  ]
}
```
