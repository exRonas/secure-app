const express = require('express');
const router = express.Router();
const db = require('../db');
const { hashPassword, comparePassword, validatePassword } = require('../auth');
const { authLimiter } = require('../middleware/rateLimit');

// REGISTER
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    // 1. Password Policy Check
    const pwError = validatePassword(password);
    if (pwError) return res.status(400).json({ error: pwError });

    // 2. Check existing user
    const existing = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) return res.status(409).json({ error: 'Username already taken' });

    // 3. Hash Password
    const hashedPassword = await hashPassword(password);

    // 4. Insert into DB
    const result = await db.insert('INSERT INTO users (username, password_hash) VALUES (?, ?)', [
      username, hashedPassword
    ]);

    // 5. Auto login
    req.session.userId = result.lastID;
    req.session.username = username;

    res.status(201).json({ message: 'Identity created', user: { username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'System error' });
  }
});

// LOGIN
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Generic error message to prevent User Enumeration
    const ERROR_MSG = 'Invalid credentials';

    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    
    if (!user) {
      // SECURITY: Timing attack potential here, but for this level we just return generic error
      return res.status(401).json({ error: ERROR_MSG });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: ERROR_MSG });
    }

    // SESSION FIXATION PROTECTION
    // Regenerate session ID upon privilege escalation (log in)
    req.session.regenerate((err) => {
      if (err) return res.status(500).json({ error: 'Session failure' });
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ message: 'Access granted', user: { username: user.username } });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'System error' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('sid'); // Clear cookie strictly
    res.json({ message: 'Session terminated' });
  });
});

// STATUS
router.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({ user: { username: req.session.username } });
  } else {
    res.status(401).json({ user: null });
  }
});

module.exports = router;
