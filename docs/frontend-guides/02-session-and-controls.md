# Frontend Guide: Module 3 — Session Tracking & Admin Controls

This document provides the API contracts for Session Location Tracking and Admin Controls over student accounts.

## 1. Session Heartbeat (Student)

**Endpoint:** `POST /v1/users/heartbeat`

**Headers Required:**
- `Authorization: Bearer <Student_Access_Token>`

**Description:**
The frontend must call this ping every 15 minutes while the student is active on the dashboard or watching a video. This feeds location and activity data into the admin dashboard trail.

**Request Body:**
```json
{
  "lat": 31.5204, // Optional. Get from browser navigator.geolocation
  "lng": 74.3587  // Optional.
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Heartbeat updated"
}
```

---

## 2. Admin Controls: Modify Student

**Endpoint:** `POST /v1/users/:studentId/status`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Used by Sir to Deactivate, Block, Reactivate, or manually manipulate validity features.

**Request Body:**
```json
{
  "action": "deactivate", // "deactivate" | "block" | "reactivate" | "extend_validity"
  "extendedDays": 30 // Required ONLY if action is "extend_validity"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Student status updated successfully",
  "data": { ...updatedUserObject }
}
```

---

## 3. Admin Controls: Reset Password

**Endpoint:** `POST /v1/users/:studentId/reset-password`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Sir generates a fresh random password for the student and emails it directly to them.

**Request Body:** *None*

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password reset and emailed to student",
  "data": { "newPassword": "random_secure_string" } // Displayed to Admin inside the modal
}
```

---

## 4. Admin Controls: IP Controls

**Endpoint:** `POST /v1/users/:studentId/ips`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Admin can either clear out all IP locks to give the student 2 fresh slots, or explicitly block a specific IP from the allowed list.

**Request Body:**
```json
{
  "action": "reset", // "reset" | "block_ip"
  "ipToBlock": "192.168.1.1" // Required ONLY if action == "block_ip"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "IP restrictions updated"
}
```
