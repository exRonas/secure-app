const rateLimit = require('express-rate-limit');
const db = require('../db');

// Helper to mark mission complete
const completeMission = async (req, missionId) => {
  if (req.session && req.session.userId) {
    console.log(`🏆 Mission ${missionId} completed by user ${req.session.userId}`);
    await db.run(
      `INSERT INTO user_progress (user_id, mission_id, status, completed_at) 
       VALUES (?, ?, 'completed', CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, mission_id) DO UPDATE SET status='completed', completed_at=CURRENT_TIMESTAMP`,
      [req.session.userId, missionId]
    );
  }
};

// 1. Global API Limiter (DoS protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Higher limit for lab usage
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Real Auth Limiter (The one protecting the student account)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20, 
  message: { error: 'Too many login attempts. Account protected.' }
});

// 3. TARGET Limiter (For Mission 1 - Brute Force)
// This simulates a "Target System" the student is attacking.
// When they hit the limit, we GRANT them the achievement.
const targetBruteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // 5 attempts allowed
  handler: async (req, res) => {
    // 🎯 EDUCATIONAL TRIGGER
    // If we are here, the rate limit was hit. The student succeeded in the mission.
    await completeMission(req, 'mission_bruteforce');
    
    res.status(429).json({ 
      error: '⛔ TARGET SYSTEM LOCKED. BRUTE FORCE DETECTED.',
      mission_success: true,
      message: 'Great job Agent! You triggered the protection.'
    });
  },
  message: { error: 'Target locked' } // Fallback
});

module.exports = { apiLimiter, authLimiter, targetBruteLimiter };
