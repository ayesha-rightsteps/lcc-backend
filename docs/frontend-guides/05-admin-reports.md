# Frontend Guide: Module 7 — Admin Reports & Dashboard Stats

This module feeds Sir's dashboard with real-time statistics, alerts, and tracking data.

## 1. Get Dashboard Summary Stats

**Endpoint:** `GET /v1/reports/summary`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Main dashboard aggregation containing counts for total students, active students, and students expiring within 14 days.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "totalStudents": 42,
    "activeStudents": 38,
    "blockedOrInactive": 4,
    "expiringSoonList": [
      {
        "id": "60d...",
        "fullName": "Student Name",
        "email": "student@example.com",
        "validityDate": "2026-04-30T00:00:00.000Z" // within 14 days
      }
    ]
  }
}
```

---

## 2. Get Suspicious/Blocked IPs Check

**Endpoint:** `GET /v1/reports/suspicious-ips`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Returns a list of students who have IPs explicitly marked as blocked or have reached the 2-IP limit, allowing Sir to address account sharing natively on the frontend dashboard.

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
       "studentId": "...",
       "fullName": "...",
       "blockedIps": ["192.168.1.5"]
    }
  ]
}
```

---

## 3. Location Trail & Activity Radar

**Endpoint:** `GET /v1/reports/student/:studentId/radar`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Connects to the heartbeat module to return exact mapped coordinates and active time metrics for a specific student's latest session.

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "lastSeen": "2026-04-21T05:30:00.000Z",
    "lastLat": 31.5204,
    "lastLng": 74.3587,
    "allowedIpsList": [ { "ip": "1.2.3.4", "device": "Chrome Mac", "isBlocked": false } ]
  }
}
```

---

## 4. Content Access Log (Who watched what)

**Endpoint:** `GET /v1/reports/content-logs`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Consumes the `ContentLog` aggregation to show Sir exactly who cracked open PDFs or launched videos, with timestamps.

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
       "contentTitle": "Advanced Module 1",
       "studentName": "Student Name",
       "accessedAt": "2026-04-21T18:00:00.000Z",
       "ip": "10.0.0.5",
       "device": "Safari iOS"
    }
  ]
}
```
