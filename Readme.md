# ⚡ HabitPulse — Habit Tracking & Consistency Platform

A full-stack habit tracking application built with **React**, **Node.js**, **MongoDB**, and **Recharts**. Users can register, login, create habits, track daily streaks, and visualize progress with a GitHub-style heatmap and analytics dashboard.

---

## 🌐 Live Demo

- **Frontend**: https://habitpulse-you.vercel.app/
- **Backend**: https://habbittraking.onrender.com/

---

## ✨ Features

- 🔐 User Authentication (Signup / Login / Logout)
- 🛡️ JWT Token with Bearer Auth & Protected Routes
- ✅ Create / Edit / Delete Habits
- 🔁 Toggle Habit Completion (Tick / Untick)
- 🔥 Custom Streak Algorithm (Current & Longest Streak)
- 📅 365-Day GitHub-Style Contribution Heatmap
- 📊 SVG Circular Consistency Progress Ring
- 📈 Weekly Completion Area Chart (Recharts)
- 📱 Fully Responsive Split-Screen Dashboard
- 🎨 Modern Dark Glassmorphism UI with Neon Accents
- 🔄 Real-Time Stats Update on Tick/Untick
- 📜 Completion History with Date Logs

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React | UI Library |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Axios | API Calls |
| React Router DOM | Routing |
| Recharts | Charts & Graphs |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | Server Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| cors | Cross-Origin Requests |

---

## 📁 Project Structure

```bash
habit-tracker/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── habit.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── auth.model.js
│   │   │   └── habit.model.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── habit.route.js
│   │   ├── db/
│   │   │   └── db.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── SingleHabit.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
│
└── README.md
🚀 Getting Started
Prerequisites
Node.js (v18+)
MongoDB Atlas Account
1. Clone the Repository
Bash

git clone https://github.com/MamtaKumari2006/habbitTraking
cd Habit-Tracker
2. Backend Setup
Bash

cd Backend
npm install
Create .env file:

env

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start backend:

Bash

npm run dev
3. Frontend Setup
Bash

cd Frontend
npm install
Configure base URL in src/api/axios.js:

JavaScript

baseURL: "http://localhost:3000/api"
Start frontend:

Bash

npm run dev
🔗 API Endpoints
Auth
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login user
POST	/api/auth/logout	Logout user
Habits
Method	Endpoint	Description
POST	/api/habits/create	Create new habit
GET	/api/habits/list	Get all user habits
GET	/api/habits/list/:id	Get single habit
PUT	/api/habits/list/:id	Update habit
DELETE	/api/habits/list/:id	Delete habit
POST	/api/habits/list/:id/completed	Mark habit complete
POST	/api/habits/list/:id/uncompleted	Untick habit
Analytics
Method	Endpoint	Description
GET	/api/habits/analytics	Overall dashboard stats
GET	/api/habits/list/:id/analytics	Single habit analytics
⚙️ How It Works
text

User → Frontend (React)
         ↓
    Axios API Call (JWT Header)
         ↓
    Backend (Express)
         ↓
    Auth Middleware (JWT Verify)
         ↓
    Controller Logic
         ↓
    MongoDB (Save/Update Habit)
         ↓
    Streak Algorithm (Date Normalize)
         ↓
    Return Updated Data
         ↓
    Dashboard Re-renders
         ↓
    Heatmap + Charts Update


🧠 What I Learned
Full-stack MERN application architecture
JWT Bearer token authentication & protected routes
MongoDB schema design with nested arrays
Custom streak algorithm with date normalization
Timezone handling (UTC vs Local Time collisions)
GitHub-style contribution heatmap from scratch
SVG circular progress ring mathematics
Recharts area chart integration
React state management for real-time UI updates
Concurrent API calls with Promise.all()
CORS configuration for production deployment
Frontend-Backend integration with Axios interceptors
SPA routing rewrites on Vercel
Git version control & deployment strategies


🔮 Future Improvements
 Dark/Light theme toggle
 Weekly & Monthly streak logic
 Push notification reminders
 Habit categories & tags
 Social sharing of streaks
 Calendar date picker for manual logging
 Export analytics as PDF
 PWA support (install as app)
 Rate limiting on APIs
 Unit & integration testing


🤔 Challenges Faced
Timezone mismatch between frontend (Local) and MongoDB (UTC) causing streak breaks
Double slash URL resolution in Axios baseURL
React Router nested Routes causing useLocation bugs
CORS preflight failures on Vercel-Render cross-origin requests
Streak recalculation on untick (undo) action
GitHub heatmap grid alignment with dynamic month labels
Token persistence across browser sessions
Render cold start delay on free tier

👩‍💻 Author
Mamta Kumari

GitHub: https://github.com/MamtaKumari2006
LinkedIn: https://www.linkedin.com/in/mamta-kumari-262b6b373/

📄 License
This project is for learning and portfolio purposes.

⭐ Show Your Support
If you found this project helpful, please give it a ⭐ on GitHub!

