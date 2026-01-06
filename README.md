# SecureBox - Interactive Cyber Security Course

A full-stack educational platform combining a "SaaS-style" presentation about web security with a functional "Secure Laboratory" to demonstrate the concepts.

Built for the "Ethical Hacking" course (12-13 years old).

## 🏗 Stack

- **Backend:** Node.js, Express, SQLite3, Bcrypt, Helmet
- **Frontend:** React, Vite, Framer Motion (Animations), Lucide (Icons)
- **Style:** Custom CSS (Glassmorphism / Cyberpunk)

## 🚀 Installation & Setup

1. **Install Backend**
   ```bash
   cd backend
   npm install
   ```
   *Note: This uses `sqlite3` which is generally compatible with Windows/Mac/Linux without extra build tools.*

2. **Install Frontend**
   ```bash
   cd frontend
   npm install
   ```

## ⚡ Running the Project

### Option A: Development (Two Terminals)

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server starts on port 5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Vite starts on port 3004
```
Open **http://localhost:3004** in your browser.

### Option B: Production Mode (PM2)

If you have PM2 installed globally:

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```
2. **Start Backend:**
   ```bash
   cd ../backend
   pm2 start server.js --name "secure-box"
   ```

## 📚 Curriculum Flow

1. **Landing Page:** Use this to explain concepts. Scroll down to see interactive code examples for Brute Force, XSS, and Sessions.
2. **Login Lab:** Demonstrate `Login` vs `Register`. Show how `Rate Limiting` works by intentionally failing login multiple times.
3. **Dashboard:** Use the "Secure Data Entry" to try injecting HTML/JS. Explain why it fails (React escaping).

## ⚠️ Database

The database is a file named `security_course.db` inside the `backend` folder. It is created automatically on first run. To reset the app, simply delete this file and restart the backend.
