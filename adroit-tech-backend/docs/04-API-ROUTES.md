# 04 — API Routes Specification

## Base URL
```
Production:  https://api.adroittech.com/api/v1
Development: http://localhost:3000/api/v1
```

## Response Envelope

All responses follow this shape:

```typescript
// Success
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },          // or Array
  "meta": {                 // Optional — for paginated responses
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}

// Error
{
  "success": false,
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [               // Optional — validation errors
    { "field": "email", "message": "Invalid email" }
  ],
  "requestId": "uuid"       // For support tracing
}
```

---

## Legend

| Symbol | Meaning |
|---|---|
| 🔓 | Public — no auth required |
| 🔐 | Requires valid Access Token |
| 👤 | JOB_SEEKER role |
| 🏢 | EMPLOYER role |
| 🛡️ | ADMIN role |
| 🔐👤🏢 | Any authenticated user |

---

## Auth Routes `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register/job-seeker` | 🔓 | Register as job seeker |
| POST | `/auth/register/employer` | 🔓 | Register as employer |
| POST | `/auth/login` | 🔓 | Login (any role) |
| POST | `/auth/logout` | 🔐 | Logout (revoke refresh token) |
| POST | `/auth/logout-all` | 🔐 | Revoke all sessions |
| POST | `/auth/refresh` | 🔓 | Refresh access token |
| POST | `/auth/verify-email` | 🔐 | Verify email with OTP |
| POST | `/auth/resend-verification` | 🔐 | Resend verification OTP |
| POST | `/auth/forgot-password` | 🔓 | Send password reset email |
| POST | `/auth/reset-password` | 🔓 | Reset password with token |
| PATCH | `/auth/change-password` | 🔐 | Change password (authenticated) |
| GET | `/auth/me` | 🔐 | Get current user info |

### Request/Response Examples

#### `POST /auth/register/job-seeker`
```json
// Request Body
{
  "fullName": "Ramesh Singh",
  "phone": "9876543210",
  "email": "ramesh@example.com",       // optional
  "password": "SecurePass@123",
  "preferredCity": "Delhi",
  "experience": "FRESHER"
}

// Response 201
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": {
      "id": "uuid",
      "role": "JOB_SEEKER",
      "status": "PENDING_VERIFICATION",
      "email": "ramesh@example.com",
      "phone": "9876543210"
    }
  }
}
```

#### `POST /auth/register/employer`
```json
// Request Body
{
  "companyName": "ABC Securities Pvt. Ltd.",
  "contactPerson": "Rajesh Kumar",
  "email": "rajesh@abcsec.com",
  "phone": "9123456789",
  "password": "SecurePass@123",
  "industry": "Commercial",
  "companySize": "51-200",
  "address": "Plot 42, Sector 18",
  "city": "Gurgaon",
  "gstNumber": "07AABCU9603R1ZV",     // optional
  "panNumber": "AABCU9603R"            // optional
}
```

#### `POST /auth/login`
```json
// Request Body — supports email OR phone
{
  "identifier": "ramesh@example.com",  // email or phone
  "password": "SecurePass@123"
}
```

---

## Job Seeker Routes `/job-seekers`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/job-seekers/profile` | 🔐👤 | Get own profile |
| PUT | `/job-seekers/profile` | 🔐👤 | Update own profile |
| POST | `/job-seekers/profile/photo` | 🔐👤 | Upload profile photo |
| POST | `/job-seekers/profile/resume` | 🔐👤 | Upload resume |
| GET | `/job-seekers/applications` | 🔐👤 | List own applications |
| GET | `/job-seekers/applications/:id` | 🔐👤 | Get application detail |
| POST | `/job-seekers/applications/:id/withdraw` | 🔐👤 | Withdraw application |
| GET | `/job-seekers/saved-jobs` | 🔐👤 | List saved jobs |
| POST | `/job-seekers/saved-jobs/:jobId` | 🔐👤 | Save a job |
| DELETE | `/job-seekers/saved-jobs/:jobId` | 🔐👤 | Unsave a job |
| GET | `/job-seekers/notifications` | 🔐👤 | List notifications |
| PATCH | `/job-seekers/notifications/:id/read` | 🔐👤 | Mark notification as read |
| PATCH | `/job-seekers/notifications/read-all` | 🔐👤 | Mark all as read |

---

