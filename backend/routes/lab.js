const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware: Verify Session
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Access Denied' });
  next();
};

// GET Notes
router.get('/notes', requireAuth, async (req, res) => {
  try {
    // SECURITY: Parameterized query prevents SQL Injection
    const notes = await db.all(
      'SELECT id, content, created_at FROM notes WHERE user_id = ? ORDER BY created_at DESC', 
      [req.session.userId]
    );
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Data retrieval failed' });
  }
});

// CREATE Note
router.post('/notes', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Empty content' });

    // SECURITY NOTE: We store the raw content.
    // Protection against XSS happens at the 'Render' stage (React escapes by default).
    // If we were server-side rendering HTML, we would need to sanitize here or on output.
    
    const result = await db.insert(
      'INSERT INTO notes (user_id, content) VALUES (?, ?)',
      [req.session.userId, content]
    );

    res.status(201).json({ 
      id: result.lastID, 
      content, 
      created_at: new Date() 
    });
  } catch (err) {
    res.status(500).json({ error: 'Write failed' });
  }
});

module.exports = router;
