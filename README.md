# TrueHire 🚀
> **"Verified opportunities. Real careers."**
> A modern, trust-first Job & Internship SaaS marketplace designed for students and early-career professionals, engineered with a strict administrative verification trust firewall.

---

## 🌟 Product Overview & Core Rule

Traditional job boards suffer from ghost jobs, spam recruiters, and fake listings. **TrueHire** solves this fundamentally through architectural enforcement:

### 🔒 Core Architectural Invariant
1. Recruiters can register companies, create job listings, and edit openings.
2. **Public users can see jobs ONLY when:**
   $$\text{company.verificationStatus} \equiv \text{"valid"}$$
3. If an administrator marks a company as `invalid` or `pending`, **all jobs from that company are automatically and immediately hidden from public discovery**.
4. When a company is rejected, an **Admin Audit Note is strictly mandatory** in both the backend schema validation and the administrative frontend UI.
5. Admin accounts are **never publicly registerable**; they are seeded securely via automated cryptographic migrations.

---

## 🎨 Design System & Aesthetic

Inspired by **Linear, Stripe, Vercel, Arc, and Mercury**:
- **Palette**:
  - Backgrounds: Deep Midnight Navy (`#07090E`, `#0B0F19`, `#0F1524`, `#131B2E`)
  - Primary Electric Blue: `#2563EB` / `#3B82F6`
  - Accents: Electric Cyan (`#06B6D4`), Purple (`#8B5CF6`)
  - Status Colors:
    - **Valid (Verified)**: Emerald Green (`#22C55E`) ✔
    - **Pending**: Amber Gold (`#F59E0B`) ⏳
    - **Invalid (Rejected)**: Rose Red (`#EF4444`) ✕
    - **Remote**: `#3B82F6` 🌎
- **Components**: Glassmorphism (`backdrop-blur-xl`, subtle `rgba(255,255,255,0.08)` borders), rounded corners (`16-24px`), Framer Motion micro-interactions, dark mode by default with light mode switch.

---

## 🛠️ Tech Stack & MERN Architecture

```
d:\mvp\
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # Mongo connection + auto-in-memory fallback & auto-seeder
│   │   │   └── multer.js         # Multer config (PDF/DOCX <= 5MB)
│   │   ├── models/
│   │   │   ├── User.js             # email, passwordHash, role, timestamps
│   │   │   ├── CandidateProfile.js # name, headline, education, skills, experience, resumeUrl
│   │   │   ├── Company.js          # ownerUserId, name, website, verificationStatus, adminNote
│   │   │   ├── Job.js              # companyId, createdBy, title, type, duration, workMode, salary
│   │   │   └── Application.js      # jobId, candidateId, companyId, status
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT authentication
│   │   │   ├── role.js           # Role-based access control (candidate, recruiter, admin)
│   │   │   ├── validate.js       # express-validator handler
│   │   │   └── errorHandler.js   # Centralized error handler
│   │   ├── validations/          # Schema validators
│   │   ├── services/             # Business logic layer
│   │   ├── controllers/          # API route controllers
│   │   ├── routes/               # Modular Express routers
│   │   ├── utils/                # JWT utilities, seed scripts, response formatters
│   │   ├── server.js             # Main server entrypoint
│   │   └── seed.js               # Standalone seed runner
│   ├── uploads/                  # Uploaded resumes directory
│   ├── package.json
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, Badge, Button, GlassCard, Toast
│   │   │   ├── candidate/        # ProfileCompletionRing, ResumeUploadCard, SkillsInput
│   │   │   ├── recruiter/        # CompanyStatusBanner, JobStatsCards, CreateJobModal
│   │   │   ├── admin/            # CompanyReviewModal
│   │   │   └── jobs/             # JobCard, JobDetailModal
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero, floating cards, trust banner, 6 core features
│   │   │   ├── auth/             # Login (with 1-click quick demo buttons), Register
│   │   │   ├── candidate/        # CandidateDashboard, CandidateProfile
│   │   │   ├── recruiter/        # RecruiterDashboard, CompanyProfile
│   │   │   ├── admin/            # AdminDashboard (Pending queue, valid, invalid tabs)
│   │   │   └── jobs/             # PublicJobsPage (Strictly valid companies only)
│   │   ├── context/              # AuthContext, ThemeContext
│   │   ├── services/             # Axios API client & endpoints
│   │   ├── routes/               # ProtectedRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── package.json                  # Root orchestration
```

---

## ⚡ Quick Start Guide

### 1. Database & Seeding
Configured with MongoDB Atlas URI in `server/.env`:
```
MONGODB_URI=mongodb+srv://samikshasingh091_db_user:8VaN41PFksY79zAg@cluster0.tbgw5pd.mongodb.net/truehire_db?retryWrites=true&w=majority
```

To run seed:
```bash
npm run seed
```

### 2. Run Both Frontend and Backend Concurrently
From the root directory:
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:5173`

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Instant Login)

The login screen features **1-click demo buttons** to instantly explore each user role:

| Role | Email | Password | Status / Context |
|---|---|---|---|
| 👑 **Platform Admin** | `admin@truehire.io` | `admin@123` | Moderation queue, approve/reject companies with mandatory notes |
| 🏢 **Recruiter (Verified)** | `recruiter@linear.app` | `recruiter@123` | Linear Labs Inc. — status: **valid** (All published jobs are live on public board) |
| ⏳ **Recruiter (Pending)** | `founder@thebrowser.company` | `recruiter@123` | Arc Interactive — status: **pending** (Top notice shown, jobs hidden from public board until verified!) |
| 🎓 **Candidate** | `alex.dev@stanford.edu` | `candidate@123` | Stanford CS Senior — profile score ring, resume upload, 1-click apply, tracking timeline |
