
# MedPulse | Hospital Management System







![Uploading Screenshot 2026-02-11 161514.png…]()









MedPulse is a modern, comprehensive Hospital Management System (HMS) designed to streamline clinical workflows and improve patient care using integrated AI diagnostics.

## 🚀 Key Features

### 🔐 Admin Dashboard (Med Team)
- **Staff Management**: Add, edit, and remove doctors with expanded profiles (Bio, Phone).
- **Session Scheduling**: Create and manage doctor availability sessions.
- **Booking Control**: Reject or cancel scheduled patient bookings.
- **Live Lists**: View real-time patient name lists for any active session.
- **Global Overview**: Real-time stats on doctors, patients, and bookings.

### 🩺 Doctor Portal
- **Appointment Management**: View upcoming appointments and update visit status (Complete/Cancel).
- **AI-Powered Briefs**: Summarize patient medical history instantly using Gemini AI.
- **Schedule Management**: Monitor assigned work sessions.
- **Profile Control**: Edit professional settings or delete account.

### 👤 Patient Portal
- **Easy Onboarding**: Self-registration for new patients.
- **Smart Booking**: Find specialists and book sessions in real-time.
- **Immediate Feedback**: Receive detailed booking confirmation summaries.
- **AI Health Assistant**: Ask symptoms and receive immediate health advice.
- **Medical History**: Access records of past visits and consultations.

## 🔑 Demo Access

To explore the system with administrative or professional privileges, use the following credentials:

| Role  | Email | Password |
| ------------- | ------------- | ------------- |
| **Admin (Med Team)**  | `admin@admin.com` | `admin123` |
| **Doctor**  | `doctor@med.com` | `doctor123` |

*Note: For Patient roles, you can register a new account or use existing demo entries found in `store.ts`.*

## 🛠️ Technology Stack
- **Frontend**: React (ES6+), Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI Integration**: Google Gemini API (@google/genai)
- **Persistence**: Browser LocalStorage
