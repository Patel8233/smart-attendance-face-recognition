# Smart Attendance System with Face Recognition

A full-stack Smart Attendance System that uses face recognition to identify registered students and mark their attendance automatically.

The system provides secure authentication, role-based access, student and subject management, class sessions, face registration, face-recognition-based attendance, attendance history, and attendance reports.

## Features

- Admin and Teacher Authentication
- JWT-based Authorization
- Role-Based Access Control (RBAC)
- Student Management
- Student Face Registration
- Subject Management
- Class Session Management
- Face Recognition Attendance
- Duplicate Attendance Prevention
- Attendance History
- Student Attendance Reports
- Attendance Percentage Calculation
- Responsive Web Dashboard

## Technology Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS

### Backend
- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Swagger API Documentation

### Face Recognition
- Python
- OpenCV
- LBPH Face Recognizer
- FastAPI
- Uvicorn

### Database
- MongoDB Atlas

## Project Architecture

```text
Frontend (React)
       |
       | REST API
       v
Backend (NestJS)
       |
       |--------------------> MongoDB Atlas
       |
       | HTTP Request
       v
Face Recognition Service
(Python + FastAPI + OpenCV)
```

## Main Workflow

```text
Login
  ↓
Student Registration
  ↓
Face Registration
  ↓
Subject Creation
  ↓
Start Class Session
  ↓
Upload/Capture Face Image
  ↓
Face Recognition
  ↓
Student Identification
  ↓
Attendance Marked
  ↓
End Class Session
  ↓
Attendance History & Report
```

## Project Structure

```text
Smart-Attadence-Face-Recoginition/
│
├── backend/
│   └── NestJS REST API
│
├── frontend/
│   └── React + Vite Web Application
│
├── face-recognition/
│   └── Python Face Recognition Service
│
└── README.md
```

## Running the Project

The project requires three services to run simultaneously.

### 1. Start Backend

```powershell
cd backend
npm install
npm run start
```

Backend:

```text
http://localhost:3000
```

Swagger API Documentation:

```text
http://localhost:3000/api/docs
```

### 2. Start Face Recognition Service

```powershell
cd face-recognition
.\venv\Scripts\Activate.ps1
uvicorn app:app --reload
```

Face Recognition API:

```text
http://127.0.0.1:8000
```

Health Check:

```text
http://127.0.0.1:8000/health
```

### 3. Start Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Environment Variables

Create a `.env` file inside the backend directory.

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_secure_jwt_secret
```

Do not commit real database credentials or JWT secrets to a public repository.

## User Roles

### Admin

Admin can:

- Manage subjects
- View students
- Manage class sessions
- Access attendance records
- View reports

### Teacher

Teacher can:

- View students
- Register student faces
- Start and end class sessions
- Mark attendance using face recognition
- View attendance history
- Generate attendance reports

## Attendance Logic

Attendance is associated with a specific class session.

The system prevents the same student from being marked present more than once in the same class session.

Reports are calculated using completed class sessions:

```text
Total Classes   = Completed Class Sessions
Present Classes = Completed Sessions Attended
Absent Classes  = Total Classes - Present Classes

Attendance Percentage =
(Present Classes / Total Classes) × 100
```

## Security

- Passwords are stored using bcrypt hashing.
- Authentication uses JSON Web Tokens (JWT).
- Protected APIs require a valid Bearer token.
- Role-Based Access Control restricts administrative operations.
- Sensitive credentials are stored using environment variables.

## Privacy Note

Face images and biometric-related data should only be collected from consenting test participants and should be stored and handled securely.

## Future Enhancements

- Live webcam attendance
- Improved face-recognition model
- Attendance analytics and charts
- Export reports to PDF/Excel
- Email notifications
- Cloud deployment
- Mobile application support

## Project Status

Core project functionality is implemented and tested successfully.

```text
Authentication             ✓
Student Management         ✓
Face Registration          ✓
Subject Management         ✓
Class Session Management   ✓
Face Recognition           ✓
Attendance Marking         ✓
Duplicate Prevention       ✓
Attendance History         ✓
Attendance Reports         ✓
Role-Based Access Control  ✓
Responsive Frontend        ✓
```