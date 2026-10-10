# MSK Institute Web Platform (Monorepo)

This repository contains the full-stack architecture for **MSK Institute**, split into modern `frontend/` (Next.js 15, React 19, Tailwind CSS) and `backend/` (Django 6 REST Framework with SimpleJWT).

---

## 📁 Repository Structure

```text
MSK-Institute-Website/
├── frontend/                     # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/           # Multi-identifier login (Username, Email, Phone)
│   │   │   ├── register/        # Registration (first_name, last_name, email, phone, password, gender)
│   │   │   ├── forgot-password/ # OTP-based verification & password reset
│   │   │   ├── profile/         # Authenticated student profile
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Global Auth state, silent refresh, session persistence
│   │   ├── services/
│   │   │   └── authApi.ts       # Type-safe API client
│   │   └── types/
│   │       └── auth.ts          # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                      # Django REST Framework Backend
│   ├── authentication/
│   │   ├── models.py            # CustomUser (AbstractUser) & UserSession models
│   │   ├── serializers.py       # Register, User, Forgot & Reset serializers
│   │   ├── views.py             # LoginAPIView, RegisterAPIView, LogoutView, CustomTokenRefreshView
│   │   ├── urls.py              # Auth endpoint routing
│   │   └── tests.py             # Complete test suite (9 test cases)
│   ├── config/
│   │   ├── settings.py          # DRF, SimpleJWT, and CORS configuration
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
│
└── .gitignore                    # Monorepo gitignore
```

---

## 🌿 Git Branches

| Branch | Description |
|---|---|
| `main` | Production-ready monorepo combining frontend and backend |
| `backend` | Base branch for Django REST Framework backend |
| `backend-auth` | Auth branch inside `backend` with CustomUser, UserSession, DRF JWT views & tests |
| `backend-super-admin` | Super Admin backend branch with Branch, Staff, Student, and Affiliate models, views, and seed data |
| `frontend` | Base branch for Next.js frontend |
| `frontend-auth` | Auth branch inside `frontend` with Register, Login, Forgot Password, and Profile pages |
| `frontend-super-admin` | Super Admin frontend branch with interactive Dashboard, Branches, Staff, Students, and Affiliates tabs |

---

## 🚀 Getting Started

### 1. Backend Setup (Django REST Framework)

```bash
cd backend

# Create virtual environment (optional)
py -m venv venv
venv\Scripts\activate

# Install dependencies
py -m pip install -r requirements.txt

# Run migrations
py manage.py migrate

# Run test suite
py manage.py test authentication

# Start Django development server
py manage.py runserver 8000
```

The Django server will be running at `http://localhost:8000`.

### 2. Frontend Setup (Next.js 15)

```bash
cd frontend

# Install dependencies
npm install

# Type check
npm run typecheck

# Start development server
npm run dev
```

The Next.js application will be running at `http://localhost:3000`.

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register with `first_name`, `last_name`, `email`, `phone`, `password`, `gender` |
| `POST` | `/api/auth/login/` | Multi-identifier login (`identifier`: username/email/phone, `password`) |
| `POST` | `/api/auth/logout/` | Blacklist refresh token & clear `UserSession` |
| `POST` | `/api/auth/token/refresh/` | Rotate access token and update session `access_jti` |
| `GET` | `/api/auth/me/` | Authenticated user profile |
| `POST` | `/api/auth/forgot-password/` | Send 6-digit OTP to registered account |
| `POST` | `/api/auth/reset-password/` | Reset password using OTP |

---

## 🏢 Super Admin Management Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard/` | Consolidated KPI summary (branches, staff, students, finances, affiliates) |
| `GET`, `POST` | `/api/admin/branches/` | List and create franchise branches |
| `GET`, `PATCH`, `DELETE` | `/api/admin/branches/<id>/` | Retrieve, update, or remove branch details |
| `GET`, `POST` | `/api/admin/staff/` | List and add staff/faculty members |
| `GET`, `PATCH`, `DELETE` | `/api/admin/staff/<id>/` | Retrieve, update, or remove staff members |
| `GET`, `POST` | `/api/admin/students/` | List and enroll students with tuition fee status |
| `GET`, `PATCH`, `DELETE` | `/api/admin/students/<id>/` | Retrieve, update, or remove student enrollments |
| `GET`, `POST` | `/api/admin/affiliates/` | List and create partner affiliate codes |
| `GET`, `PATCH`, `DELETE` | `/api/admin/affiliates/<id>/` | Retrieve, update, or remove affiliate partners |