## Employer Routes `/employers`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/employers/profile` | 🔐🏢 | Get own company profile |
| PUT | `/employers/profile` | 🔐🏢 | Update company profile |
| POST | `/employers/profile/logo` | 🔐🏢 | Upload company logo |
| POST | `/employers/profile/pan-card` | 🔐🏢 | Upload PAN card (sensitive) |
| GET | `/employers/dashboard/stats` | 🔐🏢 | Dashboard stats |
| GET | `/employers/jobs` | 🔐🏢 | List own jobs (all statuses) |
| GET | `/employers/jobs/:id` | 🔐🏢 | Get own job detail |
| GET | `/employers/jobs/:id/applications` | 🔐🏢 | Applications for a specific job |
| GET | `/employers/applications` | 🔐🏢 | All applications across jobs |
| GET | `/employers/applications/:id` | 🔐🏢 | Get application detail |
| PATCH | `/employers/applications/:id/status` | 🔐🏢 | Update application status |
| PATCH | `/employers/applications/:id/notes` | 🔐🏢 | Add internal notes |
| GET | `/employers/notifications` | 🔐🏢 | List notifications |

---

## Jobs Routes `/jobs`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/jobs` | 🔓 | List all ACTIVE jobs (paginated, filterable) |
| GET | `/jobs/featured` | 🔓 | Featured jobs only |
| GET | `/jobs/:idOrSlug` | 🔓 | Get job detail |
| POST | `/jobs` | 🔐🏢🛡️ | Create new job |
| PUT | `/jobs/:id` | 🔐🏢🛡️ | Update job |
| PATCH | `/jobs/:id/status` | 🔐🏢🛡️ | Change job status (DRAFT→ACTIVE, etc.) |
| DELETE | `/jobs/:id` | 🔐🏢🛡️ | Soft delete job |
| POST | `/jobs/:id/applications` | 🔐👤 | Apply for a job |

### `GET /jobs` Query Parameters

```
GET /jobs?
  city=Delhi
  &category=Security+Guard
  &type=FULL_TIME
  &shift=DAY
  &experienceLevel=FRESHER
  &salaryMin=15000
  &salaryMax=30000
  &isFeatured=true
  &search=security+guard+night
  &page=1
  &limit=20
  &sortBy=createdAt           // createdAt | salaryMax | salaryMin
  &sortOrder=desc             // asc | desc
```

### `POST /jobs/:id/applications` — Apply for Job
```json
// Request Body
{
  "availability": "immediate",
  "coverNote": "I am very interested in this position...",
  "experienceNote": "3 years as security guard at XYZ Mall"
}
// Resume/photo are taken from job seeker's profile automatically
```

---

## Admin Routes `/admin`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/dashboard` | 🔐🛡️ | Platform-wide stats |
| GET | `/admin/users` | 🔐🛡️ | List all users (paginated, filterable) |
| GET | `/admin/users/:id` | 🔐🛡️ | User detail |
| PATCH | `/admin/users/:id/status` | 🔐🛡️ | Activate/Suspend/Deactivate user |
| GET | `/admin/employers` | 🔐🛡️ | List all employers (filterable by status) |
| GET | `/admin/employers/:id` | 🔐🛡️ | Employer detail with profile |
| PATCH | `/admin/employers/:id/approve` | 🔐🛡️ | Approve employer |
| PATCH | `/admin/employers/:id/reject` | 🔐🛡️ | Reject employer (with reason) |
| GET | `/admin/jobs` | 🔐🛡️ | List all jobs (all statuses) |
| PATCH | `/admin/jobs/:id/feature` | 🔐🛡️ | Toggle job featured status |
| DELETE | `/admin/jobs/:id` | 🔐🛡️ | Hard delete a job (admin only) |
| GET | `/admin/applications` | 🔐🛡️ | All applications across platform |
| GET | `/admin/audit-logs` | 🔐🛡️ | System audit trail |
| GET | `/admin/documents/:id` | 🔐🛡️ | Access sensitive documents (PAN) |

---

## Upload Routes `/uploads`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/uploads/presigned-url` | 🔐 | Get S3 presigned upload URL |
| DELETE | `/uploads/:documentId` | 🔐 | Delete own document |

---

## Health & Monitoring

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | 🔓 | Basic liveness check |
| GET | `/health/ready` | 🔓 | Readiness (DB + Redis connected) |
| GET | `/api/v1/docs` | 🔓 | Swagger UI |

---

## Pagination Standard

All list endpoints support:

```typescript
interface PaginationQuery {
  page?: number;    // default: 1
  limit?: number;   // default: 20, max: 100
  sortBy?: string;  // field name
  sortOrder?: 'asc' | 'desc';  // default: 'desc'
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

---

## HTTP Status Codes Used

| Code | Meaning | When Used |
|---|---|---|
| 200 | OK | GET, PUT, PATCH success |
| 201 | Created | POST success (resource created) |
| 204 | No Content | DELETE success |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Token valid but insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate (e.g., already applied, email in use) |
| 422 | Unprocessable Entity | Business logic rejection |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server errors |
| 503 | Service Unavailable | DB/Redis down (health check) |
