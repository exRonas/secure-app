const express = require('express');
const router = express.Router();
const db = require('../db');
const { targetBruteLimiter } = require('../middleware/rateLimit');

// Middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Access Denied' });
  next();
};

// --- MISSION 1: BRUTE FORCE TARGET ---
// This is a FAKE login endpoint that the student attacks.
router.post('/target-login', requireAuth, targetBruteLimiter, (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    return res.json({ success: true, message: 'Wow, you guessed it! But that is not the goal.' });
  }
  // Standard failure
  res.status(401).json({ error: 'Invalid credentials' });
});

// --- MISSION 2: XSS TARGET ---
// Student tries to allow an alert()
router.post('/target-xss', requireAuth, async (req, res) => {
  const { content } = req.body;
  
  // 1. Simple backend detection (heuristic)
  // In real life, WAFs do this.
  const hasScript = /<script>/i.test(content) || /javascript:/i.test(content) || /onerror=/i.test(content);
  
  if (hasScript) {
    // 🎯 EDUCATIONAL TRIGGER
    // Payload detected!
    await db.run(
      `INSERT INTO user_progress (user_id, mission_id, status, completed_at) 
       VALUES (?, 'mission_xss', 'completed', CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, mission_id) DO UPDATE SET status='completed', completed_at=CURRENT_TIMESTAMP`,
      [req.session.userId]
    );
    
    // We still return the content to show React escaping
    return res.json({ 
      content, 
      mission_success: true, 
      warning: '🛡️ Payload Detected by Server. React will neutralize it.' 
    });
  }

  res.json({ content });
});


// --- MISSION 3: SQL INJECTION TARGET ---
// Student tries to dump the database via injection.
router.get('/target-sqli', requireAuth, async (req, res) => {
  const { query } = req.query; // e.g. ?query=...
  
  // VULNERABLE LOGIC SIMULATION
  // Real Query would be: "SELECT * FROM secrets WHERE code = '" + query + "'"
  
  const cleanQuery = query ? query.toLowerCase() : '';
  
  // Check for common SQLi patterns
  const isInjection = cleanQuery.includes("' or '1'='1") || 
                      cleanQuery.includes("' or 1=1") ||
                      cleanQuery.includes('" or "1"="1');

  if (isInjection) {
    // 🎯 SUCCESS
    await db.run(
        `INSERT INTO user_progress (user_id, mission_id, status, completed_at) 
         VALUES (?, 'mission_sqli', 'completed', CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, mission_id) DO UPDATE SET status='completed', completed_at=CURRENT_TIMESTAMP`,
        [req.session.userId]
    );

    return res.json({
      success: true,
      data: [
        { id: 1, code: 'ALPHA', secret: 'Коды запуска: 0000' },
        { id: 2, code: 'BRAVO', secret: 'Зона 51: [УДАЛЕНО]' },
        { id: 3, code: 'CHARLIE', secret: 'Пришельцы: Обнаружены' }
      ]
    });
  }

  // Normal check (non-injection)
  if (query === 'secret123') {
     return res.json({ success: true, data: [{Code: 'secret123', secret: 'Верный код, но это не цель.'}]});
  }

  res.json({ success: false, error: 'SQL_ERROR: Query returned 0 results.' });
});

// --- PROGRESS API ---
router.get('/progress', requireAuth, async (req, res) => {
  const progress = await db.all('SELECT mission_id, status FROM user_progress WHERE user_id = ?', [req.session.userId]);
  res.json(progress);
});

module.exports = router;
