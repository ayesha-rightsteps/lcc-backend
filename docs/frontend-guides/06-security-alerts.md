# Frontend Guide: Module 8 — Security & Piracy Alerts

This module creates a dedicated channel for the frontend to alert the backend when malicious behavior (like screen recording, screenshots, or inspecting network elements) is detected.

## 1. Fire a Security Alert (Student Application)

**Endpoint:** `POST /v1/security/alerts`

**Headers Required:**
- `Authorization: Bearer <Student_Access_Token>`

**Description:**
Since pure browser sandboxes cannot perfectly block external screen recorders natively, the frontend will employ heuristic JavaScript listeners (e.g., detecting `Print Screen`, `Command+Shift+3`, `Command+Shift+4`, or if the browser loses focus while video is playing). Call this endpoint immediately when an infraction is intercepted.

**Request Body:**
```json
{
  "alertType": "screenshot_attempt", // "screenshot_attempt" | "screen_recording" | "dev_tools_opened" | "suspicious_activity"
  "description": "User pressed Command+Shift+4 while watching 'Advanced Grammar PDF'"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Security event logged silently"
}
```

---

## 2. Review Alerts Dashboard (Admin)

**Endpoint:** `GET /v1/security/alerts`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:**
Provides Sir with a chronological feed of all recorded piracy violations. 

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "60d0...",
      "alertType": "screenshot_attempt",
      "description": "User pressed Print Screen",
      "ip": "192.168.1.1",
      "device": "Windows Chrome",
      "isReviewed": false,
      "student": {
         "fullName": "Student Name",
         "email": "student@example.com"
      },
      "createdAt": "2026-04-22T05:00:00.000Z"
    }
  ]
}
```

---

## 3. Mark Alert as Reviewed (Admin)

**Endpoint:** `PATCH /v1/security/alerts/:id/review`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Sir acknowledges the event and effectively hides it from the "Unread" dashboard widget.

**Request Body:** *None*

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Alert marked as reviewed"
}
```
