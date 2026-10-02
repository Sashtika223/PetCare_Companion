# 🐾 Pet Care Companion

A production-quality full-stack web application designed for pet owners to manage pet health profiles, vaccination records, automated reminder schedules, veterinary appointments, active medications, daily activity logs, care tips knowledge base, and notifications from a single centralized dashboard.

---

## 🚀 Key Features

1. **User Authentication:**
   - Secure Registration & Login with JWT authentication and bcrypt password hashing.
   - Protected routes & automatic token persistence.
   - Demo User auto-fill button for fast local evaluation.

2. **Pet Profile Management:**
   - Add, edit, view, and delete multiple pet profiles.
   - Species, breed, age, weight, profile image, microchip ID, allergies, and medical notes.
   - Strict owner data isolation (User A cannot access User B's pet data).

3. **Vaccination Tracking & Automated Reminders:**
   - Track core vaccines and booster dates.
   - Dynamic status calculation (`Up to Date`, `Due Soon`, `Overdue`).
   - Automated notification triggers for upcoming due dates (30d, 7d, 1d, 0d).

4. **Medication Tracking:**
   - Manage active prescriptions, dosages, and administration frequencies (Once daily, Twice daily, Weekly, Custom).
   - Track prescribed veterinarian and start/end dates.

5. **Veterinary Appointments:**
   - Schedule clinic appointments and routine physical checkups.
   - Filter by Upcoming vs. Past History.
   - Mark as Completed, Rescheduled, or Cancelled.

6. **Daily Activity Tracking & Recharts Analytics:**
   - Log daily activities: Walking, Feeding, Playing, Exercise, Grooming, Bathing, Training, and Other.
   - Interactive Recharts bar chart showing weekly active minutes trend.

7. **Pet Care Knowledge Base:**
   - Browse expert care tips categorized by Nutrition, Grooming, Exercise, Hygiene, Vaccination, Medication, Training, General Health, and Safety.
   - Category filtering & search query functionality.
   - Veterinary health disclaimer banner on all informational articles.

8. **Centralized Notification Center:**
   - Notification bell with unread badge count in top header.
   - Filter by All/Unread, mark as read, mark all as read, and delete notifications.
   - Automated background `node-cron` reminder engine scanning upcoming vaccinations and vet appointments.

9. **Centralized Dashboard:**
   - Responsive sidebar / mobile drawer layout.
   - Pet summary cards, health overview widgets, upcoming reminders, and activity analytics.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts, React Hook Form, Zod, Axios, date-fns, React Router.
* **Backend:** Node.js, Express.js, TypeScript, Prisma ORM, JWT, bcryptjs, Zod, node-cron.
* **Database:** PostgreSQL.

---

## 📂 Project Structure

```text
PetCare_Companion/
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Dashboard, PetsList, PetForm, PetProfile, VaccinationsList, VaccinationForm, MedicationsList, MedicationForm, AppointmentsList, AppointmentForm, ActivitiesList, ActivityForm, CareTipsList, CareTipDetail, NotificationsPage, Login, Register
│   │   ├── services/        # api.ts, authService, petService, vaccinationService, medicationService, appointmentService, activityService, careTipService
│   │   ├── types/           # TypeScript interfaces
│   │   └── validators/      # Zod validation schemas
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # authController, petController, vaccinationController, medicationController, appointmentController, activityController, careTipController, notificationController
│   │   ├── jobs/            # reminderEngine.ts (node-cron)
│   │   ├── middleware/      # authMiddleware, errorHandler
│   │   ├── routes/          # authRoutes, petRoutes, vaccinationRoutes, medicationRoutes, appointmentRoutes, activityRoutes, careTipRoutes, notificationRoutes
│   │   ├── utils/           # prisma.ts, jwt.ts, vaccinationHelper.ts
│   │   └── server.ts        # Express server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # PostgreSQL Prisma schema
│   │   └── seed.ts          # Database seed script
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## ⚙️ Prerequisites & Setup

### Prerequisites
- **Node.js**: v20+ or v24+
- **NPM**: v10+
- **PostgreSQL**: Local or Cloud PostgreSQL database instance.

---

## 🔑 Environment Variables

### `backend/.env`
```env
DATABASE_URL="postgresql://postgres@localhost:5434/pet_care_companion?schema=public"
JWT_SECRET="pet_care_secret_jwt_key_2026_super_secure"
PORT=5001
CLIENT_URL="http://localhost:5173"
```

---

## 🔑 Demo Account Credentials

* **Email:** `demo@petcare.com`
* **Password:** `Password123!`

---

## 🚦 Quick Start Instructions

### 1. Database Setup & Seed

```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
# Running on http://localhost:5001
```

### 3. Start Frontend App

```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 📡 Key REST API Endpoints

### Authentication
* `POST /api/auth/register` - Create user account
* `POST /api/auth/login` - User login
* `POST /api/auth/logout` - User logout
* `GET  /api/auth/me` - Fetch authenticated profile

### Pet Management
* `GET    /api/pets` - Get user's pets
* `POST   /api/pets` - Add pet
* `GET    /api/pets/:id` - Detailed pet profile
* `PUT    /api/pets/:id` - Update pet
* `DELETE /api/pets/:id` - Delete pet

### Vaccinations
* `GET    /api/pets/:petId/vaccinations` - Get pet vaccinations
* `POST   /api/pets/:petId/vaccinations` - Add vaccination record
* `PUT    /api/vaccinations/:id` - Update vaccination
* `DELETE /api/vaccinations/:id` - Delete vaccination

### Medications
* `GET    /api/pets/:petId/medications` - Get pet medications
* `POST   /api/pets/:petId/medications` - Add medication
* `PUT    /api/medications/:id` - Update medication
* `DELETE /api/medications/:id` - Delete medication

### Appointments
* `GET    /api/appointments` - Get appointments
* `POST   /api/appointments` - Schedule appointment
* `PUT    /api/appointments/:id` - Update appointment status
* `DELETE /api/appointments/:id` - Delete appointment

### Activities & Care Tips & Notifications
* `GET    /api/pets/:petId/activities` - Get pet activity logs
* `POST   /api/pets/:petId/activities` - Record activity
* `GET    /api/care-tips` - Browse care tips
* `GET    /api/notifications` - Fetch user notifications
* `PATCH  /api/notifications/read-all` - Mark all notifications read
