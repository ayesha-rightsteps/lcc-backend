# Frontend Guide: Module 1 — Auth & Admin Onboarding

This document provides the frontend with the API contracts and usage instructions for the Authentication and Student Onboarding module.

## 1. Authentication (Login)

**Endpoint:** `POST /v1/auth/login`

**Description:** Used by both Admin and Students to log in. Student logins will automatically track their IPs to enforce the 2-IP limit rule.

**Request Body:**
```json
{
  "identifier": "ayesha_lcc_0042", // Can be email OR username
  "password": "SecurePassword123"
}
```

**Frontend Payload Info (Crucial for IP Locking & Session Tracking):**
*The backend will automatically capture the IP and User-Agent from headers.*

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "role": "student",
      "fullName": "Student Name",
      "email": "student@example.com",
      "username": "ayesha_lcc_0042",
      "courseName": "Math 101"
    },
    "tokens": {
      "accessToken": "eyJhb...",
      "refreshToken": "eyJhb..."
    }
  }
}
```

**Handling 403 (Blocked):**
- If a student tries to log in with a 3rd new IP, the response will be:
  `{ "message": "IP limit reached. Your account is restricted to 2 IPs. Please contact Admin." }`
- If the account is deactivated: `{ "message": "Account is inactive" }`

---

## 2. Admin Onboarding (Create Student)

**Endpoint:** `POST /v1/users/students`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Only admins can use this. It creates a student, autogenerates their username/password, and emails them.

**Request Body:**
```json
{
  "fullName": "New Student",
  "email": "newstudent@example.com",
  "phone": "+923000000000",
  "courseName": "Advanced IELTS",
  "courseDuration": 30, // in days
  "paymentAmount": 5000,
  "paymentDate": "2026-04-21T00:00:00.000Z" // Optional, default is now
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Student onboarded successfully",
  "data": {
    "id": "...",
    "username": "ayesha_lcc_0423",
    "password": "system_generated_password", // Displayed once for Admin just in case
    "enrollmentId": "ENR-0423",
    "validityDate": "2026-05-21T00:00:00.000Z"
  }
}
```

---

## 3. Frontend Implementation Checklist
- [ ] Add `/login` route that calls `POST /v1/auth/login`.
- [ ] Ensure token storage uses `localStorage`.
- [ ] Set up Axios interceptor in `src/services/api.js` to attach `Bearer <accessToken>` on requests.
- [ ] Admin Portal: Build the **Onboard Student Form** mapping fields to `/v1/users/students`.
