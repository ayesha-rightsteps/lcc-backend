# Frontend Guide: Module 4 — Content Library

This document contains the endpoints for navigating and streaming from the integrated Google Drive Content Library.

## 1. List My Content (Student)

**Endpoint:** `GET /v1/content/my-content`

**Headers Required:**
- `Authorization: Bearer <Student_Access_Token>`

**Description:**
Returns a list of all PDFs and Videos that Sir has explicitly granted this logged-in student access to.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Content fetched successfully",
  "data": [
    {
      "id": "60d0fe4...",
      "title": "Advanced Module 1",
      "type": "video",
      "description": "Intro to Advanced English",
      "createdAt": "2026-04-22T00:00:00.000Z"
    }
  ]
}
```

---

## 2. Stream Content (Student)

**Endpoint:** `GET /v1/content/:contentId/stream`

**Headers Required:**
- `Authorization: Bearer <Student_Access_Token>`

**Description:**
CRITICAL: Never expose Google Drive URLs in the frontend! Instead, set this backend API endpoint directly in your HTML `<video src="...">` or `<iframe src="...">` for PDFs. The backend intercepts the Google stream and pipes it securely to the client. This restricts downloading capabilities natively.

**Important Note for Video/PDF Players:**
If making a direct API call (using Axios) fails because of missing auth headers injected by `<video>`, you must append the token in a query parameter OR make a blob fetch via Axios and URL.createObjectURL(blob).
*Recommended pattern for secure stream components will be provided during frontend implementation.*

---

## 3. Manage Content (Admin)

**Endpoint:** `POST /v1/content`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Sir registers new content from Drive.

**Request Body:**
```json
{
  "title": "Course Introduction",
  "type": "video", // "video" | "pdf"
  "driveId": "1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV", // Copied from Google Drive share link
  "description": "Basic intro to the course outline"
}
```

---

## 4. Grant / Revoke Access (Admin)

**Endpoint:** `POST /v1/content/:contentId/access`

**Headers Required:**
- `Authorization: Bearer <Admin_Access_Token>`

**Description:** Give or remove a student's permission to view a specific library item.

**Request Body:**
```json
{
  "studentId": "60d0fe4f5311236168a109ca",
  "action": "grant" // "grant" | "revoke"
}
```
