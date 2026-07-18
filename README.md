# CredX

CredX is a campus placement portal that connects **students**, **companies**, and the **placement cell (admin)** in one workflow — from job posting to approval to application to selection.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Core Workflow](#core-workflow)
- [Database Structure](#database-structure)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Frontend Structure](#frontend-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)

---

## Overview

CredX replaces the usual spreadsheet-and-email placement process with a single portal:

- **Students** browse admin-approved jobs, upload a resume, apply, and track application status.
- **Companies** post jobs, review applicants, and shortlist/select/reject candidates.
- **Admins** approve or reject job postings and oversee all companies, jobs, and applications on the platform.

---

## Tech Stack

**Backend**
| Layer | Choice |
|---|---|
| Framework | Spring Boot 3 |
| Language | Java 21 |
| Database | MySQL |
| Auth | JWT (access + refresh tokens) |
| File storage | Cloudinary (resume uploads) |
| Build tool | Gradle |
| Security | Spring Security |

**Frontend**
| Layer | Choice |
|---|---|
| Library | React |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Routing | React Router |
| Icons | Lucide |
| API layer | Custom service layer (`services/`) |

---

## User Roles

| Role | Enum | Can do |
|---|---|---|
| Student | `ROLE_STUDENT` | Browse approved jobs, upload resume, apply, track applications |
| Company | `ROLE_COMPANY` | Post jobs, view applicants, update application status |
| Admin | `ROLE_ADMIN` | Approve/reject job postings, view all companies, jobs, and applications |

Company and Admin signups require an **invitation key**; Student signup does not.

---

## Core Workflow

```
Company Signup
      │
      ▼
Company Login
      │
      ▼
Create Job  (status → PENDING)
      │
      ▼
Admin Login
      │
      ▼
Approve / Reject Job
      │
      ▼
Student Login
      │
      ▼
View Approved Jobs
      │
      ▼
Upload Resume
      │
      ▼
Apply
      │
      ▼
Company Views Applicants
      │
      ▼
Shortlist / Reject / Select
      │
      ▼
Student Opens My Applications
      │
      ▼
Updated Status Visible
```

---

## Database Structure

The schema is intentionally small — three tables handle the entire platform.

### 1. `User`
Stores every account type (Student, Company, Admin) in one table.

| Field | Type |
|---|---|
| id | UUID |
| username | String |
| password | String (encrypted) |
| fullName | String |
| email | String |
| branch | String *(student only)* |
| batchYear | Integer *(student only)* |
| companyName | String *(company only)* |
| website | String *(company only)* |
| location | String *(company only)* |
| resumeUrl | String *(student only)* |
| role | Enum: `ROLE_STUDENT`, `ROLE_COMPANY`, `ROLE_ADMIN` |

### 2. `JobPosting`
Each job belongs to exactly one company.

| Field | Type |
|---|---|
| id | Long |
| title | String |
| description | Text |
| location | String |
| packageOffered | String |
| minimumCgpa | Double |
| applicationDeadline | LocalDate |
| status | Enum: `PENDING`, `APPROVED`, `REJECTED`, `CLOSED` |
| createdAt | LocalDateTime |
| company | `User` (company) |

### 3. `Application`
One student applying to one job.

| Field | Type |
|---|---|
| id | Long |
| student | `User` |
| jobPosting | `JobPosting` |
| status | Enum: `PENDING`, `SHORTLISTED`, `REJECTED`, `SELECTED` |
| appliedAt | LocalDateTime |

**Relationships**

```
User
 ├── Company ── JobPosting ─┐
 └── Student ────────────────┴── Application
```

---

## Authentication

JWT-based. On login, the backend returns:

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

The frontend stores `accessToken` and attaches it to every protected request:

```
Authorization: Bearer <accessToken>
```

---

## API Reference

### Auth

**Student signup** — `POST /auth/signup`
```json
{
  "username": "piyush",
  "password": "piyush123",
  "fullName": "Piyush Mishra",
  "email": "piyush@gmail.com",
  "branch": "CSE",
  "batchYear": 2029,
  "role": "ROLE_STUDENT"
}
```

**Company signup** — `POST /auth/signup`
```json
{
  "username": "atlassian",
  "password": "atlassian123",
  "fullName": "Atlassian India",
  "email": "atlassian@gmail.com",
  "companyName": "Atlassian",
  "website": "https://www.atlassian.com",
  "location": "Bengaluru",
  "role": "ROLE_COMPANY",
  "invitationKey": "COMPANY@PLACEMENT2026"
}
```

**Login** — `POST /auth/login`
```json
{ "username": "piyush", "password": "piyush123" }
```
Returns `{ accessToken, refreshToken }`.

### Student

| Method | Endpoint | Description |
|---|---|---|
| GET | `/student/jobs` | List all approved jobs |
| POST | `/student/upload-resume` | Multipart upload (`file` key, PDF) → returns Cloudinary URL |
| POST | `/student/jobs/{jobId}/apply` | Apply to a job (no body) |
| GET | `/student/applications` | List the student's own applications |

### Company

| Method | Endpoint | Description |
|---|---|---|
| POST | `/company/jobs` | Create a job (starts as `PENDING`) |
| GET | `/company/jobs/{jobId}/applications` | View applicants for a job |
| PUT | `/company/applications/{applicationId}/status?status=SHORTLISTED` | Update an applicant's status |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/jobs/pending` | List jobs awaiting approval |
| PUT | `/admin/jobs/{jobId}/approve` | Approve a job |
| PUT | `/admin/jobs/{jobId}/reject` | Reject a job |

> **Note:** the admin dashboard's "all companies" and "all applications" views currently need matching endpoints on the backend (e.g. `GET /admin/companies`, `GET /admin/applications`) — only `pending jobs` and approve/reject are documented so far.

---

## Frontend Structure

```
src/
├── pages/
│   ├── SignupPage.jsx          # role-based signup (Student / Company / Admin)
│   └── AdminDashboard.jsx      # admin console: companies, jobs, applications
├── components/
│   ├── AdminSidebar.jsx
│   ├── StatCard.jsx
│   ├── StatusBadge.jsx         # shared badge for job/application status
│   ├── CompaniesTable.jsx
│   ├── JobApprovalCard.jsx     # job card with Approve / Reject actions
│   └── ApplicationsTable.jsx
└── services/
    ├── authService.js
    ├── studentService.js
    ├── companyService.js
    └── adminService.js
```

Signup dynamically shows/hides fields based on the selected role:

- **Student** → `branch`, `batchYear`
- **Company** & **Admin** → `invitationKey`
- **Company only** → `companyName`, `website`, `location`

---

## Getting Started

### Backend
```bash
# application.properties must be configured — see Environment Variables below
./gradlew bootRun
```

### Frontend
```bash
npm install
npm run dev
```

---

## Environment Variables

Backend (`application.properties`):

```properties
# Database
spring.datasource.url=jdbc:mysql://<HOST>:3306/<DATABASE>
spring.datasource.username=<USERNAME>
spring.datasource.password=<PASSWORD>

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=<YOUR_SECRET_KEY>

# Invitation Keys
app.admin.invitation-key=ADMIN@PLACEMENT2026
app.company.invitation-key=COMPANY@PLACEMENT2026

# Cloudinary
cloudinary.cloud-name=<CLOUD_NAME>
cloudinary.api-key=<API_KEY>
cloudinary.api-secret=<API_SECRET>

# Multipart
spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
```

---

## Roadmap

- [ ] Company dashboard (create job, view applicants, shortlist/select/reject)
- [ ] Student dashboard (browse jobs, upload resume, track applications)
- [ ] `GET /admin/companies` and `GET /admin/applications` endpoints
- [ ] Profile endpoint to resolve role after login without decoding the JWT client-side