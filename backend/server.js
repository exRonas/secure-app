require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. SECURITY HEADERS (Helmet)
// Sets HSTS, X-Content-Type, X-Frame-Options, etc.
app.use(helmet());

// 2. CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow any origin for this educational demo to avoid connection block
    return callback(null, true);
  },
  credentials: true, // Allow Cookies
}));

// 3. Body Parser
app.use(express.json({ limit: '10kb' })); // Limit body size

// 4. Global Rate Limit
app.use('/api', apiLimiter);

// 5. SESSION MANAGEMENT
app.use(session({
  name: 'sid', // Obscure session name (don't use connect.sid)
  secret: process.env.SESSION_SECRET || 'dev-secret-CHANGE-IN-PROD',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    httpOnly: true, // 🛡️ Prevents XSS cookie theft
    secure: false, // Set 'true' if using HTTPS
    sameSite: 'lax' // CSRF protection
  }
}));

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lab', require('./routes/mission')); // New Mission/Target Routes

const fs = require('fs');

// 7. SERVE STATIC FILES (PRODUCTION)
const frontendPath = path.join(__dirname, '../frontend/dist');
console.log('Static files path:', frontendPath);

if (fs.existsSync(frontendPath)) {
  console.log('✅ Frontend build found!');
} else {
  console.error('❌ Frontend build NOT found at:', frontendPath);
  console.error('   Please run "npm run build" in the frontend directory.');
}

app.use(express.static(frontendPath));

// Handle React Routing, return all requests to React app
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
  } else {
      res.status(404).send('Secure Academy: Frontend build not found. Please run "npm run build" on the server.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Secure Backend active on port ${PORT}`);
});
